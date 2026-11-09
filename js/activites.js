// Page Activités : carrousels de photos.
// Les photos qui n'existent pas sont retirées toutes seules ; sans aucune photo, le carrousel disparaît.

document.querySelectorAll('.carousel').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');
  const count = carousel.querySelector('.carousel-count');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const slides = () => track.querySelectorAll('img');
  const current = () => Math.round(track.scrollLeft / track.clientWidth);
  const goTo = (index) => track.scrollTo({ left: index * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });

  function refresh() {
    const total = slides().length;
    if (total === 0) {
      const frame = carousel.closest('.about-photo-note') || carousel;
      frame.hidden = true;
      return;
    }
    prev.hidden = total < 2;
    next.hidden = total < 2;
    count.textContent = String(Math.min(current() + 1, total)).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
  }

  slides().forEach((img) => {
    img.addEventListener('error', () => { img.remove(); refresh(); });
    if (img.complete && img.naturalWidth === 0) img.remove();
  });

  prev.addEventListener('click', () => goTo((current() - 1 + slides().length) % slides().length));
  next.addEventListener('click', () => goTo((current() + 1) % slides().length));
  track.addEventListener('scroll', refresh, { passive: true });
  refresh();
});
