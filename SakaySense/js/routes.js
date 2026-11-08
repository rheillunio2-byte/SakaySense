/* SakaySense — transport option discovery and result cards.
 *
 * Two kinds of cards:
 *  1. "Route data"  — only when SakaySense.ROUTES (routes-data.js) contains a verified route whose
 *                     stops match both locations. The dataset ships empty, so none appear by default.
 *  2. "Estimate"    — one card per mode, with fare/time derived from the sample models in data.js.
 *                     Route name, stops and transfers are shown as "not available" — never invented.
 */
(function () {
  "use strict";
  const SS = (window.SakaySense = window.SakaySense || {});
  const { el, haversineKm, formatKm, formatPeso } = SS.util;

  const MODE_ORDER = ["jeepney", "bus", "motorela"];

  function nearestStop(route, point) {
    let best = null;
    route.stops.forEach((stop, index) => {
      const d = haversineKm(stop, point) * 1000;
      if (!best || d < best.distance) best = { index, distance: d };
    });
    return best;
  }

  /** Verified routes from routes-data.js that serve this origin → destination pair. */
  function matchVerified(origin, dest) {
    return (SS.ROUTES || []).filter((r) => Array.isArray(r.stops) && r.stops.length >= 2).map((route) => {
      const radius = route.matchRadiusM || 500;
      const a = nearestStop(route, origin), b = nearestStop(route, dest);
      if (a.distance > radius || b.distance > radius || a.index === b.index) return null;
      if (a.index > b.index && !route.bidirectional) return null;
      const lo = Math.min(a.index, b.index), hi = Math.max(a.index, b.index);
      let between = route.stops.slice(lo + 1, hi).map((s) => s.name);
      if (a.index > b.index) between = between.reverse();
      return { route, between, boardM: a.distance, alightM: b.distance };
    }).filter(Boolean);
  }

  function timeRange(mode, roadKm) {
    const [slow, fast] = SS.TRAVEL_MODEL.modes[mode].speed;
    const lo = Math.max(1, Math.round((roadKm / fast) * 60)), hi = Math.max(lo + 1, Math.round((roadKm / slow) * 60));
    return [lo, hi];
  }

  /** Build everything the UI needs for a trip. */
  function plan(origin, dest, category) {
    const straightKm = haversineKm(origin, dest);
    const roadKm = straightKm * SS.TRAVEL_MODEL.circuity;
    const legacy = SS.LEGACY_ROUTE_NOTES[`${origin.suggestionId}|${dest.suggestionId}`] || null;
    const result = { straightKm, roadKm, legacy, verified: [], estimates: [], tooClose: straightKm < SS.TRAVEL_MODEL.shortTripKm };
    if (result.tooClose) return result;

    result.verified = matchVerified(origin, dest).map((m) => {
      const r = m.route, mode = SS.FARE_MODEL.modes[r.mode] ? r.mode : "jeepney";
      let fare = null;
      if (r.fare && Number.isFinite(r.fare.regular)) fare = r.fare.regular * (category === "regular" ? 1 : 1 - SS.FARE_MODEL.discountRate);
      return { ...m, mode, fare, minutes: Array.isArray(r.travelMinutes) ? r.travelMinutes : null };
    });

    MODE_ORDER.forEach((mode) => {
      const longTrip = roadKm > SS.FARE_MODEL.maxKm;
      const calc = longTrip ? null : SS.Fare.calc(mode, category, roadKm);
      const fare = calc ? calc.total : null;
      const notes = [];
      if (mode === "motorela" && roadKm > SS.TRAVEL_MODEL.motorelaMaxKm) notes.push("Motorelas are generally for shorter local trips — this distance may not be practical.");
      if (longTrip) notes.push("Too far for the sample fare model — check the fare with the operator.");
      result.estimates.push({ mode, fare, minutes: timeRange(mode, roadKm), notes });
    });
    return result;
  }

  function metaRow(label, value, muted) {
    return el("div", {}, el("dt", { text: label }), el("dd", { class: muted ? "muted" : null }, value));
  }

  function card({ mode, badge, badgeClass, title, fare, fareNote, rows, notes, from, to }) {
    const info = SS.TRAVEL_MODEL.modes[mode];
    return el("article", { class: "route-card" },
      el("header", {},
        el("span", { class: "mode-icon", "aria-hidden": "true", text: info.icon }),
        el("div", { class: "route-title" }, el("h3", { text: title }), el("span", { class: `badge ${badgeClass}`, text: badge })),
        el("div", { class: "route-price" },
          el("strong", { text: fare === null ? "Check locally" : formatPeso(fare) }),
          el("small", { text: fareNote }))),
      el("dl", { class: "route-meta" }, rows),
      notes.length ? el("ul", { class: "route-notes" }, notes.map((n) => el("li", { text: n }))) : null);
  }

  function render(container, origin, dest, category, handlers) {
    const p = plan(origin, dest, category);
    const catLabel = SS.FARE_MODEL.categories[category];
    const frag = document.createDocumentFragment();

    frag.append(el("div", { class: "trip-summary" },
      el("div", { class: "trip-line" }, el("strong", { text: origin.name }), el("span", { class: "trip-arrow", "aria-hidden": "true", text: "→" }), el("strong", { text: dest.name })),
      el("div", { class: "trip-stats" },
        el("span", {}, el("small", { text: "STRAIGHT-LINE" }), formatKm(p.straightKm)),
        el("span", {}, el("small", { text: "EST. ROAD DISTANCE" }), p.tooClose ? "—" : `≈ ${formatKm(p.roadKm)}`)),
      el("p", { class: "trip-caption", text: "The dashed line on the map is only a straight link between your two points. It is not a jeepney, bus or motorela route. Road distance is a rough estimate (straight line × 1.3)." })));

    if (p.tooClose) {
      frag.append(el("div", { class: "result-empty" }, el("strong", { text: "These two places are very close." }), el("p", { text: `They are about ${formatKm(p.straightKm)} apart in a straight line — walking may be easier than riding.` })));
      container.replaceChildren(frag);
      return p;
    }

    if (p.legacy) {
      frag.append(el("div", { class: "legacy-note" },
        el("strong", { text: "Earlier sample note for this pair" }),
        el("p", { text: `${p.legacy.mode} · ${p.legacy.fare} · ${p.legacy.detail}` })));
    }

    if (p.verified.length) {
      frag.append(el("h4", { class: "result-heading", text: "Routes from route data" }));
      p.verified.forEach((v) => {
        const r = v.route;
        const info = SS.FARE_MODEL.modes[v.mode];
        const mins = v.minutes || null;
        frag.append(card({
          mode: v.mode, badge: "Route data", badgeClass: "badge-data",
          title: `${info.label}${r.name ? " · " + r.name : ""}`,
          fare: v.fare, fareNote: v.fare === null ? "No fare in route data" : `${catLabel} · from route data`,
          from: origin.name, to: dest.name,
          rows: [
            metaRow("Route", r.name || "Unnamed route"),
            metaRow("Operator", r.operator || "Not specified", !r.operator),
            metaRow("From → To", `${origin.name} → ${dest.name}`),
            metaRow("Stops between", v.between.length ? v.between.join(" › ") : "None listed", !v.between.length),
            metaRow("Travel time", mins ? `${mins[0]}–${mins[1]} min` : "Not in route data", !mins),
            metaRow("Transfers", Number.isFinite(r.transfers) ? (r.transfers === 0 ? "None" : String(r.transfers)) : "Not specified", !Number.isFinite(r.transfers)),
          ],
          notes: [r.notes, r.source ? `Source: ${r.source}` : null].filter(Boolean),
        }));
      });
    }

    frag.append(el("h4", { class: "result-heading", text: p.verified.length ? "Other options (estimates)" : "Transport options (estimates)" }));
    p.estimates.forEach((e) => {
      const info = SS.FARE_MODEL.modes[e.mode];
      frag.append(card({
        mode: e.mode, badge: "Estimate", badgeClass: "badge-est", title: info.label,
        fare: e.fare, fareNote: e.fare === null ? "Beyond sample model" : `${catLabel} · sample rate`,
        from: origin.name, to: dest.name,
        rows: [
          metaRow("Route name", "Not available — no verified route data", true),
          metaRow("From → To", `${origin.name} → ${dest.name}`),
          metaRow("Intermediate stops", "Not available", true),
          metaRow("Travel time", `≈ ${e.minutes[0]}–${e.minutes[1]} min (assumed speeds, excl. waiting)`),
          metaRow("Transfers", "Not determined", true),
        ],
        notes: e.notes,
      }));
    });

    frag.append(el("div", { class: "result-actions" },
      el("button", { type: "button", class: "btn btn-ghost", on: { click: () => handlers && handlers.useDistance && handlers.useDistance(p) } }, "Use this distance in the fare estimator ", el("span", { text: "↓" }))));

    frag.append(el("p", { class: "result-disclaimer", text: "Estimates only. Fares use the app's sample rates and times use assumed average speeds — they are not official figures, schedules or live data. Please confirm routes and fares with the driver, operator or local authority." }));
    container.replaceChildren(frag);
    return p;
  }

  SS.Routes = { plan, render, matchVerified };
})();
