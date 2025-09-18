document.addEventListener('DOMContentLoaded', () => {
  // Header hide + solid after hero
  let last = 0;
  const header = document.querySelector('.main-header');
  const hero = document.querySelector('.hero');
  function onScroll(){
    const y = window.pageYOffset || document.documentElement.scrollTop;
    header.style.top = (y > last && y > 120) ? '-80px' : '0';
    last = y <= 0 ? 0 : y;
    const solid = y > ((hero?.offsetHeight || 0) - 64);
    header.classList.toggle('solid', solid);
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // Reveal on scroll
  const targets = document.querySelectorAll('.content-section, .content-section-dark, .feature-item, .gallery-item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.12 });
  targets.forEach(el => io.observe(el));

  // Hero spotlight
  document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mx', e.clientX + 'px');
    document.documentElement.style.setProperty('--my', e.clientY + 'px');
  }, { passive: true });

  // --- Hero cross‑fade: main1.jpg -> housegarage.jpg ---
  (function heroSwap(){
    const box = document.querySelector('.hero-image-container');
    if (!box) return;
    const imgs = box.querySelectorAll('img.bg'); // expects .bg.bg-1 and .bg.bg-2 in HTML
    if (imgs.length < 2) return;

    let ready = 0;
    const mark = () => {
      ready += 1;
      if (ready === imgs.length) {
        // show main1 briefly, then fade to housegarage
        setTimeout(() => box.classList.add('swap'), 1400);
      }
    };

    imgs.forEach(img => {
      if (img.decode) img.decode().then(mark, mark);
      else if (img.complete) mark();
      else img.addEventListener('load', mark, { once:true });
    });

    // safety: ensure swap even if decode/load stalls
    setTimeout(() => box.classList.add('swap'), 4000);
  })();
  // --- end hero cross‑fade ---

  // Lightbox with navigation
  const dlg = document.getElementById('lightbox');
  const dlgImg = dlg.querySelector('img');
  const closeBtn = dlg.querySelector('.lightbox-close');
  const prevBtn = dlg.querySelector('.lightbox-nav.prev');
  const nextBtn = dlg.querySelector('.lightbox-nav.next');
  const leftZone = dlg.querySelector('.hotzone.left');
  const rightZone = dlg.querySelector('.hotzone.right');
  const caption = dlg.querySelector('.lightbox-caption');
  const counter = dlg.querySelector('.lightbox-count');

  const imgs = [...document.querySelectorAll('.gallery-item img')];
  imgs.forEach((img, i) => { img.dataset.idx = i; img.addEventListener('click', () => open(i)); });

  let idx = 0;
  function set(i){
    const n = (i + imgs.length) % imgs.length;
    idx = n;
    const src = imgs[n].currentSrc || imgs[n].src;
    dlgImg.src = src;
    dlgImg.alt = imgs[n].alt || '';
    caption.textContent = imgs[n].alt || '';
    counter.textContent = `${n + 1} / ${imgs.length}`;
  }
  function open(i){ set(i); dlg.showModal(); }
  function next(step=1){ set(idx + step); }
  function prev(step=1){ set(idx - step); }

  nextBtn.addEventListener('click', () => next());
  prevBtn.addEventListener('click', () => prev());
  rightZone.addEventListener('click', () => next());
  leftZone.addEventListener('click', () => prev());
  closeBtn.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => {
    if (!e.target.closest('img, .lightbox-nav, .lightbox-close, .hotzone, .lightbox-meta')) dlg.close();
  });
  window.addEventListener('keydown', (e) => {
    if (!dlg.open) return;
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'Escape') dlg.close();
  });
});
