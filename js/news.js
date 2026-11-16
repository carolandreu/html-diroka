// Local language controls and a progressively enhanced news photo gallery.
(() => {
  document.querySelectorAll('[data-news-region]').forEach(region => {
    const controls = region.querySelector('[data-news-language]');
    if (!controls) return;
    const buttons = Array.from(controls.querySelectorAll('button[data-news-lang]'));
    const setLanguage = language => {
      if (!['en', 'es'].includes(language)) return;
      [region, ...document.querySelectorAll('[data-news-announcement]')].forEach(area => {
        area.querySelectorAll('[data-news-content]').forEach(content => {
          content.hidden = content.lang !== language;
        });
        area.querySelectorAll('[data-label-en]').forEach(element => {
          element.setAttribute('aria-label', element.dataset[language === 'es' ? 'labelEs' : 'labelEn']);
        });
        area.querySelectorAll('[data-alt-en]').forEach(element => {
          element.alt = element.dataset[language === 'es' ? 'altEs' : 'altEn'];
        });
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
    if (!slides.length || !controls) return;
    const status = gallery.querySelector('[data-gallery-status]');
    const toggle = gallery.querySelector('[data-gallery-toggle]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;
    let playing = slides.length > 1 && !motion.matches;
    let hovered = false;
    let focused = false;
    let inView = false;
    let timer;
    const region = gallery.closest('[data-news-region]');
    const language = () => region.querySelector('[data-news-lang="es"]').getAttribute('aria-pressed') === 'true' ? 'es' : 'en';
    const dialog = document.createElement('dialog');
    const canExpand = typeof dialog.showModal === 'function';
    const photoButtons = [];
    const thumbnailButtons = [];
    let updateViewer = () => {};
    if (canExpand) {
      dialog.className = 'news-lightbox';
      dialog.innerHTML = '<div class="news-lightbox-top"><p data-viewer-title></p><button type="button" data-viewer-close autofocus></button></div><figure class="news-lightbox-figure"><img class="news-lightbox-image" alt=""><figcaption class="news-lightbox-caption"></figcaption></figure><div class="news-lightbox-nav"><button type="button" data-viewer-prev>←</button><span class="news-lightbox-status" aria-live="polite" aria-atomic="true"></span><button type="button" data-viewer-next>→</button></div>';
      gallery.append(dialog);
      const viewerImage = dialog.querySelector('img');
      const viewerCaption = dialog.querySelector('figcaption');
      const close = dialog.querySelector('[data-viewer-close]');
      const previous = dialog.querySelector('[data-viewer-prev]');
      const next = dialog.querySelector('[data-viewer-next]');
      previous.hidden = next.hidden = slides.length < 2;
      updateViewer = () => {
        const spanish = language() === 'es';
        const source = slides[current].querySelector('img');
        const src = source.getAttribute('src');
        if (viewerImage.getAttribute('src') !== src) viewerImage.setAttribute('src', src);
        viewerImage.alt = source.dataset[spanish ? 'altEs' : 'altEn'] || source.alt;
        viewerCaption.textContent = slides[current].querySelector(`figcaption [lang="${language()}"]`).textContent;
        dialog.setAttribute('aria-label', spanish ? 'Fotos ampliadas de la convención' : 'Enlarged convention photos');
        dialog.querySelector('[data-viewer-title]').textContent = 'Ink Masters Tattoo Show';
        close.textContent = spanish ? 'Cerrar ×' : 'Close ×';
        previous.setAttribute('aria-label', spanish ? 'Foto anterior' : 'Previous photo');
        next.setAttribute('aria-label', spanish ? 'Foto siguiente' : 'Next photo');
        dialog.querySelector('.news-lightbox-status').textContent = `${current + 1} / ${slides.length}`;
      };
      close.addEventListener('click', () => dialog.close());
      previous.addEventListener('click', () => step(-1));
      next.addEventListener('click', () => step(1));
      dialog.addEventListener('keydown', event => {
        if (event.key !== 'Tab') return;
        const buttons = [close, previous, next].filter(button => !button.hidden);
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      });
      dialog.addEventListener('close', () => {
        document.documentElement.classList.remove('news-viewer-open');
        photoButtons[current].focus({ preventScroll:true });
      });
      slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'news-photo-open';
        button.setAttribute('aria-haspopup', 'dialog');
        button.dataset.labelEn = `Enlarge photo: ${img.dataset.altEn || img.alt}`;
        button.dataset.labelEs = `Ampliar foto: ${img.dataset.altEs || img.alt}`;
        button.setAttribute('aria-label', button.dataset[language() === 'es' ? 'labelEs' : 'labelEn']);
        img.before(button);
        button.append(img);
        const hint = document.createElement('span');
        hint.className = 'news-photo-hint';
        hint.setAttribute('aria-hidden', 'true');
        [['en', 'View photo'], ['es', 'Ampliar foto']].forEach(([lang, label]) => {
          const text = document.createElement('span');
          text.dataset.newsContent = '';
          text.lang = lang;
          text.textContent = label;
          text.hidden = lang !== language();
          hint.append(text);
        });
        button.append(hint);
        button.addEventListener('click', () => {
          if (swiped) { swiped = false; return; }
          playing = false;
          show(index);
          refresh();
          updateViewer();
          dialog.showModal();
          document.documentElement.classList.add('news-viewer-open');
        });
        photoButtons.push(button);
      });
    }
    const thumbnails = document.createElement('div');
    thumbnails.className = 'news-thumbnails';
    thumbnails.setAttribute('role', 'group');
    thumbnails.dataset.labelEn = 'Choose a photo';
    thumbnails.dataset.labelEs = 'Elegí una foto';
    thumbnails.setAttribute('aria-label', thumbnails.dataset[language() === 'es' ? 'labelEs' : 'labelEn']);
    thumbnails.hidden = slides.length < 2;
    slides.forEach((slide, index) => {
      const source = slide.querySelector('img');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'news-thumbnail';
      button.dataset.galleryThumb = String(index);
      button.dataset.labelEn = `Show photo ${index + 1}: ${source.dataset.altEn || source.alt}`;
      button.dataset.labelEs = `Ver foto ${index + 1}: ${source.dataset.altEs || source.alt}`;
      button.setAttribute('aria-label', button.dataset[language() === 'es' ? 'labelEs' : 'labelEn']);
      const img = document.createElement('img');
      img.src = source.getAttribute('src');
      img.alt = '';
      img.width = 64;
      img.height = 54;
      img.loading = 'lazy';
      img.decoding = 'async';
      button.append(img);
      button.addEventListener('click', () => goTo(index));
      thumbnails.append(button);
      thumbnailButtons.push(button);
    });
    controls.before(thumbnails);
    const show = (index, announce = true) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.hidden = i !== current; });
      thumbnailButtons.forEach((button, i) => button.setAttribute('aria-current', String(i === current)));
      status.setAttribute('aria-live', announce ? 'polite' : 'off');
      status.textContent = `${current + 1} / ${slides.length}`;
      if (dialog.open) updateViewer();
    };
    const refresh = () => {
      clearInterval(timer);
      toggle.setAttribute('aria-pressed', String(playing));
      toggle.querySelector('[lang="en"]').textContent = playing ? 'Pause' : 'Play';
      toggle.querySelector('[lang="es"]').textContent = playing ? 'Pausar' : 'Reproducir';
      if (playing && inView && !hovered && !focused && !dialog.open && !document.hidden) timer = setInterval(() => show(current + 1, false), 7000);
    };
    const goTo = index => { playing = false; show(index); refresh(); };
    const step = direction => goTo(current + direction);
    gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => step(-1));
    gallery.querySelector('[data-gallery-next]').addEventListener('click', () => step(1));
    toggle.addEventListener('click', () => { playing = !playing; refresh(); });
    gallery.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { hovered = true; refresh(); } });
    gallery.addEventListener('pointerleave', () => { hovered = false; refresh(); });
    gallery.addEventListener('focusin', () => { focused = true; refresh(); });
    gallery.addEventListener('focusout', event => { if (!gallery.contains(event.relatedTarget)) { focused = false; refresh(); } });
    gallery.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        step(event.key === 'ArrowLeft' ? -1 : 1);
        if (event.target.closest('.news-thumbnail')) thumbnailButtons[current].focus({ preventScroll:true });
      }
    });
    let touch;
    let swiped = false;
    gallery.addEventListener('touchstart', event => {
      swiped = false;
      const point = event.changedTouches[0]; touch = [point.clientX, point.clientY];
    }, { passive:true });
    gallery.addEventListener('touchend', event => {
      if (!touch) return;
      const point = event.changedTouches[0];
      const dx = point.clientX - touch[0], dy = point.clientY - touch[1];
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { swiped = true; step(dx < 0 ? 1 : -1); }
      touch = null;
    }, { passive:true });
    gallery.addEventListener('touchcancel', () => { touch = null; }, { passive:true });
    document.addEventListener('visibilitychange', refresh);
    motion.addEventListener('change', () => { if (motion.matches) { playing = false; refresh(); } });
    const photoArea = gallery.querySelector('.news-slides');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .5;
        refresh();
      }, { threshold:.5, rootMargin:'-80px 0px 0px 0px' });
      observer.observe(photoArea);
    } else {
      const checkVisibility = () => {
        const rect = photoArea.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 80));
        const visible = rect.height > 0 && visibleHeight >= rect.height * .5;
        if (visible !== inView) { inView = visible; refresh(); }
      };
      window.addEventListener('scroll', checkVisibility, { passive:true });
      window.addEventListener('resize', checkVisibility);
      checkVisibility();
    }
    controls.hidden = slides.length < 2;
    show(0, false);
    refresh();
  });
})();
