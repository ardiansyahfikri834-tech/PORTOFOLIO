(() => {
  'use strict';

  const config = window.PORTFOLIO_CONFIG || {};
  const isSafeHttpsUrl = (value) => {
    if (typeof value !== 'string' || !value.trim()) return false;
    try { return new URL(value.trim()).protocol === 'https:'; } catch { return false; }
  };

  // Keep the CV action visible. When no file is configured, explain how to enable it.
  const cvLink = document.querySelector('#cv-download');
  const cvStatus = document.querySelector('#cv-status');
  const cvValue = typeof config.cvUrl === 'string' ? config.cvUrl.trim() : '';
  const isSafeLocalPdf = /^assets\/documents\/[a-zA-Z0-9._-]+\.pdf$/i.test(cvValue) && !cvValue.includes('..');
  if (cvLink && (isSafeHttpsUrl(cvValue) || isSafeLocalPdf)) {
    cvLink.href = cvValue;
    cvLink.target = '_blank';
    cvLink.rel = 'noopener noreferrer';
  } else if (cvLink) {
    cvLink.href = '#about';
    cvLink.addEventListener('click', (event) => {
      event.preventDefault();
      if (cvStatus) cvStatus.textContent = 'CV belum ditambahkan. Masukkan link PDF atau path PDF milikmu pada cvUrl di js/config.js.';
    });
  }

  // Keep the copy button visible; a click gives useful feedback even before setup.
  const email = typeof config.email === 'string' ? config.email.trim() : '';
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailLink = document.querySelector('#contact-email');
  const copyButton = document.querySelector('#copy-email');
  const copyStatus = document.querySelector('#copy-email-status');
  if (isValidEmail) {
    if (emailLink) {
      emailLink.href = `mailto:${email}`;
      emailLink.replaceChildren(document.createTextNode(email));
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      emailLink.append(arrow);
      emailLink.setAttribute('aria-label', `Kirim email ke ${email}`);
    }
  } else if (emailLink) {
    emailLink.href = '#contact';
    emailLink.addEventListener('click', (event) => {
      event.preventDefault();
      if (copyStatus) copyStatus.textContent = 'Email belum diatur. Isi alamat email aktif di js/config.js.';
    });
  }

  if (copyButton) {
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      if (!isValidEmail) {
        if (copyStatus) copyStatus.textContent = 'Belum ada email untuk disalin. Isi email aktif di js/config.js terlebih dahulu.';
        return;
      }
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(email);
        if (copyStatus) copyStatus.textContent = 'Alamat email berhasil disalin.';
      } catch {
        if (copyStatus) copyStatus.textContent = `Penyalinan otomatis tidak tersedia. Email: ${email}`;
      }
    });
  }

  // Keep all external destinations safe when opened in a new tab.
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = 'noopener noreferrer';
  });
})();
