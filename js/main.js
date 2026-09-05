/*
  Analytics configuration
  Add the real IDs when they are available. Blank values keep tracking disabled.
*/
const DIROKA_ANALYTICS_CONFIG = Object.freeze({
  googleAnalyticsId: '', // Example: G-XXXXXXXXXX
  metaPixelId: '' // Example: 123456789012345
});

function initializeAnalytics() {
  const googleId = DIROKA_ANALYTICS_CONFIG.googleAnalyticsId.trim();
  const metaId = DIROKA_ANALYTICS_CONFIG.metaPixelId.trim();

  if (/^G-[A-Z0-9]+$/i.test(googleId)) {
    const googleScript = document.createElement('script');
    googleScript.async = true;
    googleScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleId)}`;
    document.head.appendChild(googleScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', googleId);
  }

  if (/^\d{5,20}$/.test(metaId)) {
    const fbq = function () {
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, arguments);
      } else {
        fbq.queue.push(arguments);
      }
    };

    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = fbq;

    const metaScript = document.createElement('script');
    metaScript.async = true;
    metaScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(metaScript);

    window.fbq('init', metaId);
    window.fbq('track', 'PageView');
  }
}

function trackDirokaEvent(eventName, parameters = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, parameters);
  }

  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, parameters);
  }
}

function trackDirokaLead(parameters = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', parameters);
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', parameters);
  }
}

document.addEventListener('DOMContentLoaded', initializeAnalytics, { once: true });

document.addEventListener('click', function (event) {
  const bookingCta = event.target.closest(
    '[data-track], a[href="#Booking"], .portfolio-book-btn, .artist-book-btn'
  );

  if (!bookingCta) {
    return;
  }

  trackDirokaEvent('booking_cta_click', {
    source: bookingCta.dataset.track || bookingCta.textContent.trim().slice(0, 40)
  });
});

/* Booking form */
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('booking-form');

  if (!form || form.dataset.handlerAttached === 'true') {
    return;
  }

  form.dataset.handlerAttached = 'true';

  const submitButton = form.querySelector('button[type="submit"]');
  const formStatus = document.getElementById('form-status');

  function showFormStatus(message, type) {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;
    formStatus.className = `form-status visible ${type} md:col-span-2`;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const emailInput = form.querySelector('[name="email"]');
    const replyToField = form.querySelector('#replytoField');

    if (emailInput && replyToField) {
      replyToField.value = emailInput.value.trim();
    }

    const selectedService = form.querySelector('[name="service"]')?.value || 'unknown';
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = 'SENDING...';
    submitButton.classList.add('opacity-60', 'cursor-not-allowed');

    if (formStatus) {
      formStatus.textContent = '';
      formStatus.className = 'form-status md:col-span-2';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      form.reset();
      form.querySelector('#service')?.dispatchEvent(new Event('change'));

      trackDirokaLead({
        service: selectedService,
        form_name: 'booking_request'
      });

      showFormStatus(
        'Thank you! Your request was sent successfully. Our team will contact you soon.',
        'success'
      );
    } catch (error) {
      console.error('Booking form error:', error);

      showFormStatus(
        'We could not send your request. Please try again or call us at (720) 930-1327.',
        'error'
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      submitButton.classList.remove('opacity-60', 'cursor-not-allowed');
    }
  }, true);
});

/* Artist bios */
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.artist-card').forEach(card => {

    const desc = card.querySelector('.artist-description');
    const btn = card.querySelector('.read-more-btn');

    if (!desc || !btn) return;

    // Si el texto entra completo, ocultamos el botón
    if (desc.scrollHeight <= desc.clientHeight + 5) {
      btn.style.display = "none";
      return;
    }

    btn.textContent = "View Bio →";

    btn.addEventListener("click", () => {

      desc.classList.toggle("expanded");

      btn.textContent = desc.classList.contains("expanded")
        ? "Hide Bio ↑"
        : "View Bio →";

    });

  });

});

/* Navigation, portfolio, booking shortcuts and lightbox */
document.addEventListener('DOMContentLoaded', function () {

  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;

  function setMobileMenu(open) {
    if (!menuToggle || !mobileMenu) {
      return;
    }

    mobileMenu.classList.toggle('hidden', !open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute(
      'aria-label',
      open ? 'Close navigation menu' : 'Open navigation menu'
    );

    if (menuIcon) {
      menuIcon.classList.toggle('fa-bars', !open);
      menuIcon.classList.toggle('fa-xmark', open);
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      setMobileMenu(!isOpen);
    });

    mobileMenu.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        setMobileMenu(false);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) {
        setMobileMenu(false);
      }
    });
  }

  const dateInput = document.getElementById('date');

  if (dateInput) {
    const today = new Date();
    const localDate = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split('T')[0];

    dateInput.min = localDate;
  }

  const gallery = document.getElementById('tattoo-gallery');
const piercingGallery = document.getElementById('piercing-gallery');

const tattooCards = Array.from(
  document.querySelectorAll('.tattoo-work')
);

const piercingCards = Array.from(
  document.querySelectorAll('.piercing-work')
);

  const filterContainer = document.getElementById('portfolio-filters');
  const filterButtons = document.querySelectorAll('.portfolio-filter-btn');

  filterButtons.forEach(function (button) {
    button.setAttribute(
      'aria-pressed',
      String(button.classList.contains('active'))
    );
  });

  const tattooTab = document.getElementById('tattoo-tab');
  const piercingTab = document.getElementById('piercing-tab');

const artistSelect = document.getElementById('artist');
const serviceSelect = document.getElementById('service');
const bookingSection = document.getElementById('Booking');
const colorPreferenceField = document.getElementById('color-preference-field');
const colorPreferenceSelect = document.getElementById('color-preference');

function updateServiceFields() {
  if (!serviceSelect || !colorPreferenceField || !colorPreferenceSelect) {
    return;
  }

  const isTattoo = serviceSelect.value === 'tattoo';

  colorPreferenceField.classList.toggle('hidden', !isTattoo);
  colorPreferenceSelect.disabled = !isTattoo;
}

serviceSelect?.addEventListener('change', updateServiceFields);
updateServiceFields();

  const lightbox = document.getElementById('portfolio-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxArtist = document.getElementById('lightbox-artist');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrevious = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let visibleCards = [...tattooCards];
  let currentImageIndex = 0;

const loadMoreWrapper = document.getElementById(
  'portfolio-load-more-wrapper'
);

const loadMoreButton = document.getElementById(
  'portfolio-load-more'
);

  const artistSelectValues = {
    diego: 'Diego',
    arnold: 'Arnold',
    julian: 'Julian',
    addison: 'Addison'
  };

  /*
    Agrega automáticamente:
    - contenedor para la imagen
    - efecto hover
    - botón para reservar con el artista
  */

  tattooCards.forEach(function (card) {
    const image = card.querySelector('img');
    const cardContent = card.querySelector('.p-4');
    const titleElement = card.querySelector('h3');
    const artistElement = card.querySelector('.portfolio-card-artist');

    if (!image || !cardContent || !titleElement || !artistElement) {
      return;
    }

    const title = titleElement.textContent.trim();
    const artistText = artistElement.textContent.trim();
    const artistKey = card.dataset.artist;

    if (!image.parentElement.classList.contains('portfolio-image-wrapper')) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'portfolio-image-wrapper';
      imageWrapper.tabIndex = 0;
      imageWrapper.setAttribute('role', 'button');
      imageWrapper.setAttribute('aria-label', `View ${title} by ${artistText} at full size`);

      image.parentNode.insertBefore(imageWrapper, image);
      imageWrapper.appendChild(image);

      const overlay = document.createElement('div');
      overlay.className = 'portfolio-overlay';

      overlay.innerHTML = `
        <div>
          <div class="portfolio-overlay-title">${title}</div>
          <div class="portfolio-overlay-artist">${artistText}</div>
          <div class="portfolio-overlay-view">View Full Size →</div>
        </div>
      `;

      imageWrapper.appendChild(overlay);
    }

    if (!card.querySelector('.portfolio-book-btn')) {
      const bookingButton = document.createElement('button');

      bookingButton.type = 'button';
      bookingButton.className = 'portfolio-book-btn';
      bookingButton.dataset.artist = artistKey;

      const artistName = artistSelectValues[artistKey] || artistKey;

      bookingButton.textContent = `Book ${artistName} →`;

      cardContent.appendChild(bookingButton);
    }
  });

    /*
  DISEÑO PREMIUM PARA PIERCINGS
*/

piercingCards.forEach(function (card) {
  const image = card.querySelector('img');
  const cardContent = card.querySelector('.p-4');
  const titleElement = card.querySelector('h3');
  const jewelryElement = card.querySelector('.text-gray-400');

  if (!image || !cardContent || !titleElement) {
    return;
  }

  const title = titleElement.textContent.trim();

  const jewelryText = jewelryElement
    ? jewelryElement.textContent.trim()
    : 'Implant-grade titanium jewelry';

  if (!image.parentElement.classList.contains('portfolio-image-wrapper')) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'portfolio-image-wrapper';
    imageWrapper.tabIndex = 0;
    imageWrapper.setAttribute('role', 'button');
    imageWrapper.setAttribute('aria-label', `View ${title} at full size`);

    image.parentNode.insertBefore(imageWrapper, image);
    imageWrapper.appendChild(image);

    const overlay = document.createElement('div');
    overlay.className = 'portfolio-overlay';

    overlay.innerHTML = `
      <div>
        <div class="portfolio-overlay-title">${title}</div>
        <div class="portfolio-overlay-artist">${jewelryText}</div>
        <div class="portfolio-overlay-view">View Full Size →</div>
      </div>
    `;

    imageWrapper.appendChild(overlay);
  }

  if (!card.querySelector('.portfolio-book-btn')) {
    const bookingButton = document.createElement('button');

    bookingButton.type = 'button';
    bookingButton.className = 'portfolio-book-btn';
    bookingButton.dataset.service = 'piercing';
    bookingButton.textContent = 'Book Piercing →';

    cardContent.appendChild(bookingButton);
  }
});


 /*
  FILTROS, MEZCLA INTELIGENTE Y VIEW MORE
*/

const photosPerLoad = 12;

let currentFilter = 'all';
let visiblePhotoLimit = photosPerLoad;
let mixedTattooCards = [];

function shuffleCards(cards) {
  const shuffledCards = [...cards];

  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffledCards[i], shuffledCards[randomIndex]] =
      [shuffledCards[randomIndex], shuffledCards[i]];
  }

  return shuffledCards;
}

function createBalancedMix(cards) {
  const cardsByArtist = {};

  cards.forEach(function (card) {
    const artist = card.dataset.artist;

    if (!cardsByArtist[artist]) {
      cardsByArtist[artist] = [];
    }

    cardsByArtist[artist].push(card);
  });

  Object.keys(cardsByArtist).forEach(function (artist) {
    cardsByArtist[artist] = shuffleCards(cardsByArtist[artist]);
  });

  const mixedCards = [];
  let previousArtist = '';
  let consecutiveArtistCount = 0;

  while (
    Object.values(cardsByArtist).some(function (artistCards) {
      return artistCards.length > 0;
    })
  ) {
    let availableArtists = Object.keys(cardsByArtist).filter(
      function (artist) {
        return cardsByArtist[artist].length > 0;
      }
    );

    availableArtists = shuffleCards(availableArtists);

    let selectedArtist = availableArtists.find(function (artist) {
      return !(
        artist === previousArtist &&
        consecutiveArtistCount >= 2
      );
    });

    if (!selectedArtist) {
      selectedArtist = availableArtists[0];
    }

    const selectedCard = cardsByArtist[selectedArtist].shift();

    mixedCards.push(selectedCard);

    if (selectedArtist === previousArtist) {
      consecutiveArtistCount++;
    } else {
      previousArtist = selectedArtist;
      consecutiveArtistCount = 1;
    }
  }

  return mixedCards;
}

function updateLoadMoreButton(totalCards) {
  if (!loadMoreWrapper || !loadMoreButton) {
    return;
  }

  const shouldShowButton =
    currentFilter === 'all' &&
    visiblePhotoLimit < totalCards;

  loadMoreWrapper.style.display = shouldShowButton
    ? 'block'
    : 'none';

  loadMoreButton.textContent = 'View More';
}

function updatePortfolioGallery() {
  let cardsToDisplay = [];

  if (currentFilter === 'all') {
    cardsToDisplay = mixedTattooCards;
  } else {
    cardsToDisplay = tattooCards.filter(function (card) {
      return card.dataset.artist === currentFilter;
    });
  }

  cardsToDisplay.forEach(function (card) {
    gallery.appendChild(card);
  });

  tattooCards.forEach(function (card) {
    card.classList.add('portfolio-hidden');
  });

  if (currentFilter === 'all') {
    cardsToDisplay
      .slice(0, visiblePhotoLimit)
      .forEach(function (card) {
        card.classList.remove('portfolio-hidden');
      });
  } else {
    cardsToDisplay.forEach(function (card) {
      card.classList.remove('portfolio-hidden');
    });
  }

  visibleCards = cardsToDisplay.filter(function (card) {
    return !card.classList.contains('portfolio-hidden');
  });

  updateLoadMoreButton(cardsToDisplay.length);
}

function activateFilterButton(activeButton) {
  filterButtons.forEach(function (button) {
    button.classList.remove('active');
    button.setAttribute('aria-pressed', 'false');
  });

  activeButton.classList.add('active');
  activeButton.setAttribute('aria-pressed', 'true');
}

filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    currentFilter = button.dataset.filter;
    visiblePhotoLimit = photosPerLoad;

    activateFilterButton(button);

    if (currentFilter === 'all') {
      mixedTattooCards = createBalancedMix(tattooCards);
    }

    updatePortfolioGallery();
  });
});

if (loadMoreButton) {
  loadMoreButton.addEventListener('click', function () {
    visiblePhotoLimit += photosPerLoad;

    updatePortfolioGallery();
  });
}

mixedTattooCards = createBalancedMix(tattooCards);

updatePortfolioGallery();
/*
  RESERVAR CON EL ARTISTA O PIERCING
*/

document.addEventListener('click', function (event) {
  const bookingButton = event.target.closest(
    '.portfolio-book-btn, .artist-book-btn'
  );

  if (!bookingButton) {
    return;
  }

  event.preventDefault();

  const artistKey = bookingButton.dataset.artist
    ? bookingButton.dataset.artist.toLowerCase()
    : '';

  const service = bookingButton.dataset.service;

  if (service === 'piercing') {
    if (serviceSelect) {
      serviceSelect.value = 'piercing';
      serviceSelect.dispatchEvent(new Event('change'));
    }

    if (artistSelect) {
      artistSelect.value = '';
      artistSelect.dispatchEvent(new Event('change'));
    }
  } else if (artistKey) {
    const artistValue = artistSelectValues[artistKey];

    if (artistSelect && artistValue) {
      artistSelect.value = artistValue;
      artistSelect.dispatchEvent(new Event('change'));
    }

    if (serviceSelect) {
      serviceSelect.value = 'tattoo';
      serviceSelect.dispatchEvent(new Event('change'));
    }
  }

  if (bookingSection) {
    bookingSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});

  /*
    LIGHTBOX
  */

  function updateLightbox() {
    const currentCard = visibleCards[currentImageIndex];

    if (!currentCard) {
      return;
    }

    const image = currentCard.querySelector('img');
const title = currentCard.querySelector('h3');

const artist =
  currentCard.querySelector('.portfolio-card-artist') ||
  currentCard.querySelector('.text-gray-400');
      
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightboxTitle.textContent = title
      ? title.textContent.trim()
      : '';

    lightboxArtist.textContent = artist
      ? artist.textContent.trim()
      : '';
  }

  let previouslyFocusedElement = null;

 function openLightbox(card, cards) {
    if (!lightbox || !lightboxImage) {
      return;
    }

    visibleCards = cards.filter(function (portfolioCard) {
      return !portfolioCard.classList.contains('portfolio-hidden');
    });

    if (visibleCards.length === 0) {
      return;
    }
     
    currentImageIndex = visibleCards.indexOf(card);

    if (currentImageIndex < 0) {
      currentImageIndex = 0;
    }

    updateLightbox();

    previouslyFocusedElement = document.activeElement;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose?.focus();
  }

  function closeLightbox() {
    if (!lightbox) {
      return;
    }

    const wasOpen = lightbox.classList.contains('open');
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (wasOpen && previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus();
    }
  }

  function showNextImage() {
    if (visibleCards.length === 0) {
      return;
    }

    currentImageIndex =
      (currentImageIndex + 1) % visibleCards.length;

    updateLightbox();
  }

  function showPreviousImage() {
    if (visibleCards.length === 0) {
      return;
    }

    currentImageIndex =
      (currentImageIndex - 1 + visibleCards.length) %
      visibleCards.length;

    updateLightbox();
  }

  if (gallery) {
    gallery.addEventListener('click', function (event) {
      const imageWrapper = event.target.closest('.portfolio-image-wrapper');

      if (!imageWrapper) {
        return;
      }

      const card = imageWrapper.closest('.tattoo-work');

      if (card) {
       openLightbox(card, tattooCards);
      }
    });

    gallery.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      const imageWrapper = event.target.closest('.portfolio-image-wrapper');
      const card = imageWrapper?.closest('.tattoo-work');

      if (card) {
        event.preventDefault();
        openLightbox(card, tattooCards);
      }
    });
  }
        if (piercingGallery) {
  piercingGallery.addEventListener('click', function (event) {
    const imageWrapper = event.target.closest('.portfolio-image-wrapper');

    if (!imageWrapper) {
      return;
    }

    const card = imageWrapper.closest('.piercing-work');

    if (card) {
      openLightbox(card, piercingCards);
    }
  });

  piercingGallery.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    const imageWrapper = event.target.closest('.portfolio-image-wrapper');
    const card = imageWrapper?.closest('.piercing-work');

    if (card) {
      event.preventDefault();
      openLightbox(card, piercingCards);
    }
  });
}

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (event) {
      event.stopPropagation();
      showNextImage();
    });
  }

  if (lightboxPrevious) {
    lightboxPrevious.addEventListener('click', function (event) {
      event.stopPropagation();
      showPreviousImage();
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      setMobileMenu(false);
    }

    if (!lightbox || !lightbox.classList.contains('open')) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowRight') {
      showNextImage();
    }

    if (event.key === 'ArrowLeft') {
      showPreviousImage();
    }
  });

 /*
  CAMBIAR ENTRE TATTOOS Y PIERCINGS
*/

function showTattooGallery() {
  if (gallery) {
    gallery.classList.remove('hidden');
    gallery.setAttribute('aria-hidden', 'false');
  }

  if (piercingGallery) {
    piercingGallery.classList.add('hidden');
    piercingGallery.setAttribute('aria-hidden', 'true');
  }

  if (filterContainer) {
    filterContainer.style.display = 'flex';
  }

  if (tattooTab) {
    tattooTab.classList.add('tab-active', 'text-white');
    tattooTab.classList.remove('text-gray-400');
    tattooTab.setAttribute('aria-selected', 'true');
  }

  if (piercingTab) {
    piercingTab.classList.remove('tab-active', 'text-white');
    piercingTab.classList.add('text-gray-400');
    piercingTab.setAttribute('aria-selected', 'false');
  }

  updatePortfolioGallery();

  closeLightbox();
}

function showPiercingGallery() {
  if (gallery) {
    gallery.classList.add('hidden');
    gallery.setAttribute('aria-hidden', 'true');
  }

  if (piercingGallery) {
    piercingGallery.classList.remove('hidden');
    piercingGallery.setAttribute('aria-hidden', 'false');
  }

  if (filterContainer) {
    filterContainer.style.display = 'none';
  }

  if (loadMoreWrapper) {
    loadMoreWrapper.style.display = 'none';
  }

  if (piercingTab) {
    piercingTab.classList.add('tab-active', 'text-white');
    piercingTab.classList.remove('text-gray-400');
    piercingTab.setAttribute('aria-selected', 'true');
  }

  if (tattooTab) {
    tattooTab.classList.remove('tab-active', 'text-white');
    tattooTab.classList.add('text-gray-400');
    tattooTab.setAttribute('aria-selected', 'false');
  }

  closeLightbox();
}

if (tattooTab) {
  tattooTab.addEventListener('click', showTattooGallery);
}

if (piercingTab) {
  piercingTab.addEventListener('click', showPiercingGallery);
}

const tattooNavigationLinks = [
  document.getElementById('nav-tattoo'),
  document.getElementById('mnav-tattoo')
];

const piercingNavigationLinks = [
  document.getElementById('nav-piercing'),
  document.getElementById('mnav-piercing')
];

tattooNavigationLinks.forEach(function (link) {
  if (!link) {
    return;
  }

  link.addEventListener('click', function () {
    showTattooGallery();
  });
});

piercingNavigationLinks.forEach(function (link) {
  if (!link) {
    return;
  }

  link.addEventListener('click', function () {
    showPiercingGallery();
  });
});

showTattooGallery();
});
