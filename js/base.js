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

// Mobile : le menu défile horizontalement, on amène l'onglet actif au centre.
const activeLink = document.querySelector('.topbar nav a.active');
if (activeLink) {
  const nav = activeLink.parentElement;
  nav.scrollLeft = activeLink.offsetLeft - (nav.clientWidth - activeLink.offsetWidth) / 2;
}
