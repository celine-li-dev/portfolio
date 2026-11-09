// Pages de détail d'un projet.

// Retire les galeries dont aucune image n'existe.
window.addEventListener('load', () => {
  document.querySelectorAll('.gallery').forEach((gallery) => {
    if (!gallery.querySelector('img')) gallery.remove();
  });
});
