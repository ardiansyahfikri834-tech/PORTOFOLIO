(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Keep gallery cards responsive without per-pointer JavaScript transforms.
  // CSS hover states provide the visual feedback with much lower overhead.

  // Text belongs to the lightbox; its image source is read from the clicked tile.
  const galleryContent = {
    campus: {
      alt: 'Ilustrasi abstrak gedung kampus saat senja',
      kicker: 'VISUAL DIARY / 01',
      title: 'Campus notes',
      description: 'Ruang belajar, ide baru, dan perjalanan kecil yang membentuk pengalaman selama masa kuliah.'
    },
    code: {
      alt: 'Ilustrasi abstrak jendela kode dan antarmuka digital',
      kicker: 'VISUAL DIARY / 02',
      title: 'Behind the code',
      description: 'Proses mencoba, memperbaiki, dan memahami bagaimana sebuah ide berubah menjadi sesuatu yang bisa digunakan.'
    },
    ideas: {
      alt: 'Ilustrasi abstrak catatan ide dan alat tulis',
      kicker: 'VISUAL DIARY / 03',
      title: 'Creative notes',
      description: 'Potongan inspirasi, sketsa, dan eksplorasi visual yang menemani proses kreatif.'
    },
    surabaya: {
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
      const tileImage = button.querySelector('img');
      if (!item || !tileImage || !galleryDialog || !galleryImage || typeof galleryDialog.showModal !== 'function') return;
      galleryImage.src = tileImage.currentSrc || tileImage.src;
      galleryImage.alt = tileImage.alt || item.alt;
      galleryKicker.textContent = item.kicker;
      galleryTitle.textContent = item.title;
      galleryDescription.textContent = item.description;
      galleryDialog.showModal();
    });
  });

  galleryDialog?.addEventListener('click', (event) => {
    if (event.target === galleryDialog) galleryDialog.close();
  });

  // Do not send visitors to generic social-network homepages when accounts are unset.
  const config = window.PORTFOLIO_CONFIG || {};
  document.querySelectorAll('[data-social]').forEach((link) => {
    const key = link.dataset.social;
    const destination = typeof config[key] === 'string' ? config[key].trim() : '';
    const isConfigured = /^https:\/\//i.test(destination) && !/\/(?:www\.)?(?:github\.com|linkedin\.com|instagram\.com)\/?$/i.test(destination);
    if (isConfigured) {
      link.href = destination;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
      link.classList.remove('is-unconfigured');
      link.title = `Buka ${key}`;
    } else {
      link.href = '#contact';
      link.removeAttribute('target');
      link.setAttribute('aria-disabled', 'true');
      link.classList.add('is-unconfigured');
      link.title = `Tambahkan URL ${key} di js/config.js`;
    }
  });
})();
