/* SakaySense — accessible location autocomplete (ARIA combobox + listbox).
 *
 * - Shows curated local suggestions instantly (no network).
 * - After 3+ characters, searches OpenStreetMap Nominatim, debounced 600 ms.
 * - Curated suggestions are resolved to real coordinates via Nominatim when picked (cached).
 * - Keyboard: ↓ ↑ Home End to move, Enter to choose, Esc to close, Tab leaves.
 */
(function () {
  "use strict";
  const SS = (window.SakaySense = window.SakaySense || {});
  const { el, debounce } = SS.util;

  const DEBOUNCE_MS = 600;
  const MIN_CHARS = 3;

  function create(opts) {
    const { input, list, clearBtn, status, getOutside, onChange, label } = opts;
    const root = input.closest(".field");
    let place = null;      // currently selected place
    let rows = [];         // selectable rows currently rendered [{kind, data}]
    let active = -1;
    let seq = 0;           // invalidates stale async work
    let ctrl = null;       // AbortController of the in-flight search
    let open = false;

    /* ---------- status / error ---------- */
    function say(message, isError) {
      status.textContent = message || "";
      status.classList.toggle("is-error", !!isError);
      input.setAttribute("aria-invalid", isError ? "true" : "false");
    }

    /* ---------- list rendering ---------- */
    function setOpen(value) {
      open = value;
      list.hidden = !value;
      input.setAttribute("aria-expanded", value ? "true" : "false");
      if (!value) { active = -1; input.removeAttribute("aria-activedescendant"); }
    }

    function setActive(index) {
      const options = list.querySelectorAll('[role="option"]');
      options.forEach((o, i) => o.setAttribute("aria-selected", i === index ? "true" : "false"));
      active = index;
      if (index >= 0 && options[index]) {
        input.setAttribute("aria-activedescendant", options[index].id);
        options[index].scrollIntoView({ block: "nearest" });
      } else input.removeAttribute("aria-activedescendant");
    }

    function optionNode(row, index) {
      const id = `${list.id}-opt-${index}`;
      const d = row.data;
      const node = el("li", { role: "option", id, class: "suggest-option", "aria-selected": "false", dataset: { index: String(index) } },
        el("span", { class: `suggest-icon ${row.kind === "suggestion" ? "is-local" : ""}`, "aria-hidden": "true", text: row.kind === "suggestion" ? "★" : "⌖" }),
        el("span", { class: "suggest-text" },
          el("strong", { text: d.name }),
          el("small", { text: row.kind === "suggestion" ? `${d.category} · Cagayan de Oro` : (d.address || "OpenStreetMap place") })));
      return node;
    }

    function messageNode(kind, text, retry) {
      return el("li", { role: "presentation", class: `suggest-msg ${kind}` },
        kind === "loading" ? el("span", { class: "spinner", "aria-hidden": "true" }) : null,
        el("span", { text }),
        retry ? el("button", { type: "button", class: "retry-btn", on: { mousedown: (e) => e.preventDefault(), click: retry } }, "Retry") : null);
    }

    function headingNode(text) { return el("li", { role: "presentation", class: "suggest-head", text }); }

    /** view: {suggestions: [], results: [], state: 'idle'|'loading'|'empty'|'error'|'short'|'ok', error?: string} */
    function render(view) {
      rows = [];
      const nodes = [];
      if (view.suggestions.length) {
        nodes.push(headingNode(view.title || "Suggested places"));
        view.suggestions.forEach((s) => { nodes.push(optionNode({ kind: "suggestion", data: s }, rows.length)); rows.push({ kind: "suggestion", data: s }); });
      }
      if (view.state !== "idle") nodes.push(headingNode(getOutside() ? "Map search — anywhere" : "Map search — Cagayan de Oro"));
      if (view.state === "short") nodes.push(messageNode("hint", `Type at least ${MIN_CHARS} characters to search the map.`));
      if (view.state === "loading") nodes.push(messageNode("loading", "Searching…"));
      if (view.state === "empty") nodes.push(messageNode("empty", getOutside() ? "No places found. Try different words." : "No places found in Cagayan de Oro. Try different words, or tick “Search outside Cagayan de Oro”."));
      if (view.state === "error") nodes.push(messageNode("error", view.error || "Search failed.", () => runSearch(input.value, true)));
      if (view.state === "ok") view.results.forEach((r) => { nodes.push(optionNode({ kind: "result", data: r }, rows.length)); rows.push({ kind: "result", data: r }); });
      list.replaceChildren(...nodes);
      active = -1;
      input.removeAttribute("aria-activedescendant");
      setOpen(nodes.length > 0);
    }

    function filterSuggestions(q) {
      const needle = q.trim().toLowerCase();
      if (!needle) return { items: SS.PLACE_SUGGESTIONS.slice(0, 8), title: "Suggested places in Cagayan de Oro" };
      const items = SS.PLACE_SUGGESTIONS.filter((s) => s.name.toLowerCase().includes(needle) || s.category.toLowerCase().includes(needle) || s.id.includes(needle)).slice(0, 4);
      return { items, title: "Suggested places" };
    }

    /* ---------- searching ---------- */
    async function runSearch(rawQuery, immediate) {
      const q = rawQuery.trim();
      const { items, title } = filterSuggestions(q);
      if (q.length < MIN_CHARS) {
        if (ctrl) ctrl.abort();
        render({ suggestions: items, results: [], state: q ? "short" : "idle", title });
        return;
      }
      const mine = ++seq;
      if (ctrl) ctrl.abort();
      ctrl = new AbortController();
      render({ suggestions: items, results: [], state: "loading", title });
      try {
        const results = await SS.Geocoder.search(q, { outside: getOutside(), signal: ctrl.signal });
        if (mine !== seq) return;
        render({ suggestions: items, results, state: results.length ? "ok" : "empty", title });
        say(results.length ? `${results.length} map result${results.length > 1 ? "s" : ""} found.` : "No map results found.");
      } catch (err) {
        if (err && err.name === "AbortError") return;
        if (mine !== seq) return;
        const msg = err && err.message ? err.message : "Something went wrong while searching.";
        render({ suggestions: items, results: [], state: "error", error: msg, title });
        say(msg, true);
      }
    }
    const debounced = debounce((q) => runSearch(q), DEBOUNCE_MS);

    /* ---------- selecting ---------- */
    function commit(p, silent) {
      place = p;
      seq += 1; // drop any pending search
      if (ctrl) ctrl.abort();
      debounced.cancel();
      input.value = p ? p.name : "";
      input.removeAttribute("aria-busy");
      clearBtn.hidden = !input.value;
      say(p ? `${label} set to ${p.name}.` : "");
      setOpen(false);
      if (!silent && onChange) onChange(p);
    }

    async function chooseSuggestion(s) {
      const mine = ++seq;
      if (ctrl) ctrl.abort();
      debounced.cancel();
      ctrl = new AbortController();
      input.value = s.name;
      clearBtn.hidden = false;
      input.setAttribute("aria-busy", "true");
      setOpen(false);
      say(`Locating ${s.name}…`);
      try {
        const results = await SS.Geocoder.search(s.query, { outside: false, signal: ctrl.signal });
        if (mine !== seq) return;
        if (!results.length) {
          input.removeAttribute("aria-busy");
          say(`Couldn't find ${s.name} on the map. Try typing its name or address.`, true);
          return;
        }
        commit({ ...results[0], name: s.name, suggestionId: s.id });
      } catch (err) {
        if (err && err.name === "AbortError") return;
        if (mine !== seq) return;
        input.removeAttribute("aria-busy");
        say(err && err.message ? err.message : "Couldn't locate that place.", true);
      }
    }

    function chooseRow(index) {
      const row = rows[index];
      if (!row) return;
      if (row.kind === "suggestion") chooseSuggestion(row.data);
      else commit(row.data);
    }

    /* ---------- events (bound once) ---------- */
    input.addEventListener("input", () => {
      if (place) { place = null; if (onChange) onChange(null); }
      clearBtn.hidden = !input.value;
      say("");
      const q = input.value;
      const { items, title } = filterSuggestions(q);
      if (q.trim().length < MIN_CHARS) { debounced.cancel(); runSearch(q); }
      else { render({ suggestions: items, results: [], state: "loading", title }); debounced(q); }
    });

    input.addEventListener("focus", () => {
      if (!place && !input.value.trim()) runSearch("");
      else if (!place && input.value.trim().length >= MIN_CHARS && !open && rows.length) setOpen(true);
    });

    input.addEventListener("keydown", (e) => {
      const count = rows.length;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!open) { runSearch(input.value); return; }
        if (count) setActive((active + 1) % count);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (open && count) setActive(active <= 0 ? count - 1 : active - 1);
      } else if (e.key === "Home" && open && count) { e.preventDefault(); setActive(0); }
      else if (e.key === "End" && open && count) { e.preventDefault(); setActive(count - 1); }
      else if (e.key === "Enter" && open) {
        if (active >= 0) { e.preventDefault(); chooseRow(active); }
        else if (count && !list.querySelector(".suggest-msg.loading")) { e.preventDefault(); chooseRow(0); }
      } else if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); }
    });

    // mousedown (not click) so the input keeps focus; one delegated listener for all rows
    list.addEventListener("mousedown", (e) => {
      const opt = e.target.closest('[role="option"]');
      if (opt) { e.preventDefault(); chooseRow(Number(opt.dataset.index)); }
    });

    root.addEventListener("focusout", (e) => { if (!root.contains(e.relatedTarget)) setOpen(false); });

    clearBtn.addEventListener("click", () => {
      commit(null);
      input.focus();
      runSearch("");
    });

    /* ---------- public API ---------- */
    return {
      getPlace: () => place,
      setPlace: (p, silent) => commit(p, silent),
      chooseSuggestionById(id) { const s = SS.PLACE_SUGGESTIONS.find((x) => x.id === id); if (s) return chooseSuggestion(s); },
      showError(message) { say(message, true); },
      clearError() { say(""); },
      refresh() { if (!place && input.value.trim().length >= MIN_CHARS) runSearch(input.value, true); },
      focus: () => input.focus(),
    };
  }

  SS.LocationField = { create, DEBOUNCE_MS, MIN_CHARS };
})();
