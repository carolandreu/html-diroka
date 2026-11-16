// Local language controls and a progressively enhanced news photo gallery.
(() => {
  document.querySelectorAll('[data-news-region]').forEach(region => {
    const controls = region.querySelector('[data-news-language]');
    if (!controls) return;
    const buttons = Array.from(controls.querySelectorAll('button[data-news-lang]'));
    const setLanguage = language => {
      if (!['en', 'es'].includes(language)) return;
      region.querySelectorAll('[data-news-content]').forEach(content => {
        content.hidden = content.lang !== language;
      });
      region.querySelectorAll('[data-label-en]').forEach(element => {
        element.setAttribute('aria-label', element.dataset[language === 'es' ? 'labelEs' : 'labelEn']);
      });
      region.querySelectorAll('[data-alt-en]').forEach(element => {
        element.alt = element.dataset[language === 'es' ? 'altEs' : 'altEn'];
      });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.newsLang === language)));
      if (region === document.body) {
        document.documentElement.lang = language;
        document.title = language === 'es'
          ? 'Premios en Ink Masters Tattoo Show | Diroka Tattoo Studio'
          : 'Ink Masters Tattoo Show awards | Diroka Tattoo Studio';
      }
    };
    controls.hidden = false;
    buttons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.newsLang)));
    setLanguage(new URLSearchParams(location.search).get('lang') === 'es' ? 'es' : 'en');
  });

  document.querySelectorAll('[data-news-gallery]').forEach(gallery => {
    const slides = Array.from(gallery.querySelectorAll('[data-news-slide]'));
    const controls = gallery.querySelector('[data-gallery-controls]');
    if (slides.length < 2 || !controls) return;
    const status = gallery.querySelector('[data-gallery-status]');
    const toggle = gallery.querySelector('[data-gallery-toggle]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;
    let playing = !motion.matches;
    let hovered = false;
    let focused = false;
    let timer;
    const show = (index, announce = true) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.hidden = i !== current; });
      status.setAttribute('aria-live', announce ? 'polite' : 'off');
      status.textContent = `${current + 1} / ${slides.length}`;
    };
    const refresh = () => {
      clearInterval(timer);
      toggle.setAttribute('aria-pressed', String(playing));
      toggle.querySelector('[lang="en"]').textContent = playing ? 'Pause' : 'Play';
      toggle.querySelector('[lang="es"]').textContent = playing ? 'Pausar' : 'Reproducir';
      if (playing && !hovered && !focused && !document.hidden) timer = setInterval(() => show(current + 1, false), 7000);
    };
    const step = direction => { playing = false; show(current + direction); refresh(); };
    gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => step(-1));
    gallery.querySelector('[data-gallery-next]').addEventListener('click', () => step(1));
    toggle.addEventListener('click', () => { playing = !playing; refresh(); });
    gallery.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { hovered = true; refresh(); } });
    gallery.addEventListener('pointerleave', () => { hovered = false; refresh(); });
    gallery.addEventListener('focusin', () => { focused = true; refresh(); });
    gallery.addEventListener('focusout', event => { if (!gallery.contains(event.relatedTarget)) { focused = false; refresh(); } });
    gallery.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1); }
    });
    let touch;
    gallery.addEventListener('touchstart', event => {
      const point = event.changedTouches[0]; touch = [point.clientX, point.clientY];
    }, { passive:true });
    gallery.addEventListener('touchend', event => {
      if (!touch) return;
      const point = event.changedTouches[0];
      const dx = point.clientX - touch[0], dy = point.clientY - touch[1];
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
      touch = null;
    }, { passive:true });
    gallery.addEventListener('touchcancel', () => { touch = null; }, { passive:true });
    document.addEventListener('visibilitychange', refresh);
    motion.addEventListener('change', () => { if (motion.matches) { playing = false; refresh(); } });
    controls.hidden = false;
    show(0, false);
    refresh();
  });
})();
