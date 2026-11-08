/* SakaySense — transport delay reports (stored only in this browser).
 * Storage key and record shape are unchanged from the original prototype:
 *   localStorage["sakaysense-reports"] = [{location, transport, issue, details, createdAt}, ...]
 * Records are never rewritten except to add a new one or delete one the user chose to delete,
 * so previously saved data (even incomplete records) survives untouched.
 */
(function () {
  "use strict";
  const SS = (window.SakaySense = window.SakaySense || {});
  const { $, el, storageGet, storageSet, toast } = SS.util;
  const KEY = "sakaysense-reports";

  let memoryFallback = null; // used if localStorage is unavailable

  function readRaw() {
    if (memoryFallback) return memoryFallback;
    const data = storageGet(KEY, []);
    return Array.isArray(data) ? data : [];
  }
  function writeRaw(list) {
    if (!storageSet(KEY, list)) {
      memoryFallback = list;
      toast("Couldn't save to this browser — the report will disappear when you leave.");
    }
  }

  function relativeTime(ts) {
    if (!Number.isFinite(ts)) return "SAVED";
    const diff = Math.max(0, Date.now() - ts), min = Math.floor(diff / 60000);
    if (min < 1) return "JUST NOW";
    if (min < 60) return `${min} MIN AGO`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} HR AGO`;
    const day = Math.floor(hr / 24);
    return day < 8 ? `${day} DAY${day > 1 ? "S" : ""} AGO` : new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" }).toUpperCase();
  }

  const text = (v, fallback) => (typeof v === "string" && v.trim() ? v.trim() : fallback);

  function userItem(record, rawIndex) {
    return el("article", { class: "report-item" },
      el("span", { class: "report-status amber", "aria-hidden": "true", text: "!" }),
      el("div", {},
        el("strong", { text: text(record.issue, "Delay report") }),
        el("p", { text: `${text(record.location, "Unknown area")} · ${text(record.transport, "Transport")}` }),
        el("small", { text: `${text(record.details, "No additional details")} · Saved on this device` })),
      el("div", { class: "report-side" },
        el("span", { class: "report-time", text: relativeTime(record.createdAt) }),
        el("button", { type: "button", class: "report-delete", "aria-label": `Delete report: ${text(record.issue, "Delay report")} at ${text(record.location, "unknown area")}`, dataset: { index: String(rawIndex) }, text: "Delete" })));
  }

  function demoItem(d) {
    return el("article", { class: "report-item" },
      el("span", { class: `report-status ${d.tone}`, "aria-hidden": "true", text: d.icon }),
      el("div", {}, el("strong", { text: d.title }), el("p", { text: d.where }), el("small", { text: "Example update · Not verified" })),
      el("div", { class: "report-side" }, el("span", { class: "report-time", text: "DEMO" })));
  }

  function render() {
    const raw = readRaw();
    const items = raw.map((r, i) => (r && typeof r === "object" ? { r, i } : null)).filter(Boolean).reverse();
    $("reportList").replaceChildren(...items.map(({ r, i }) => userItem(r, i)), ...SS.DEMO_REPORTS.map(demoItem));
    $("reportCount").textContent = items.length ? `${items.length} SAVED ON THIS DEVICE` : "DEMO FEED";
    $("clearReports").hidden = items.length === 0;
  }

  function setError(message) {
    const node = $("reportError");
    node.textContent = message || "";
    node.hidden = !message;
    $("reportLocation").setAttribute("aria-invalid", message ? "true" : "false");
  }

  function init() {
    $("reportForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const location = $("reportLocation").value.trim();
      if (!location) { setError("Please enter the location or area."); $("reportLocation").focus(); return; }
      setError("");
      const report = { location, transport: $("reportTransport").value, issue: $("reportIssue").value, details: $("reportDetails").value.trim(), createdAt: Date.now() };
      const list = readRaw().slice();
      list.push(report);
      writeRaw(list);
      e.target.reset();
      render();
      toast("Your report was saved on this device.");
    });
    $("reportLocation").addEventListener("input", () => setError(""));

    // One delegated handler for all Delete buttons (no per-item listeners to leak or duplicate).
    $("reportList").addEventListener("click", (e) => {
      const btn = e.target.closest(".report-delete");
      if (!btn) return;
      const index = Number(btn.dataset.index);
      const list = readRaw().slice();
      if (!Number.isInteger(index) || index < 0 || index >= list.length) return;
      list.splice(index, 1);
      writeRaw(list);
      render();
      toast("Report deleted.");
      $("reportLocation").focus({ preventScroll: true });
    });

    $("clearReports").addEventListener("click", () => {
      if (!window.confirm("Delete all reports saved on this device? Example updates are not affected.")) return;
      writeRaw([]);
      render();
      toast("All saved reports deleted.");
    });

    // Quick-fill the location from the planned trip
    document.querySelectorAll("[data-fill-from]").forEach((btn) => btn.addEventListener("click", () => {
      const place = SS.Reports.getTripPlace && SS.Reports.getTripPlace(btn.dataset.fillFrom);
      if (!place) { toast("Choose that location in the trip planner first."); return; }
      $("reportLocation").value = place.name;
      setError("");
      $("reportLocation").focus();
    }));

    render();
  }

  SS.Reports = { init, render, relativeTime, getTripPlace: null };
})();
