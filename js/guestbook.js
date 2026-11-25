(() => {
  const form = document.querySelector('#guestbook-form');
  const list = document.querySelector('#guestbook-list');
  const status = document.querySelector('#guestbook-status');
  if (!form || !list || !status) return;

  const config = window.PORTFOLIO_CONFIG?.guestbook || {};
  const submitButton = form.querySelector('button[type="submit"]');
  const formControls = form.querySelectorAll('input, textarea, button');

  function disableForm(message) {
    formControls.forEach((control) => { control.disabled = true; });
    status.textContent = message;
  }

  const url = typeof config.supabaseUrl === 'string' ? config.supabaseUrl.trim() : '';
  const key = typeof config.publishableKey === 'string' ? config.publishableKey.trim() : '';

  if (!url || !key) {
    disableForm('Buku tamu belum aktif. Isi URL dan Publishable Key Supabase di js/config.js.');
    return;
  }

  if (!key.startsWith('sb_publishable_')) {
    disableForm('Gunakan Publishable Key yang diawali sb_publishable_. Jangan masukkan Secret Key.');
    return;
  }

  if (!window.supabase?.createClient) {
    disableForm('Koneksi library belum siap. Muat ulang halaman untuk mencoba lagi.');
    return;
  }

  const database = window.supabase.createClient(url, key);

  async function loadComments() {
    try {
      const { data, error } = await database
        .from('guestbook_comments')
        .select('id, name, message, created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      list.replaceChildren();
      for (const comment of data || []) {
        const card = document.createElement('article');
        card.className = 'guestbook-card';

        const heading = document.createElement('div');
        heading.className = 'guestbook-card__heading';

        const name = document.createElement('strong');
        name.textContent = comment.name;

        const date = document.createElement('time');
        date.dateTime = comment.created_at;
        date.textContent = new Intl.DateTimeFormat('id-ID', {
          dateStyle: 'medium'
        }).format(new Date(comment.created_at));

        const message = document.createElement('p');
        message.textContent = comment.message;

        heading.append(name, date);
        card.append(heading, message);
        list.append(card);
      }
    } catch {
      list.textContent = 'Komentar belum bisa dimuat. Coba muat ulang halaman.';
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !message) {
      status.textContent = 'Isi nama panggilan dan komentar terlebih dahulu.';
      return;
    }

    submitButton.disabled = true;
    status.textContent = 'Mengirim komentar...';

    try {
      const { error } = await database.from('guestbook_comments').insert({
        name,
        message,
        approved: false
      });

      if (error) throw error;

      form.reset();
      status.textContent = 'Terkirim! Komentar akan muncul setelah ditinjau.';
    } catch {
      status.textContent = 'Komentar gagal dikirim. Periksa koneksi lalu coba lagi.';
    } finally {
      submitButton.disabled = false;
    }
  });

  loadComments();
})();
