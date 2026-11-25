# Fikri Portfolio — Stage 5.1 (Interaction Fixes)

Portofolio personal responsif dengan visual dark–electric, tipografi Unbounded + Outfit + IBM Plex Mono, animasi halus, galeri ilustratif, detail proyek, dan kontrol personalisasi sebelum publikasi.

## Menjalankan secara lokal

1. Ekstrak ZIP ke folder kerja.
2. Buka folder di VS Code.
3. Jalankan `index.html` menggunakan Live Server.

## Pengaturan utama — `js/config.js`

Isi nilai berikut dengan data yang benar-benar milikmu. Kosongkan bagian yang belum siap; tombol terkait tetap bisa ditekan dan akan memberi tahu data apa yang perlu dilengkapi. Tautan eksternal baru dibuka setelah URL valid diisi.

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

## Personalisasi konten sebelum publikasi

1. **Foto profil:** ganti `.portrait-placeholder` di `index.html` dengan foto milikmu. Gunakan gambar yang kamu izinkan untuk dipublikasikan.
2. **Galeri:** empat file `gallery-*.svg` adalah ilustrasi placeholder, bukan foto kegiatan asli. Ganti dengan foto milikmu dan sesuaikan sumber gambar serta deskripsi `galleryContent` pada `js/stage4.js`.
3. **Pendidikan:** ganti bagian `My Learning Foundation` dengan nama sekolah dan periode yang benar.
4. **Organisasi:** verifikasi nama kegiatan, jabatan, tahun, dan deskripsi sebelum dipublikasikan.
5. **Proyek:** periksa deskripsi, fitur, peran, dan teknologi pada `js/main.js`. Jangan mencantumkan fitur atau teknologi yang tidak benar-benar digunakan.
6. **Sertifikat dan penghargaan:** tambahkan bukti dan informasi asli pada kartu kategori terkait; saat ini keduanya masih berupa placeholder.
7. **Kontak:** isi email aktif dan tautan sosial pada `js/config.js`. Formulir menyiapkan draft melalui aplikasi email (`mailto`), bukan backend pengiriman pesan.

## Fitur Stage 5

- Kartu proyek dapat dibuka dengan klik pada seluruh kartu atau keyboard (Enter/Space).
- Tab kategori dan folder ringkasan dapat digunakan untuk berpindah kategori proyek.
- Tombol CV dan Copy Email tetap memberi petunjuk ketika konfigurasi belum diisi.
- Tautan sosial yang belum dikonfigurasi menjelaskan langkah yang diperlukan, bukan menjadi tombol mati.
- Detail proyek menampilkan status Demo/Repository yang belum tersedia; tautan aktif setelah URL HTTPS dimasukkan.
- Formulir kontak menjelaskan bahwa pengiriman menggunakan aplikasi email (`mailto`), bukan backend.
- Fokus keyboard, progres membaca, tampilan mobile, dan preferensi `reduced-motion` diperhatikan.

## Struktur proyek

- `index.html` — seluruh section dan dialog.
- `css/style.css` — desain inti.
- `css/responsive.css` — layout tablet dan mobile.
- `css/animations.css` — animasi dasar.
- `css/stage4.css` — penyempurnaan visual dan galeri.
- `css/stage5.css` — tipografi, aksesibilitas, dan kontrol publikasi.
- `js/config.js` — email, sosial, CV, dan tautan proyek.
- `js/navigation.js` — navigasi aktif.
- `js/animations.js` — reveal saat scroll.
- `js/main.js` — kategori, detail proyek, form kontak, dan progres halaman.
- `js/stage4.js` — galeri lightbox dan tautan sosial.
- `js/stage5.js` — tautan CV, salin email, dan petunjuk konfigurasi.
- `assets/images/` — hero, favicon, dan ilustrasi galeri.

## Catatan publikasi

Website ini masih berupa template portofolio yang perlu diisi dengan foto, detail pendidikan, alamat email, tautan akun, dan data proyek milikmu sendiri. Uji kembali seluruh tautan setelah hosting sebelum membagikan website.
