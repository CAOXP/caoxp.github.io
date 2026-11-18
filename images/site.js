// Shared site behavior: keep Ctrl+wheel zoom in sync across all pages.
// Browser zoom is per-tab and resets on navigation, which makes the
// sidebar width (15vw) jump between pages. This script stores the zoom
// level in localStorage and reapplies it on every page load.
(function () {
    var KEY = 'caoxp-site-zoom';
    var MIN = 0.5, MAX = 2, STEP = 0.05;

    function clamp(z) {
        return Math.min(MAX, Math.max(MIN, z));
    }

    function getZoom() {
        var z = parseFloat(localStorage.getItem(KEY));
        return isNaN(z) ? 1 : clamp(z);
    }

    function apply(z) {
        document.documentElement.style.zoom = z;
    }

    var z = getZoom();
    if (z !== 1) apply(z);

    window.addEventListener('wheel', function (e) {
        if (!e.ctrlKey) return;
        e.preventDefault();
        var dir = e.deltaY > 0 ? -1 : 1;
        z = Math.round(clamp(z + dir * STEP) * 100) / 100;
        localStorage.setItem(KEY, z);
        apply(z);
    }, { passive: false });
})();
