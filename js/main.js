// Menú móvil
        document.getElementById('menu-toggle').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });
        
        // Pestañas de galería
        document.getElementById('tattoo-tab').addEventListener('click', function() {
            this.classList.add('tab-active');
            this.classList.remove('text-gray-400');
            this.classList.add('text-white');
            
            document.getElementById('piercing-tab').classList.remove('tab-active');
            document.getElementById('piercing-tab').classList.add('text-gray-400');
            document.getElementById('piercing-tab').classList.remove('text-white');
            
            document.getElementById('tattoo-gallery').classList.remove('hidden');
            document.getElementById('piercing-gallery').classList.add('hidden');
        });
        
        document.getElementById('piercing-tab').addEventListener('click', function() {
            this.classList.add('tab-active');
            this.classList.remove('text-gray-400');
            this.classList.add('text-white');
            
            document.getElementById('tattoo-tab').classList.remove('tab-active');
            document.getElementById('tattoo-tab').classList.add('text-gray-400');
            document.getElementById('tattoo-tab').classList.remove('text-white');
            
            document.getElementById('piercing-gallery').classList.remove('hidden');
            document.getElementById('tattoo-gallery').classList.add('hidden');
        });
        // Pestañas de galería
document.getElementById('tattoo-tab').addEventListener('click', function() {
    this.classList.add('tab-active');
    this.classList.remove('text-gray-400');
    this.classList.add('text-white');
    
    document.getElementById('piercing-tab').classList.remove('tab-active');
    document.getElementById('piercing-tab').classList.add('text-gray-400');
    document.getElementById('piercing-tab').classList.remove('text-white');
    
    document.getElementById('tattoo-gallery').classList.remove('hidden');
    document.getElementById('piercing-gallery').classList.add('hidden');
});

document.getElementById('piercing-tab').addEventListener('click', function() {
    this.classList.add('tab-active');
    this.classList.remove('text-gray-400');
    this.classList.add('text-white');
    
    document.getElementById('tattoo-tab').classList.remove('tab-active');
    document.getElementById('tattoo-tab').classList.add('text-gray-400');
    document.getElementById('tattoo-tab').classList.remove('text-white');
    
    document.getElementById('piercing-gallery').classList.remove('hidden');
    document.getElementById('tattoo-gallery').classList.add('hidden');
});

// ----- Navbar -> activar pestaña correcta en Portfolio (sin pelearse con el scroll suave) -----
['nav-piercing','mnav-piercing'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', (e) => {
    e.preventDefault();                                     // no usamos el handler global de anclas
    document.getElementById('piercing-tab')?.click();       // activa la pestaña
    document.getElementById('Portfolio')?.scrollIntoView({  // luego scroll
      behavior: 'smooth'
    });
  });
});

['nav-tattoo','mnav-tattoo'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('tattoo-tab')?.click();
    document.getElementById('Portfolio')?.scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// ----- Forzar estado inicial por si quedó alterado -----
(function enforceInitialGalleryState() {
  const tTab = document.getElementById('tattoo-tab');
  const pTab = document.getElementById('piercing-tab');
  const tGal = document.getElementById('tattoo-gallery');
  const pGal = document.getElementById('piercing-gallery');
  if (!tTab || !pTab || !tGal || !pGal) return;

  tTab.classList.add('tab-active','text-white');
  tTab.classList.remove('text-gray-400');

  pTab.classList.remove('tab-active','text-white');
  pTab.classList.add('text-gray-400');

  tGal.classList.remove('hidden');
  pGal.classList.add('hidden');
})();

        
        // FAQ accordion
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentNode;
                const answer = item.querySelector('.faq-answer');
                const icon = question.querySelector('i');
                
                answer.classList.toggle('hidden');
                icon.classList.toggle('transform');
                icon.classList.toggle('rotate-180');
            });
        });
        
        // Formulario de reserva - establecer fecha mínima como hoy
        document.getElementById('date').min = new Date().toISOString().split('T')[0];
        
        // Envío real de formulario de reservas
        document.getElementById('booking-form').addEventListener('submit', async function(e) {
            e.preventDefault();
        
            // Obtén los valores del formulario
            const name = this.name.value.trim();
            const email = this.email.value.trim();
            const phone = this.phone.value.trim();
            const artist = this.artist.value;
            const service = this.service.value;
            const date = this.date.value;
            const description = this.description.value;
        
            // Validación básica (puedes mejorarla)
            if (!name || !email || !phone) {
                alert('Por favor completa todos los campos obligatorios.');
                return;
            }
        
            const data = { name, email, phone, artist, service, date, description };
        
            try {
                const response = await fetch('http://localhost:3000/api/reserva', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    this.reset();
                    alert('¡Tu solicitud fue enviada correctamente!');
                } else {
                    alert('Hubo un error al enviar la solicitud.');
                }
            } catch (err) {
                alert('No se pudo conectar con el servidor.');
            }
        });
        
        // Envío simulado para el formulario de contacto (puedes hacer algo similar si tienes endpoint)
        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Mensaje enviado con éxito! Te responderemos lo antes posible.');
            this.reset();
        });
        
        // Scroll suave para enlaces
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if(this.getAttribute('href') === '#') return;
                
                e.preventDefault();
                
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                if(!document.getElementById('mobile-menu').classList.contains('hidden')) {
                    document.getElementById('mobile-menu').classList.add('hidden');
                }
            });
        });
        
        // Animación de elementos al hacer scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeIn');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.gallery-item, .artist-card, .faq-item').forEach(el => {
            observer.observe(el);
        });
        