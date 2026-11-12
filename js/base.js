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
// Mode sombre : bouton jout / nuit dans la barre du haut, choix mémorisé.
(() => {
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const apply = (theme) => root.setAttribute('data-theme', theme);
  apply(saved || (system.matches ? 'dark' : 'light'));
  system.addEventListener('change', (e) => { if (!saved) apply(e.matches ? 'dark' : 'light'); });

  const topbar = document.querySelector('.topbar');
  if (!topbar) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'theme-toggle';
  button.innerHTML =
    '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
    '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const label = () => {
    const dark = root.getAttribute('data-theme') === 'dark';
    button.setAttribute('aria-label', dark ? 'Passer en mode clair' : 'Passer en mode sombre');
    button.setAttribute('aria-pressed', String(dark));
  };
  button.addEventListener('click', () => {
    saved = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(saved);
    try { localStorage.setItem('theme', saved); } catch (e) {}
    label();
  });
  label();

  // Ordinateur : à côté de « Me contacter ». Mobile : à côté du burger.
  const end = document.createElement('div');
  end.className = 'topbar-end';
  const contact = topbar.querySelector('.contact-link');
  const burger = topbar.querySelector('.burger');
  topbar.insertBefore(end, contact || burger || null);
  end.appendChild(button);
  if (contact) end.appendChild(contact);
  if (burger) end.appendChild(burger);
})();
