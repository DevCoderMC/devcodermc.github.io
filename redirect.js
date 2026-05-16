(async function() {
    var path = window.location.pathname.replace(/\/+$/, '') || '/';
    try {
        var res = await fetch('/redirects.json');
        var redirects = await res.json();
        for (var i = 0; i < redirects.length; i++) {
            var rp = redirects[i].path;
            if (rp.charAt(0) !== '/') rp = '/' + rp;
            if (path === rp) {
                window.location.href = redirects[i].url;
                return;
            }
        }
    } catch (e) {
        console.warn('Redirect-Load-Fehler:', e);
    }
})();
