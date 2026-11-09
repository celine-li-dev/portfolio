// Page Compétences : constellation interactive.
// Survoler, cliquer ou sélectionner une étoile au clavier affiche sa description ; on peut aussi les déplacer.

(() => {
  const sky = document.querySelector('.constellation');
  const stars = document.querySelectorAll('.constellation-star');
  const name = document.getElementById('detail-name');
  const domain = document.getElementById('detail-domain');
  const info = document.getElementById('detail-description');
  const symbol = document.querySelector('.detail-symbol');
  let selected = null;

  if (!sky || !name) return;

  // Affiche le logo de l'outil (dossier img/logos). Sans logo, ou si le fichier n'existe pas, on garde l'étoile.
  function showLogo(star) {
    symbol.classList.remove('has-logo');
    symbol.textContent = '✦';
    if (!star.dataset.logo) return;

    const logo = new Image();
    logo.alt = '';
    logo.addEventListener('load', () => {
      if (selected !== star) return;
      symbol.textContent = '';
      symbol.append(logo);
      symbol.classList.add('has-logo');
    });
    logo.src = 'img/logos/' + star.dataset.logo;
  }

  function select(star) {
    if (selected === star) return;
    selected = star;
    stars.forEach((s) => s.classList.remove('is-active'));
    star.classList.add('is-active');
    showLogo(star);
    name.textContent = star.dataset.name;
    domain.textContent = star.dataset.domain;
    info.textContent = star.dataset.info;
  }

  stars.forEach((star) => {
    let startX, startY, startLeft, startTop, moved;

    star.addEventListener('pointerenter', () => select(star));
    star.addEventListener('focus', () => select(star));

    star.addEventListener('pointerdown', (event) => {
      startX = event.clientX;
      startY = event.clientY;
      startLeft = star.offsetLeft;
      startTop = star.offsetTop;
      moved = false;
      star.setPointerCapture(event.pointerId);
    });

    star.addEventListener('pointermove', (event) => {
      if (!star.hasPointerCapture(event.pointerId)) return;

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      if (!moved) return;

      const x = Math.max(12, Math.min(sky.clientWidth - 12, startLeft + dx));
      const y = Math.max(12, Math.min(sky.clientHeight - 12, startTop + dy));
      star.style.setProperty('--x', `${(x / sky.clientWidth) * 100}%`);
      star.style.setProperty('--y', `${(y / sky.clientHeight) * 100}%`);
    });

    star.addEventListener('pointerup', (event) => {
      if (star.hasPointerCapture(event.pointerId)) star.releasePointerCapture(event.pointerId);
      select(star);
    });

    star.addEventListener('click', () => select(star));
  });
})();
