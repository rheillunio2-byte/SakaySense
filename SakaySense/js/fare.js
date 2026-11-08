/* SakaySense — sample fare calculation and the Fare Estimator UI.
 * Uses the original prototype's sample rates (see data.js). NOT an official fare matrix. */
(function () {
  "use strict";
  const SS = (window.SakaySense = window.SakaySense || {});
  const { $, formatPeso, formatKm, toast } = SS.util;

  /** Pure calculation, shared by the estimator and by the route cards. */
  function calc(mode, category, km) {
    const model = SS.FARE_MODEL, m = model.modes[mode];
    if (!m || !Number.isFinite(km) || km < 0) return null;
    const extraKm = Math.max(0, km - model.baseKm);
    const extraCharge = extraKm * m.perKm;
    const subtotal = m.base + extraCharge;
    const discountRate = category && category !== "regular" ? model.discountRate : 0;
    const discount = subtotal * discountRate;
    return { mode, category, km, base: m.base, perKm: m.perKm, extraKm, extraCharge, subtotal, discountRate, discount, total: subtotal - discount };
  }

  let trip = null; // {km, from, to} of the currently planned trip (estimated road distance)
  let onCategoryChange = null;

  function render() {
    const km = Number($("distance").value), mode = $("transportType").value, category = $("fareCategory").value;
    const r = calc(mode, category, km);
    $("distanceValue").textContent = Number.isInteger(km) ? km : km.toFixed(1);
    $("fareAmount").textContent = formatPeso(r.total);
    const rows = [
      ["Base fare (first " + SS.FARE_MODEL.baseKm + " km)", formatPeso(r.base)],
      [r.extraKm > 0 ? `Additional ${r.extraKm.toFixed(1)} km × ${formatPeso(r.perKm)}` : "Additional distance", formatPeso(r.extraCharge)],
    ];
    if (r.discountRate) rows.push([`${SS.FARE_MODEL.categories[category]} discount (${Math.round(r.discountRate * 100)}%)`, "−" + formatPeso(r.discount)]);
    const box = $("fareBreakdown");
    box.replaceChildren(...rows.map(([label, value]) => {
      const row = document.createElement("div");
      const a = document.createElement("span"), b = document.createElement("strong");
      a.textContent = label; b.textContent = value;
      row.append(a, b);
      return row;
    }));
  }

  function renderTripHint() {
    const box = $("tripFareHint");
    if (!box) return;
    if (!trip) { box.hidden = true; return; }
    box.hidden = false;
    $("tripFareText").textContent = `${trip.from} → ${trip.to} · estimated road distance ≈ ${formatKm(trip.km)}`;
    const over = trip.km > SS.FARE_MODEL.maxKm;
    $("useTripDistance").disabled = false;
    $("useTripDistance").textContent = over ? `Use ${SS.FARE_MODEL.maxKm} km (maximum)` : "Use this distance";
  }

  function setDistance(km) {
    const input = $("distance");
    const clamped = Math.min(Number(input.max), Math.max(Number(input.min), Math.round(km * 10) / 10));
    input.value = clamped;
    render();
  }

  function setTrip(value) { trip = value; renderTripHint(); }
  function setCategory(value) {
    if ($("fareCategory").value === value) return;
    $("fareCategory").value = value;
    render();
  }
  function setMode(value) { $("transportType").value = value; render(); }

  function init(opts) {
    onCategoryChange = (opts && opts.onCategoryChange) || null;
    const input = $("distance");
    input.max = SS.FARE_MODEL.maxKm;
    input.step = "0.1";
    ["distance", "transportType"].forEach((id) => $(id).addEventListener("input", render));
    $("fareCategory").addEventListener("input", () => { render(); if (onCategoryChange) onCategoryChange($("fareCategory").value); });
    $("calculateFare").addEventListener("click", () => { render(); toast("Sample fare estimate updated."); });
    $("useTripDistance").addEventListener("click", () => {
      if (!trip) return;
      setDistance(trip.km);
      toast("Distance set from your planned trip.");
    });
    render();
    renderTripHint();
  }

  SS.Fare = { calc, init, render, setTrip, setDistance, setCategory, setMode };
})();
