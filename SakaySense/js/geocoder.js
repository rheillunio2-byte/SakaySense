/* SakaySense — OpenStreetMap Nominatim client.
 *
 * Usage-policy measures (https://operations.osmfoundation.org/policies/nominatim/):
 *  - at most one network request per second (serialised queue, 1.1 s spacing)
 *  - callers debounce typing; this module also aborts superseded requests
 *  - results are cached in memory and in localStorage (7 days) so repeat searches cost nothing
 *  - no API key, no e-mail or personal data is sent; the browser supplies the Referer
 */
(function () {
  "use strict";
  const SS = (window.SakaySense = window.SakaySense || {});

  const ENDPOINT = "https://nominatim.openstreetmap.org";
  const MIN_INTERVAL_MS = 1100;
  const TIMEOUT_MS = 10000;
  const CACHE_KEY = "sakaysense-geocache-v1";
  const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
  const CACHE_MAX = 80;
  // left,top,right,bottom around Cagayan de Oro City
  const CDO_VIEWBOX = "124.50,8.62,124.90,8.30";

  const cache = new Map(); // key -> {t, v}
  const stats = { requests: 0, cacheHits: 0 };
  let lastRequestAt = 0;
  let queue = Promise.resolve();

  class GeocodeError extends Error {
    constructor(kind, message) { super(message); this.name = "GeocodeError"; this.kind = kind; }
  }
  const abortError = () => new DOMException("Aborted", "AbortError");

  (function loadCache() {
    const stored = SS.util.storageGet(CACHE_KEY, {});
    const now = Date.now();
    Object.entries(stored || {}).forEach(([key, entry]) => {
      if (entry && typeof entry.t === "number" && now - entry.t < CACHE_TTL_MS) cache.set(key, entry);
    });
  })();

  function persistCache() {
    const newest = [...cache.entries()].sort((a, b) => b[1].t - a[1].t).slice(0, CACHE_MAX);
    SS.util.storageSet(CACHE_KEY, Object.fromEntries(newest));
  }
  function cacheGet(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.t > CACHE_TTL_MS) { cache.delete(key); return null; }
    stats.cacheHits += 1;
    return entry.v;
  }
  function cacheSet(key, value) {
    cache.set(key, { t: Date.now(), v: value });
    persistCache();
  }

  function sleep(ms, signal) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { signal && signal.removeEventListener("abort", onAbort); resolve(); }, ms);
      function onAbort() { clearTimeout(timer); reject(abortError()); }
      if (signal) signal.addEventListener("abort", onAbort, { once: true });
    });
  }

  /** Run `task` after previous requests, keeping >= MIN_INTERVAL_MS between network calls. */
  function schedule(task, signal) {
    const run = queue.then(async () => {
      if (signal && signal.aborted) throw abortError();
      const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
      if (wait > 0) await sleep(wait, signal);
      if (signal && signal.aborted) throw abortError();
      lastRequestAt = Date.now();
      return task();
    });
    queue = run.catch(() => {});
    return run;
  }

  async function request(path, params, signal) {
    const url = new URL(ENDPOINT + path);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const ctrl = new AbortController();
    const relay = () => ctrl.abort();
    if (signal) signal.addEventListener("abort", relay, { once: true });
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    stats.requests += 1;
    let res;
    try {
      res = await fetch(url.toString(), { signal: ctrl.signal, headers: { Accept: "application/json" } });
    } catch (err) {
      if (signal && signal.aborted) throw abortError();
      throw new GeocodeError(ctrl.signal.aborted ? "timeout" : "network",
        ctrl.signal.aborted ? "The search service took too long to respond." : "Can't reach the search service. Check your internet connection.");
    } finally {
      clearTimeout(timer);
      if (signal) signal.removeEventListener("abort", relay);
    }
    if (res.status === 429 || res.status === 503) throw new GeocodeError("busy", "The search service is busy. Please wait a moment and try again.");
    if (!res.ok) throw new GeocodeError("http", `The search service returned an error (${res.status}).`);
    try { return await res.json(); } catch (e) { throw new GeocodeError("http", "The search service sent an unreadable response."); }
  }

  function normalize(r) {
    const lat = parseFloat(r.lat), lng = parseFloat(r.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    const display = String(r.display_name || "").trim();
    const name = (r.name && String(r.name).trim()) || display.split(",")[0].trim() || "Unnamed place";
    let address = display;
    if (display.toLowerCase().startsWith(name.toLowerCase())) address = display.slice(name.length).replace(/^[,\s]+/, "");
    return { id: `${r.osm_type || "x"}${r.osm_id || `${lat},${lng}`}`, name, address, lat, lng, kind: r.type || r.category || "" };
  }

  /** Search places. opts.outside = true removes the Cagayan de Oro / Philippines restriction. */
  async function search(query, opts) {
    const { outside = false, signal } = opts || {};
    const q = String(query || "").trim().replace(/\s+/g, " ");
    if (!q) return [];
    const key = `s|${outside ? "world" : "cdo"}|${q.toLowerCase()}`;
    const hit = cacheGet(key);
    if (hit) return hit;
    const params = { q, format: "jsonv2", limit: "6", "accept-language": "en", dedupe: "1", viewbox: CDO_VIEWBOX, bounded: outside ? "0" : "1" };
    if (!outside) params.countrycodes = "ph";
    const raw = await schedule(() => request("/search", params, signal), signal);
    const seen = new Set();
    const results = (Array.isArray(raw) ? raw : []).map(normalize).filter((p) => {
      if (!p || seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
    cacheSet(key, results);
    return results;
  }

  /** Reverse geocode a coordinate (used only after the user shares their location). Returns a place or null. */
  async function reverse(lat, lng, opts) {
    const { signal } = opts || {};
    const key = `r|${lat.toFixed(4)},${lng.toFixed(4)}`;
    const hit = cacheGet(key);
    if (hit) return hit;
    const raw = await schedule(() => request("/reverse", { lat: String(lat), lon: String(lng), format: "jsonv2", zoom: "18", "accept-language": "en" }, signal), signal);
    const place = raw && !raw.error ? normalize(raw) : null;
    if (place) cacheSet(key, place);
    return place;
  }

  SS.Geocoder = { search, reverse, stats, GeocodeError, MIN_INTERVAL_MS };
})();
