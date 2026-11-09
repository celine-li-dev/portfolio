// Agrandir une image au clic : il suffit d'ajouter l'attribut data-zoom sur la balise <img>.
// Échap ferme l'image, les flèches ← → passent à l'image suivante ou précédente.

(() => {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Image agrandie');
  box.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Fermer">✕</button>
    <button class="lightbox-nav prev" type="button" aria-label="Image précédente">←</button>
    <figure class="lightbox-figure">
      <img alt="">
      <figcaption></figcaption>
    </figure>
    <button class="lightbox-nav next" type="button" aria-label="Image suivante">→</button>`;
  document.body.appendChild(box);

  const bigImage = box.querySelector('img');
  const caption = box.querySelector('figcaption');
  const closeButton = box.querySelector('.lightbox-close');
  const prevButton = box.querySelector('.prev');
  const nextButton = box.querySelector('.next');

  let items = [];
  let index = 0;
  let opener = null;

  const zoomables = () => [...document.querySelectorAll('img[data-zoom]')].filter((img) => img.isConnected);

  // Les images agrandissables se choisissent aussi au clavier.
  zoomables().forEach((img) => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.title = 'Cliquer pour agrandir';
  });

  function show(i) {
    index = (i + items.length) % items.length;
    const img = items[index];
    bigImage.src = img.currentSrc || img.src;
    bigImage.alt = img.alt;
    caption.textContent = img.alt;
  }

  function open(img) {
    items = zoomables();
    opener = img;
    show(items.indexOf(img));
    const single = items.length < 2;
    prevButton.hidden = single;
    nextButton.hidden = single;
    box.hidden = false;
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove('lightbox-open');
    bigImage.removeAttribute('src');
    if (opener) opener.focus({ preventScroll: true });
  }

  document.addEventListener('click', (event) => {
    const img = event.target.closest('img[data-zoom]');
    if (img) open(img);
  });

  // Un clic sur le fond sombre (en dehors de l'image et des boutons) ferme l'image.
  box.addEventListener('click', (event) => {
    if (!event.target.closest('img, button, figcaption')) close();
  });
  closeButton.addEventListener('click', close);
  prevButton.addEventListener('click', () => show(index - 1));
  nextButton.addEventListener('click', () => show(index + 1));

  document.addEventListener('keydown', (event) => {
    if (box.hidden) {
      const img = event.target.closest && event.target.closest('img[data-zoom]');
      if (img && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        open(img);
      }
      return;
    }
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft' && items.length > 1) show(index - 1);
    if (event.key === 'ArrowRight' && items.length > 1) show(index + 1);
    if (event.key === 'Tab') {
      const buttons = [closeButton, prevButton, nextButton].filter((b) => !b.hidden);
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
})();
