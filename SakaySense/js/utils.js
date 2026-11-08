/* SakaySense — shared helpers. Loaded first; everything hangs off window.SakaySense. */
(function () {
  "use strict";
  const SS = (window.SakaySense = window.SakaySense || {});

  const $ = (id) => document.getElementById(id);

  /** Tiny DOM builder. attrs: class, text, on:{event:fn}, dataset:{}, everything else -> attribute. */
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === false) return;
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else if (key === "on") Object.entries(value).forEach(([ev, fn]) => node.addEventListener(ev, fn));
      else if (key === "dataset") Object.assign(node.dataset, value);
      else node.setAttribute(key, value === true ? "" : value);
    });
    children.flat().forEach((child) => {
      if (child === null || child === undefined || child === false) return;
      node.append(child.nodeType ? child : document.createTextNode(String(child)));
    });
    return node;
  }

  function escapeHTML(value) {
    return String(value === undefined || value === null ? "" : value).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function debounce(fn, ms) {
    let timer = null;
    const wrapped = (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
    wrapped.cancel = () => clearTimeout(timer);
    return wrapped;
  }

  function haversineKm(a, b) {
    const R = 6371, rad = (d) => (d * Math.PI) / 180;
    const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  const formatPeso = (n) => `₱${Number(n).toFixed(2)}`;
  const formatKm = (km) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`);

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* localStorage can throw (private mode, blocked storage) — always go through these. */
  function storageGet(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function storageSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }

  let toastTimer = null;
  function toast(message) {
    const node = $("toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("show"), 2800);
  }

  SS.util = { $, el, escapeHTML, debounce, haversineKm, formatPeso, formatKm, prefersReducedMotion, storageGet, storageSet, toast };
})();
