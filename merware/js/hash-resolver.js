(function () {
  "use strict";

  function normalizeHash(hash) {
    if (!hash || hash === "#") return null;

    try {
      return decodeURIComponent(hash.slice(1)).toLowerCase();
    } catch {
      return null;
    }
  }

  function canonicalizeHash(hash) {
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}${hash}`,
    );
  }

  function resolveHash(routes) {
    const normalizedHash = normalizeHash(window.location.hash);
    if (!normalizedHash) return false;

    const route = Object.entries(routes).find(
      ([hash]) => normalizeHash(hash) === normalizedHash,
    );
    if (route) {
      const [canonicalHash, destination] = route;
      if (window.location.hash !== canonicalHash)
        canonicalizeHash(canonicalHash);
      window.location.replace(destination);
      return true;
    }

    const target = Array.from(document.querySelectorAll("[id]")).find(
      (element) => element.id.toLowerCase() === normalizedHash,
    );
    if (!target || window.location.hash === `#${target.id}`) return false;

    canonicalizeHash(`#${target.id}`);
    target.scrollIntoView();
    return true;
  }

  function init(routes = {}) {
    const resolve = () => resolveHash(routes);
    resolve();
    window.addEventListener("hashchange", resolve);
  }

  window.MerWareHashResolver = { init };
})();
