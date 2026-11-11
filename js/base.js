// Script commun à toutes les pages.

// Dossiers repliables dans l'explorateur.
document.querySelectorAll('.tree-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const children = button.nextElementSibling;
    const open = button.getAttribute('aria-expanded') === 'true';
    const name = button.textContent.split('/')[0].replace(/[⌄›▰]/g, '').trim();
    button.setAttribute('aria-expanded', String(!open));
    children.hidden = open;
    button.textContent = (open ? '›  ▰ ' : '⌄  ▰ ') + name + '/';
  });
});

// Surligner la page active dans le menu horizontal.
const currentPage = document.body.dataset.page;
document.querySelectorAll('.topbar nav a').forEach((link) => {
  if (link.dataset.page === currentPage) link.classList.add('active');
});

// ============================================================
// MOBILE : menu burger + suppression des flèches/emoji
// ============================================================

// Menu burger (le bouton est créé ici : pas besoin de modifier les pages HTML)
(() => {
  const topbar = document.querySelector('.topbar');
  const nav = topbar && topbar.querySelector('nav');
  if (!topbar || !nav || topbar.querySelector('.burger')) return;

  const burger = document.createElement('button');
  burger.className = 'burger';
  burger.type = 'button';
  burger.setAttribute('aria-label', 'Ouvrir le menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = '<span></span><span></span><span></span>';
  topbar.classList.add('has-menu');
  topbar.insertBefore(burger, nav);

  const setMenu = (open) => {
    topbar.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };

  burger.addEventListener('click', () => setMenu(!topbar.classList.contains('open')));
  topbar.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
})();

// Retire les flèches (qui deviennent des emoji sur iPhone) et remplace les autres symboles.
// Les symboles sont écrits avec leurs numéros Unicode : aucun caractère invisible à copier.
(() => {
  const chr = String.fromCharCode;
  const CHEVRON = chr(0x203A);                                 // ›
  const DROP = [0x2197, 0x2191, 0x2193, 0x2198, 0x2196, 0x2199, 0x2194, 0x2195]; // ↗ ↑ ↓ ...  : supprimées
  const SWAP = {};
  SWAP[0x2190] = chr(0x2039);   // ←  devient ‹
  SWAP[0x2192] = CHEVRON;       // →  devient ›
  SWAP[0x2733] = chr(0x2726);   // ✳  devient ✦
  SWAP[0x2709] = '@';           // ✉  devient @
  SWAP[0x2715] = chr(0xD7);     // ✕  devient ×

  const clean = (text) => {
    let out = '';
    let handled = false;
    for (const ch of text) {
      const code = ch.codePointAt(0);
      if ((code === 0xFE0E || code === 0xFE0F) && handled) continue; // sélecteur d'emoji collé au symbole
      handled = false;
      if (DROP.includes(code)) { out = out.replace(/\s+$/, ''); handled = true; continue; }
      if (SWAP[code]) { out += SWAP[code]; handled = true; continue; }
      out += ch;
    }
    // Un texte qui ne contenait QUE une flèche (bouton rond) : on met un chevron
    if (out !== text && out.trim() === '') return CHEVRON;
    return out;
  };

  const textify = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const parent = node.parentNode && node.parentNode.nodeName;
      if (parent === 'SCRIPT' || parent === 'STYLE') return;
      const fixed = clean(node.nodeValue);
      if (fixed !== node.nodeValue) node.nodeValue = fixed;
    });
  };

  textify(document.body);

  // Couvre aussi les boutons créés plus tard (carrousel, zoom sur les photos)
  new MutationObserver((mutations) => {
    mutations.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.nodeType === 1) textify(n);
      else if (n.nodeType === 3 && n.parentNode) textify(n.parentNode);
    }));
  }).observe(document.body, { childList: true, subtree: true });
})();
// Explorateur : on cache le terminal quand les dossiers ouverts prennent toute la place.
(() => {
  const explorer = document.querySelector('.explorer');
  const terminal = explorer && explorer.querySelector('.terminal');
  if (!terminal) return;
  const fit = () => {
    terminal.style.display = '';
    if (explorer.scrollHeight > explorer.clientHeight + 1) terminal.style.display = 'none';
  };
  explorer.querySelectorAll('.tree-toggle').forEach((b) => b.addEventListener('click', () => requestAnimationFrame(fit)));
  window.addEventListener('resize', fit);
  if (document.fonts) document.fonts.ready.then(fit);
  fit();
})();
