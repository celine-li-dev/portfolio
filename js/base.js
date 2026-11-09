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


// MENU BURGER POUR MOBILE

const burger = document.querySelector('.burger-menu');
const navigation = document.querySelector('.topbar nav');

if (burger && navigation) {
  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';

    burger.setAttribute('aria-expanded', String(!isOpen));
    burger.setAttribute(
      'aria-label',
      isOpen ? 'Ouvrir le menu' : 'Fermer le menu'
    );

    navigation.classList.toggle('menu-open', !isOpen);
  });

  // Fermer le menu après avoir cliqué sur un lien
  navigation.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navigation.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
    });
  });
}
