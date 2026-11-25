# Fikri Portfolio — Stage 6

Portofolio sak onoke wes satset watwet

## Pengaturan utama — `js/config.js`

Isi nilai berikut dengan data yang benar-benar milikmu. Kosongkan bagian yang belum siap; tombol atau tautan terkait akan tetap disembunyikan/nonaktif.

```js
window.PORTFOLIO_CONFIG = {
  email: "email-aktif-kamu@example.com",
  github: "https://github.com/username-kamu",
  linkedin: "https://www.linkedin.com/in/username-kamu/",
  instagram: "https://www.instagram.com/username-kamu/",
  cvUrl: "assets/documents/CV-Fikri.pdf",
  projects: {
    attendance: {
      demo: "https://alamat-demo-presensi-kamu",
      repository: "https://github.com/username-kamu/repository-presensi"
    },
    album: {
      demo: "https://alamat-demo-album-kamu",
      repository: "https://github.com/username-kamu/repository-album"
    }
  }
};
```

`cvUrl` menerima URL HTTPS atau path PDF lokal yang aman di dalam `assets/documents/`. Tautan demo dan repository hanya diaktifkan bila URL menggunakan HTTPS.

## Struktur proyek

- `index.html` — seluruh section dan dialog.
- `css/style.css` — desain inti.
- `css/responsive.css` — layout tablet dan mobile.
- `css/animations.css` — animasi dasar.
- `css/stage4.css` — penyempurnaan visual dan galeri.
- `css/stage5.css` — tipografi, aksesibilitas, dan kontrol publikasi.
- `css/stage6.css` — ilustrasi interaktif dan tampilan carousel portofolio.
- `js/config.js` — email, sosial, CV, dan tautan proyek.
- `js/navigation.js` — navigasi aktif.
- `js/animations.js` — reveal saat scroll.
- `js/main.js` — kategori, detail proyek, form kontak, dan progres halaman.
- `js/stage4.js` — galeri lightbox dan tautan sosial.
- `js/stage5.js` — tautan CV/proyek, salin email, dan aksesibilitas progres.
- `js/stage6.js` — toggle ilustrasi About dan kontrol carousel proyek.
- `assets/images/` — hero, favicon, dan ilustrasi galeri.
- `assets/images/certificates/` dan `assets/images/awards/` — simpan gambar bukti lokal di folder sesuai kategorinya, idealnya dalam format WebP.


