// Shared site behavior: content-only zoom, synced across all pages and tabs.
// The zoom is applied ONLY to the .content area, never to the whole page,
// so the left sidebar stays pixel-identical on every page and at every
// zoom level (no jumping when navigating or zooming). The zoom level is
// persisted in localStorage and live-synced across open tabs.
(function () {
    var KEY = 'caoxp-site-zoom';
    var MIN = 0.5, MAX = 2, STEP = 0.05;

    function clamp(z) {
        return Math.min(MAX, Math.max(MIN, z));
    }

    function getZoom() {
        var v = parseFloat(localStorage.getItem(KEY));
        return isNaN(v) ? 1 : clamp(v);
    }

    function target() {
        return document.querySelector('.content') || document.documentElement;
    }

    function apply(z) {
        target().style.zoom = z;
    }

    function setZoom(next) {
        z = Math.round(clamp(next) * 100) / 100;
        localStorage.setItem(KEY, z);
        apply(z);
    }

    var z = getZoom();
    apply(z);

    // Ctrl+wheel / trackpad pinch
    window.addEventListener('wheel', function (e) {
        if (!e.ctrlKey) return;
        e.preventDefault();
        setZoom(z + (e.deltaY > 0 ? -STEP : STEP));
    }, { passive: false });

    // Ctrl +/-/0 keyboard zoom (block native zoom so it cannot desync)
    window.addEventListener('keydown', function (e) {
        if (!e.ctrlKey || e.altKey || e.metaKey) return;
        if (e.key === '-' || e.key === '_') {
            e.preventDefault();
            setZoom(z - STEP);
        } else if (e.key === '=' || e.key === '+' || e.code === 'NumpadAdd') {
            e.preventDefault();
            setZoom(z + STEP);
        } else if (e.key === '0' || e.code === 'Numpad0') {
            e.preventDefault();
            setZoom(1);
        }
    });

    // Back-to-top button visibility (shared on every page that has the button)
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > window.innerHeight) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
    }

    // Live-sync when another tab changes the zoom level
    window.addEventListener('storage', function (e) {
        if (e.key !== KEY || e.newValue === null) return;
        var stored = getZoom();
        if (stored !== z) {
            z = stored;
            apply(z);
        }
    });
})();
