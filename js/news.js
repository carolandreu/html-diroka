// A local language control for news, independent of the rest of the website.
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
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.newsLang === language)));
      if (region === document.body) {
        document.documentElement.lang = language;
        document.title = language === 'es'
          ? 'Un fin de semana de premios | Diroka Tattoo Studio'
          : 'An award-winning weekend | Diroka Tattoo Studio';
      }
      region.querySelectorAll('[data-news-story-link]').forEach(link => {
        const destination = new URL(link.href);
        destination.searchParams.set('lang', language);
        link.href = destination.href;
      });
    };
    controls.hidden = false;
    buttons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.newsLang)));
    const language = new URLSearchParams(location.search).get('lang');
    setLanguage(language === 'es' ? 'es' : 'en');
  });
})();
