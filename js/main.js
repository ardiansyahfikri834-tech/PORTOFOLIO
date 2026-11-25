document.addEventListener('DOMContentLoaded', () => {
  window.initNavigation?.();
  window.initAnimations?.();

  // Portfolio tabs and folder shortcuts.
  const tabs = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];

  function filterCategory(category) {
    if (!tabs.some((tab) => tab.dataset.filter === category)) return;
    tabs.forEach((tab) => {
      const active = tab.dataset.filter === category;
      tab.classList.toggle('is-selected', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    cards.forEach((card) => {
      card.hidden = card.dataset.category !== category;
    });
    const panel = document.querySelector('#portfolio-items');
    if (panel) panel.setAttribute('aria-labelledby', `tab-${category}`);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => filterCategory(tab.dataset.filter));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      tabs[next].focus();
      tabs[next].click();
    });
  });

  document.querySelectorAll('[data-filter-link]').forEach((link) => {
    link.addEventListener('click', () => filterCategory(link.dataset.filterLink));
  });

  // Project details: the full project card is clickable and keyboard accessible.
  const projectDetails = {
    attendance: {
      kicker: 'PROJECT DETAILS / 01',
      title: 'Presensi Mahasiswa',
      description: 'Website presensi mahasiswa ITS yang dikembangkan sebagai proyek web. Bagian yang ditampilkan di portfolio ini menonjolkan dashboard dan koneksi ke spreadsheet. Lengkapi detail fitur dan kontribusi sesuai implementasi final.',
      role: 'Personal web project',
      focus: 'HTML · CSS · JavaScript · Spreadsheet integration',
      configKey: 'attendance'
    },
    album: {
      kicker: 'PROJECT DETAILS / 02',
      title: 'VANDSTAVOR Album',
      description: 'Eksplorasi website album digital yang berfokus pada penyajian kenangan melalui komposisi visual dan pengalaman menjelajah konten. Tambahkan detail fitur, proses, dan teknologi sesuai versi proyek yang sebenarnya.',
      role: 'Creative web project',
      focus: 'HTML · CSS · JavaScript · Visual storytelling',
      configKey: 'album'
    }
  };

  const projectDialog = document.querySelector('#project-dialog');
  function openProject(key) {
    const item = projectDetails[key];
    if (!item || !projectDialog) return;
    document.querySelector('#dialog-kicker').textContent = item.kicker;
    document.querySelector('#dialog-title').textContent = item.title;
    document.querySelector('#dialog-description').textContent = item.description;
    document.querySelector('#dialog-role').textContent = item.role;
    document.querySelector('#dialog-focus').textContent = item.focus;
    const projectLinks = config.projects?.[item.configKey] || {};
    const safeHttps = (value) => {
      try { return new URL(value).protocol === 'https:'; } catch { return false; }
    };
    [['demo', '#dialog-demo', '#dialog-demo-unavailable', 'Live demo'], ['repository', '#dialog-repository', '#dialog-repository-unavailable', 'Source code']].forEach(([key, linkSelector, fallbackSelector, label]) => {
      const link = document.querySelector(linkSelector);
      const fallback = document.querySelector(fallbackSelector);
      const url = typeof projectLinks[key] === 'string' ? projectLinks[key].trim() : '';
      if (link && fallback && safeHttps(url)) {
        link.href = url; link.hidden = false; fallback.hidden = true;
      } else if (link && fallback) {
        link.hidden = true; link.removeAttribute('href'); fallback.hidden = false; fallback.textContent = `${label} belum ditambahkan`;
      }
    });
    if (typeof projectDialog.showModal === 'function') projectDialog.showModal();
    else projectDialog.setAttribute('open', '');
  }

  document.querySelectorAll('.project-card--interactive').forEach((card) => {
    card.addEventListener('click', () => openProject(card.dataset.projectKey));
    card.addEventListener('keydown', (event) => {
      if (event.target !== card || !['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      openProject(card.dataset.projectKey);
    });
  });
  projectDialog?.addEventListener('click', (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });

  // Contact form: it opens the visitor's mail app only when an email is configured.
  const config = window.PORTFOLIO_CONFIG || {};
  const contactForm = document.querySelector('#contact-form');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = document.querySelector('#form-status');
    const email = typeof config.email === 'string' ? config.email.trim() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Email tujuan belum diatur. Isi alamat email aktif di js/config.js terlebih dahulu.';
      return;
    }
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`Portfolio message from ${data.get('name')}`);
    const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`);
    status.textContent = 'Membuka aplikasi email untuk menyusun pesan…';
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });

  // Back-to-top and reading progress.
  const progress = document.querySelector('#scroll-progress-bar');
  const progressContainer = document.querySelector('.scroll-progress[role="progressbar"]');
  const topButton = document.querySelector('#back-to-top');
  let ticking = false;
  function updateScrollUI() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const amount = max > 0 ? (window.scrollY / max) * 100 : 0;
    const bounded = Math.min(100, Math.max(0, amount));
    if (progress) progress.style.width = `${bounded}%`;
    progressContainer?.setAttribute('aria-valuenow', String(Math.round(bounded)));
    topButton?.classList.toggle('is-visible', window.scrollY > 500);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();
  topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const year = document.querySelector('.site-footer span');
  if (year) year.textContent = `© ${new Date().getFullYear()} FIKRI TRI ARDIANSYAH`;
});
