(() => {
  'use strict';

  const config = window.PORTFOLIO_CONFIG || {};
  const isSafeHttpsUrl = (value) => {
    if (typeof value !== 'string' || !value.trim()) return false;
    try {
      const parsed = new URL(value.trim());
      return parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Reveal the CV action only for an HTTPS URL or a safe local PDF path.
  const cvLink = document.querySelector('#cv-download');
  const cvValue = typeof config.cvUrl === 'string' ? config.cvUrl.trim() : '';
  const isSafeLocalPdf = /^assets\/documents\/[a-zA-Z0-9._-]+\.pdf$/i.test(cvValue) && !cvValue.includes('..');
  if (cvLink && (isSafeHttpsUrl(cvValue) || isSafeLocalPdf)) {
    cvLink.href = cvValue;
    cvLink.target = '_blank';
    cvLink.rel = 'noopener noreferrer';
    cvLink.hidden = false;
  }

  // Add configured demo/repository links to each project detail dialog.
  const projectLinkMap = {
    attendance: config.projects?.attendance || {},
    album: config.projects?.album || {}
  };
  document.querySelectorAll('[data-project-detail]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const links = projectLinkMap[trigger.dataset.projectDetail] || {};
      const demo = document.querySelector('#dialog-demo');
      const repository = document.querySelector('#dialog-repository');
      [[demo, links.demo], [repository, links.repository]].forEach(([element, url]) => {
        if (!element) return;
        if (isSafeHttpsUrl(url)) {
          element.href = url.trim();
          element.hidden = false;
        } else {
          element.removeAttribute('href');
          element.hidden = true;
        }
      });
    });
  });

  // Copy-to-clipboard is shown only when an email address is actually configured.
  const email = typeof config.email === 'string' ? config.email.trim() : '';
  const emailLink = document.querySelector('#contact-email');
  const copyButton = document.querySelector('#copy-email');
  const copyStatus = document.querySelector('#copy-email-status');
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (emailLink) {
      emailLink.href = `mailto:${email}`;
      emailLink.replaceChildren(document.createTextNode(email));
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      emailLink.append(arrow);
      emailLink.setAttribute('aria-label', `Kirim email ke ${email}`);
    }
    if (copyButton) copyButton.hidden = false;
    copyButton?.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(email);
        if (copyStatus) copyStatus.textContent = 'Alamat email berhasil disalin.';
      } catch {
        if (copyStatus) copyStatus.textContent = 'Penyalinan otomatis tidak tersedia di browser ini. Salin alamat email dari tautan di atas.';
      }
    });
  } else if (emailLink) {
    emailLink.href = '#contact';
    emailLink.addEventListener('click', (event) => {
      event.preventDefault();
      if (copyStatus) copyStatus.textContent = 'Tambahkan email aktif di js/config.js untuk mengaktifkan kontak.';
    });
  }

  // Keep the reading progress available to assistive technology.
  const progress = document.querySelector('.scroll-progress[role="progressbar"]');
  const progressFill = document.querySelector('#scroll-progress-bar');
  let scheduled = false;
  const updateProgress = () => {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    const value = range > 0 ? Math.round((window.scrollY / range) * 100) : 0;
    progress?.setAttribute('aria-valuenow', String(Math.min(100, Math.max(0, value))));
    if (progressFill) progressFill.style.width = `${Math.min(100, Math.max(0, value))}%`;
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateProgress);
  }, { passive: true });
  updateProgress();

  // Keep external destinations safe when opened in a new tab.
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = 'noopener noreferrer';
  });
})();
