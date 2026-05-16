(async function() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    try {
        const res = await fetch('/redirects.json');
        const redirects = await res.json();
        for (const r of redirects) {
            const rp = r.path.startsWith('/') ? r.path : '/' + r.path;
            if (path === rp) {
                window.location.replace(r.url);
                return;
            }
        }
    } catch (e) {}
})();
