/* Move existing nodes, never duplicate content or form controls. */
document.addEventListener('DOMContentLoaded', () => {
  const home = document.getElementById('Home');
  if (!home) return;
  const mobile = window.matchMedia('(max-width: 767px)');
  const studio = document.getElementById('AboutStudio');
  const team = document.getElementById('About');
  const portfolio = document.getElementById('Portfolio');
  const contact = document.getElementById('Contact');
  const form = document.getElementById('booking-form');
  const originalPositions = new Map();
  function mark(node) {
    const marker = document.createComment('Original desktop position');
    node.before(marker);
    originalPositions.set(node, marker);
  }
  [studio, portfolio].forEach(mark);
  const intro = document.createElement('p');
  intro.className = 'mobile-intro text-gray-300';
  intro.textContent = 'Custom tattoos & premium piercings in Aurora, Colorado. Award-winning artists. Designs made for you.';
  home.querySelector('.hero-image h1').after(intro);
  const optional = document.createElement('details');
  optional.className = 'mobile-details';
  const summary = document.createElement('summary');
  summary.textContent = 'Add details & references (optional)';
  const fields = document.createElement('div');
  optional.append(summary, fields);
  const controls = ['artist', 'date', 'placement', 'size', 'color-preference', 'reference-url'].map(id => document.getElementById(id));
  controls.forEach(control => mark(control.parentElement));
  const service = document.getElementById('service');
  mark(service.parentElement);
  const reviewDetails = [];
  document.querySelectorAll('.review-card > p[lang="es"], .tattoo-work .p-4 > p.text-gray-400').forEach(translation => {
    mark(translation);
    const details = document.createElement('details');
    details.className = 'mobile-details';
    const label = document.createElement('summary');
    label.textContent = translation.closest('.review-card') ? 'Spanish translation' : 'About this piece';
    details.append(label);
    reviewDetails.push({translation, details});
  });
  function serviceFields() {
    const piercing = service.value === 'piercing';
    ['artist', 'size'].forEach(id => {
      const field = document.getElementById(id);
      field.parentElement.hidden = piercing;
      field.disabled = piercing;
    });
  }
  service.addEventListener('change', serviceFields);
  function layout() {
    if (mobile.matches) {
      team.before(portfolio);
      contact.before(studio);
      form.prepend(service.parentElement);
      controls.forEach(control => fields.append(control.parentElement));
      document.getElementById('description').parentElement.after(optional);
      reviewDetails.forEach(({translation,details}) => {
        translation.before(details);
        details.append(translation);
      });
    } else {
      originalPositions.forEach((marker,node) => marker.after(node));
      optional.remove();
      reviewDetails.forEach(({details}) => details.remove());
    }
    serviceFields();
  }
  mobile.addEventListener('change', layout);
  layout();
  // Open optional fields if native validation finds an invalid public URL.
  form.addEventListener('invalid', event => {
    if (optional.contains(event.target)) optional.open = true;
  }, true);
  form.addEventListener('reset', () => { optional.open = false; });
});
