/* SakaySense — Leaflet + OpenStreetMap map wrapper.
 * Degrades gracefully: if Leaflet fails to load (offline / blocked CDN) every method is a safe no-op
 * and a message is shown in place of the map; the rest of the app keeps working.
 */
(function () {
  "use strict";
  const SS = (window.SakaySense = window.SakaySense || {});
  const { el, prefersReducedMotion } = SS.util;

  const state = { map: null, markers: {}, circle: null, line: null, container: null, tileErrors: 0, noticeEl: null };

  function pinIcon(kind, letter) {
    return L.divIcon({
      className: `ss-pin ss-pin-${kind}`,
      html: `<span><b>${letter}</b></span>`,
      iconSize: [34, 42],
      iconAnchor: [17, 40],
      popupAnchor: [0, -36],
    });
  }

  function makeControl(position, build) {
    const Control = L.Control.extend({
      onAdd() {
        const node = build();
        L.DomEvent.disableClickPropagation(node);
        L.DomEvent.disableScrollPropagation(node);
        return node;
      },
    });
    return new Control({ position });
  }

  function showFallback(message) {
    if (!state.container) return;
    state.container.classList.add("map-unavailable");
    state.container.replaceChildren(el("div", { class: "map-fallback", role: "alert" },
      el("strong", { text: "Map unavailable" }),
      el("p", { text: message }),
      el("p", { text: "Search, route estimates, the fare estimator and delay reports still work." })));
  }

  function init(container) {
    state.container = container;
    if (!container) return false;
    if (state.map) return true;
    if (!window.L || typeof L.map !== "function") {
      showFallback("The map library could not be loaded. Check your internet connection and reload the page.");
      return false;
    }
    const map = L.map(container, { center: [SS.CDO.center.lat, SS.CDO.center.lng], zoom: SS.CDO.zoom, minZoom: 3, worldCopyJump: true });
    state.map = map;

    // Basemaps that need NO API key. (CARTO's free raster tiles now require a key, and OpenStreetMap's own tile
    // server rejects requests without a valid Referer — e.g. a page opened from file:// — so neither is the default.)
    // Default: Esri World Street Map. Alternatives are available from the layers button.
    const tiles = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19, attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, USGS, and the GIS user community",
    }).addTo(map);
    const osmCredit = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';
    const osmTiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: osmCredit, referrerPolicy: "origin" });
    const topoTiles = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 17, subdomains: "abc",
      attribution: osmCredit + ', SRTM | &copy; <a href="https://opentopomap.org" target="_blank" rel="noopener">OpenTopoMap</a> (CC-BY-SA)',
    });
    L.control.layers({ "Street map (Esri)": tiles, "OpenStreetMap Standard": osmTiles, "Topographic (OpenTopoMap)": topoTiles }, null, { position: "topright", collapsed: true }).addTo(map);
    [tiles, osmTiles, topoTiles].forEach((layer) => {
      layer.on("tileerror", () => {
        state.tileErrors += 1;
        if (state.tileErrors === 4) notice("Some map tiles couldn't load. Check your connection, or switch basemap with the layers button.");
      });
      layer.on("tileload", () => { if (state.tileErrors >= 4) { state.tileErrors = 0; notice(""); } });
    });

    L.control.scale({ imperial: false, position: "bottomright" }).addTo(map);

    // Quick actions (top right)
    makeControl("topright", () => el("div", { class: "map-actions" },
      el("button", { type: "button", class: "map-btn", title: "Recenter on Cagayan de Oro", "aria-label": "Recenter map on Cagayan de Oro", on: { click: recenter } }, "◎ ", el("span", { text: "CDO" })),
      el("button", { type: "button", class: "map-btn", id: "mapFitBtn", title: "Fit both locations", "aria-label": "Zoom to show origin and destination", on: { click: fit } }, "⤢ ", el("span", { text: "Fit trip" })),
    )).addTo(map);

    // Legend (bottom left)
    makeControl("bottomleft", () => {
      const open = window.innerWidth > 640;
      return el("details", { class: "map-legend", open },
        el("summary", { text: "Legend" }),
        el("ul", {},
          el("li", {}, el("i", { class: "lg lg-origin", text: "A" }), "Starting point"),
          el("li", {}, el("i", { class: "lg lg-dest", text: "B" }), "Destination"),
          el("li", {}, el("i", { class: "lg lg-line" }), "Straight-line link (not a transit route)")));
    }).addTo(map);

    // Notice strip (tile errors etc.)
    state.noticeEl = el("div", { class: "map-notice", role: "status", hidden: true });
    container.appendChild(state.noticeEl);

    if (window.ResizeObserver) new ResizeObserver(() => map.invalidateSize()).observe(container);
    else window.addEventListener("resize", () => map.invalidateSize());
    return true;
  }

  function notice(text) {
    if (!state.noticeEl) return;
    state.noticeEl.textContent = text;
    state.noticeEl.hidden = !text;
  }

  function popupNode(place, role) {
    return el("div", { class: "map-popup" },
      el("small", { text: role }),
      el("strong", { text: place.name }),
      place.address ? el("p", { text: place.address }) : null);
  }

  /** kind: "origin" | "destination"; place: {name,address,lat,lng,accuracy?} or null to remove. */
  function setPoint(kind, place, opts) {
    if (!state.map) return;
    const existing = state.markers[kind];
    if (existing) { existing.remove(); delete state.markers[kind]; }
    if (kind === "origin" && state.circle) { state.circle.remove(); state.circle = null; }
    if (place) {
      const isOrigin = kind === "origin";
      const role = isOrigin ? "Starting point" : "Destination";
      const marker = L.marker([place.lat, place.lng], {
        icon: pinIcon(isOrigin ? "origin" : "dest", isOrigin ? "A" : "B"),
        title: `${role}: ${place.name}`,
        alt: `${role}: ${place.name}`,
        keyboard: true,
        riseOnHover: true,
      }).addTo(state.map);
      marker.bindPopup(popupNode(place, role));
      state.markers[kind] = marker;
      if (isOrigin && place.accuracy && place.accuracy < 5000) {
        state.circle = L.circle([place.lat, place.lng], { radius: place.accuracy, color: "#0e7890", weight: 1, fillOpacity: 0.08, interactive: false }).addTo(state.map);
      }
    }
    if (!(opts && opts.quiet)) refresh();
  }

  function refresh() {
    const map = state.map;
    if (!map) return;
    if (state.line) { state.line.remove(); state.line = null; }
    const o = state.markers.origin, d = state.markers.destination;
    const animate = !prefersReducedMotion();
    if (o && d) {
      state.line = L.polyline([o.getLatLng(), d.getLatLng()], { color: "#0e7890", weight: 3, opacity: 0.85, dashArray: "6 9", interactive: true })
        .bindTooltip("Straight-line link only — not a transit route", { sticky: true })
        .addTo(map);
      fit();
    } else if (o || d) {
      map.setView((o || d).getLatLng(), Math.max(map.getZoom(), 15), { animate });
    } else {
      recenter();
    }
  }

  function fit() {
    const map = state.map;
    if (!map) return;
    const o = state.markers.origin, d = state.markers.destination;
    const animate = !prefersReducedMotion();
    if (o && d) map.fitBounds(L.latLngBounds([o.getLatLng(), d.getLatLng()]), { padding: [60, 60], maxZoom: 16, animate });
    else if (o || d) map.setView((o || d).getLatLng(), 15, { animate });
    else recenter();
  }

  function recenter() {
    if (!state.map) return;
    state.map.setView([SS.CDO.center.lat, SS.CDO.center.lng], SS.CDO.zoom, { animate: !prefersReducedMotion() });
  }

  function invalidate() { if (state.map) state.map.invalidateSize(); }

  SS.Map = { init, setPoint, fit, recenter, invalidate, isAvailable: () => !!state.map, _state: state };
})();
