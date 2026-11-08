/* SakaySense — application entry point.
 * Wires the modules in /js together. Everything is initialised exactly once (guarded) so
 * event listeners can never be registered twice.
 */
(function () {
  "use strict";
  const SS = window.SakaySense;
  const { $, el, toast, formatKm } = SS.util;
  if (SS.__started) return;
  SS.__started = true;

  const state = { origin: null, destination: null, category: "regular", planned: null };
  let originField, destField;

  /* ---------- small UI helpers ---------- */
  function updateHero() {
    $("heroFrom").textContent = state.origin ? state.origin.name : "Choose your location";
    $("heroTo").textContent = state.destination ? state.destination.name : "Where to?";
  }

  function showHint() {
    $("routeResults").replaceChildren(el("span", { class: "result-hint" }, "Popular destinations: ",
      ...[["sm-cdo", "SM City CDO"], ["cogon-market", "Cogon Market"], ["ustp", "USTP"]].map(([id, name]) =>
        el("button", { type: "button", dataset: { place: id }, text: name }))));
    state.planned = null;
    SS.Fare.setTrip(null);
  }

  function describeMap() {
    const o = state.origin, d = state.destination;
    $("mapSummary").textContent = o && d
      ? `Map showing ${o.name} (A) and ${d.name} (B), about ${formatKm(SS.util.haversineKm(o, d))} apart in a straight line.`
      : o ? `Map centred on ${o.name} (A).` : d ? `Map centred on ${d.name} (B).` : "Map of Cagayan de Oro. Choose a starting point and a destination to see them here.";
  }

  function findRoutes() {
    if (!state.origin || !state.destination) {
      if (!state.origin) originField.showError("Choose a starting point from the suggestions.");
      if (!state.destination) destField.showError("Choose a destination from the suggestions.");
      toast("Please choose both locations.");
      return;
    }
    const planned = SS.Routes.render($("routeResults"), state.origin, state.destination, state.category, {
      useDistance(p) {
        SS.Fare.setDistance(p.roadKm);
        $("fares").scrollIntoView({ behavior: SS.util.prefersReducedMotion() ? "auto" : "smooth" });
        toast("Distance set from your planned trip.");
      },
    });
    state.planned = planned;
    if (!planned.tooClose) SS.Fare.setTrip({ km: planned.roadKm, from: state.origin.name, to: state.destination.name });
    else SS.Fare.setTrip(null);
  }

  function onPlaceChange(kind, place) {
    state[kind] = place;
    SS.Map.setPoint(kind, place);
    updateHero();
    describeMap();
    if (state.origin && state.destination) findRoutes();
    else showHint();
  }

  /* ---------- geolocation (only after the user presses the button AND grants permission) ---------- */
  function useMyLocation() {
    const btn = $("useLocation");
    if (!("geolocation" in navigator)) { originField.showError("Your browser doesn't support location sharing."); return; }
    btn.disabled = true;
    btn.classList.add("is-busy");
    originField.showError("");
    $("originStatus").textContent = "Waiting for your browser's location permission…";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        btn.disabled = false; btn.classList.remove("is-busy");
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        const place = { name: "My current location", address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng, accuracy, id: "geolocation" };
        originField.setPlace(place);
        // Optional nicety: look up a street address. If it fails we simply keep the coordinates.
        SS.Geocoder.reverse(lat, lng).then((found) => {
          if (!found || !state.origin || state.origin.id !== "geolocation") return;
          state.origin.address = found.name && found.address ? `${found.name}, ${found.address}` : (found.address || found.name);
          SS.Map.setPoint("origin", state.origin, { quiet: true }); // refresh popup text without moving the map
        }).catch(() => {});
      },
      (err) => {
        btn.disabled = false; btn.classList.remove("is-busy");
        const messages = {
          1: "Location permission was denied. You can still type your starting point, or allow location access in your browser's site settings.",
          2: "Your location couldn't be determined. Please type your starting point instead.",
          3: "Finding your location took too long. Please try again or type your starting point.",
        };
        let msg = messages[err.code] || "Couldn't get your location.";
        if (!window.isSecureContext) msg += " (Location sharing only works on https:// or http://localhost.)";
        originField.showError(msg);
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 });
  }

  /* ---------- init ---------- */
  function initPlanner() {
    const outside = $("searchOutside");
    const getOutside = () => outside.checked;

    originField = SS.LocationField.create({
      input: $("originInput"), list: $("originList"), clearBtn: $("originClear"), status: $("originStatus"),
      getOutside, label: "Starting point", onChange: (p) => onPlaceChange("origin", p),
    });
    destField = SS.LocationField.create({
      input: $("destinationInput"), list: $("destinationList"), clearBtn: $("destinationClear"), status: $("destinationStatus"),
      getOutside, label: "Destination", onChange: (p) => onPlaceChange("destination", p),
    });

    outside.addEventListener("change", () => { originField.refresh(); destField.refresh(); });

    $("swapRoute").addEventListener("click", () => {
      const o = state.origin, d = state.destination;
      const oText = $("originInput").value, dText = $("destinationInput").value;
      // Swap selected places silently, then update map/results once.
      originField.setPlace(d, true);
      destField.setPlace(o, true);
      // Keep any unselected typed text swapped too.
      if (!d && dText) { $("originInput").value = dText; $("originClear").hidden = false; }
      if (!o && oText) { $("destinationInput").value = oText; $("destinationClear").hidden = false; }
      state.origin = d; state.destination = o;
      SS.Map.setPoint("origin", d);
      SS.Map.setPoint("destination", o);
      updateHero(); describeMap();
      if (state.origin && state.destination) findRoutes(); else showHint();
    });

    $("useLocation").addEventListener("click", useMyLocation);
    $("routeForm").addEventListener("submit", (e) => { e.preventDefault(); findRoutes(); });

    // Passenger category shared with the fare estimator
    $("passengerCategory").addEventListener("change", (e) => {
      state.category = e.target.value;
      SS.Fare.setCategory(state.category);
      if (state.origin && state.destination) findRoutes();
    });

    // Delegated: popular-destination chips (re-created whenever the hint is shown)
    $("routeResults").addEventListener("click", (e) => {
      const chip = e.target.closest("[data-place]");
      if (chip) destField.chooseSuggestionById(chip.dataset.place);
    });
  }

  function initChrome() {
    $("year").textContent = new Date().getFullYear();
    const toggle = $("menuToggle"), nav = $("mobileNav");
    const setMenu = (open) => { nav.hidden = !open; toggle.setAttribute("aria-expanded", String(open)); toggle.textContent = open ? "✕" : "☰"; };
    toggle.addEventListener("click", () => setMenu(nav.hidden));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !nav.hidden) { setMenu(false); toggle.focus(); } });
    $("planTripBtn").addEventListener("click", () => $("route-search").scrollIntoView({ behavior: SS.util.prefersReducedMotion() ? "auto" : "smooth" }));
  }

  function start() {
    initChrome();
    SS.Map.init($("map"));
    SS.Fare.init({
      onCategoryChange(value) {
        state.category = value;
        $("passengerCategory").value = value;
        if (state.origin && state.destination) findRoutes();
      },
    });
    SS.Reports.getTripPlace = (which) => (which === "origin" ? state.origin : state.destination);
    SS.Reports.init();
    initPlanner();
    describeMap();
    showHint();
    SS.__app = { state, findRoutes }; // handy for debugging in the console
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
