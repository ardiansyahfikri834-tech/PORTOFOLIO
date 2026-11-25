(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Add a short stagger to reveal groups while keeping reduced-motion users in mind.
  if (!reduceMotion) {
    document.querySelectorAll('.reveal').forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`);
    });
  }

  // Soft pointer light in the hero; no effect on touch devices.
  const hero = document.querySelector('.hero');
  if (hero && finePointer && !reduceMotion) {
    hero.addEventListener('pointermove', (event) => {
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      hero.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
  }

  // Gentle 3D tilt for the illustrated gallery cards.
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.gallery-tile').forEach((tile) => {
      tile.addEventListener('pointermove', (event) => {
        const bounds = tile.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        tile.style.setProperty('--glow-x', `${x * 100}%`);
        tile.style.setProperty('--glow-y', `${y * 100}%`);
        tile.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 6}deg) translateY(-3px)`;
      });
      tile.addEventListener('pointerleave', () => {
        tile.style.transform = '';
        tile.style.setProperty('--glow-x', '50%');
        tile.style.setProperty('--glow-y', '50%');
      });
    });
  }

  // Gallery lightbox uses the exact SVG illustration assigned to each card.
  const galleryContent = {
    campus: {
      src: 'assets/images/gallery-campus.svg',
      alt: 'Ilustrasi abstrak gedung kampus saat senja',
      kicker: 'VISUAL DIARY / 01',
      title: 'Campus notes',
      description: 'Ruang belajar, ide baru, dan perjalanan kecil yang membentuk pengalaman selama masa kuliah.'
    },
    code: {
      src: 'assets/images/gallery-code.svg',
      alt: 'Ilustrasi abstrak jendela kode dan antarmuka digital',
      kicker: 'VISUAL DIARY / 02',
      title: 'Behind the code',
      description: 'Proses mencoba, memperbaiki, dan memahami bagaimana sebuah ide berubah menjadi sesuatu yang bisa digunakan.'
    },
    ideas: {
      src: 'assets/images/gallery-ideas.svg',
      alt: 'Ilustrasi abstrak catatan ide dan alat tulis',
      kicker: 'VISUAL DIARY / 03',
      title: 'Creative notes',
      description: 'Potongan inspirasi, sketsa, dan eksplorasi visual yang menemani proses kreatif.'
    },
    surabaya: {
      src: 'assets/images/gallery-city.svg',
      alt: 'Ilustrasi abstrak lanskap kota pada malam hari',
      kicker: 'VISUAL DIARY / 04',
      title: 'City lights',
      description: 'Suasana kota dan lingkungan baru yang menjadi bagian dari cerita perjalanan di Surabaya.'
    }
  };

  const galleryDialog = document.querySelector('#gallery-dialog');
  const galleryImage = document.querySelector('#gallery-dialog-image');
  const galleryKicker = document.querySelector('#gallery-dialog-kicker');
  const galleryTitle = document.querySelector('#gallery-dialog-title');
  const galleryDescription = document.querySelector('#gallery-dialog-description');

  document.querySelectorAll('[data-gallery-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = galleryContent[button.dataset.galleryOpen];
      if (!item || !galleryDialog || typeof galleryDialog.showModal !== 'function') return;
      galleryImage.src = item.src;
      galleryImage.alt = item.alt;
      galleryKicker.textContent = item.kicker;
      galleryTitle.textContent = item.title;
      galleryDescription.textContent = item.description;
      galleryDialog.showModal();
    });
  });

  galleryDialog?.addEventListener('click', (event) => {
    if (event.target === galleryDialog) galleryDialog.close();
  });

  // Social links remain explainable/clickable until the owner's URL is configured.
  const config = window.PORTFOLIO_CONFIG || {};
  const socialStatus = document.querySelector('#social-link-status');
  document.querySelectorAll('[data-social]').forEach((link) => {
    const key = link.dataset.social;
    const destination = typeof config[key] === 'string' ? config[key].trim() : '';
    let parsed = null;
    try { parsed = new URL(destination); } catch { /* Not configured yet. */ }
    const isConfigured = parsed?.protocol === 'https:' && parsed.pathname !== '/';
    if (isConfigured) {
      link.href = destination;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.classList.remove('is-unconfigured');
      link.title = `Buka ${key}`;
    } else {
      link.href = '#contact';
      link.removeAttribute('target');
      link.classList.add('is-unconfigured');
      link.title = `Tambahkan URL ${key} di js/config.js`;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        if (socialStatus) socialStatus.textContent = `Tautan ${key} belum diatur. Isi URL akunmu di js/config.js.`;
      });
    }
  });
})();
