document.addEventListener('DOMContentLoaded', function () {

  // =========================
  // MENÚ MÓVIL
  // =========================

  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }


  // =========================
  // GALERÍA: TATTOOS / PIERCINGS
  // =========================

  const tattooTab = document.getElementById('tattoo-tab');
  const piercingTab = document.getElementById('piercing-tab');
  const tattooGallery = document.getElementById('tattoo-gallery');
  const piercingGallery = document.getElementById('piercing-gallery');
  const portfolioFilters = document.getElementById('portfolio-filters');

  function showTattooGallery() {
    if (!tattooTab || !piercingTab || !tattooGallery || !piercingGallery) {
      return;
    }

    tattooTab.classList.add('tab-active', 'text-white');
    tattooTab.classList.remove('text-gray-400');

    piercingTab.classList.remove('tab-active', 'text-white');
    piercingTab.classList.add('text-gray-400');

    tattooGallery.classList.remove('hidden');
    piercingGallery.classList.add('hidden');

    if (portfolioFilters) {
      portfolioFilters.style.display = 'flex';
    }
  }

  function showPiercingGallery() {
    if (!tattooTab || !piercingTab || !tattooGallery || !piercingGallery) {
      return;
    }

    piercingTab.classList.add('tab-active', 'text-white');
    piercingTab.classList.remove('text-gray-400');

    tattooTab.classList.remove('tab-active', 'text-white');
    tattooTab.classList.add('text-gray-400');

    piercingGallery.classList.remove('hidden');
    tattooGallery.classList.add('hidden');

    if (portfolioFilters) {
      portfolioFilters.style.display = 'none';
    }
  }

  if (tattooTab) {
    tattooTab.addEventListener('click', showTattooGallery);
  }

  if (piercingTab) {
    piercingTab.addEventListener('click', showPiercingGallery);
  }

  // Estado inicial
  showTattooGallery();


  // =========================
  // NAVEGACIÓN HACIA PORTFOLIO
  // =========================

  ['nav-piercing', 'mnav-piercing'].forEach(function (id) {
    const link = document.getElementById(id);

    if (!link) return;

    link.addEventListener('click', function (event) {
      event.preventDefault();

      showPiercingGallery();

      document.getElementById('Portfolio')?.scrollIntoView({
        behavior: 'smooth'
      });

      mobileMenu?.classList.add('hidden');
    });
  });

  ['nav-tattoo', 'mnav-tattoo'].forEach(function (id) {
    const link = document.getElementById(id);

    if (!link) return;

    link.addEventListener('click', function (event) {
      event.preventDefault();

      showTattooGallery();

      document.getElementById('Portfolio')?.scrollIntoView({
        behavior: 'smooth'
      });

      mobileMenu?.classList.add('hidden');
    });
  });


  // =========================
  // FAQ
  // =========================

  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      const item = question.parentNode;
      const answer = item?.querySelector('.faq-answer');
      const icon = question.querySelector('i');

      answer?.classList.toggle('hidden');
      icon?.classList.toggle('transform');
      icon?.classList.toggle('rotate-180');
    });
  });


  // =========================
  // FECHA MÍNIMA DEL FORMULARIO
  // =========================

  const dateInput = document.getElementById('date');

  if (dateInput) {
    const today = new Date();
    const localDate = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split('T')[0];

    dateInput.min = localDate;
  }


  // =========================
  // SCROLL SUAVE
  // =========================

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      const targetId = anchor.getAttribute('href');

      if (
        !targetId ||
        targetId === '#' ||
        anchor.id === 'nav-piercing' ||
        anchor.id === 'mnav-piercing' ||
        anchor.id === 'nav-tattoo' ||
        anchor.id === 'mnav-tattoo'
      ) {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth'
      });

      mobileMenu?.classList.add('hidden');
    });
  });


  // =========================
  // ANIMACIÓN AL HACER SCROLL
  // =========================

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    document
      .querySelectorAll('.gallery-item, .artist-card, .faq-item')
      .forEach(function (element) {
        observer.observe(element);
      });
  }

});
