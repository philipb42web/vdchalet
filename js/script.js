document.addEventListener('DOMContentLoaded', () => {
  // Header hide-on-scroll
  let last = 0;
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    const y = window.pageYOffset || document.documentElement.scrollTop;
    header.style.top = (y > last && y > 120) ? '-80px' : '0';
    last = y <= 0 ? 0 : y;
  }, { passive: true });

  // Reveal on scroll
  const revealTargets = document.querySelectorAll(
    '.content-section, .content-section-dark, .feature-item, .gallery-item'
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => io.observe(el));

  // Lightbox for gallery
  const dlg = document.getElementById('lightbox');
  const dlgImg = dlg?.querySelector('img');
  const closeBtn = dlg?.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      if (!dlg || !dlgImg) return;
      dlgImg.src = img.currentSrc || img.src;
      dlgImg.alt = img.alt || '';
      dlg.showModal();
    });
  });

  closeBtn?.addEventListener('click', () => dlg.close());
  dlg?.addEventListener('click', (e) => {
    const rect = dlg.getBoundingClientRect();
    const clickedOutside = e.clientX < rect.left || e.clientX > rect.right ||
                           e.clientY < rect.top || e.clientY > rect.bottom;
    if (clickedOutside) dlg.close();
  });

  // Footer year
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
});
