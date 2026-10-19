# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**

Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Membuat koneksi Supabase server di `lib/supabase/server.js` dan `lib/supabase/index.js` menggunakan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY`.
- Memperbarui `app/page.jsx` untuk mengambil seluruh produk dari tabel `produk` di Supabase secara *server-side*.
- Menampilkan produk dengan komponen `KartuProduk` yang sudah ada tanpa mengubah tampilannya.
- Menampilkan penanganan error yang jelas dan teks "Belum ada produk" jika data kosong.
- Menghapus komponen `CatatanBelumAktif` dan ketergantungan pada `lib/data-contoh.js`.

**Perbaikan:**
- Menambahkan `export const dynamic = "force-dynamic"` agar katalog selalu menyajikan data terbaru langsung dari database pada setiap request.

## US-02 Detail produk

**Prompt:**

Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- Halaman `app/produk/[id]/page.jsx` mengambil satu produk dari tabel `produk` di Supabase secara *server-side* berdasarkan ID pada URL.
- Memanggil fungsi `notFound()` jika produk tidak ditemukan atau ID tidak valid.
- Menghapus `CatatanBelumAktif` dan mempertahankan komponen `TombolWhatsApp` serta tata letak halaman.

**Perbaikan:**
- Menambahkan `export const dynamic = "force-dynamic"` untuk memastikan detail produk selalu mengambil data terkini dari server.

## US-03 Pesan via WhatsApp

**Prompt:**

Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- Mengubah `components/TombolWhatsApp.jsx` menjadi tautan `<a>` dengan atribut `target="_blank"` dan `rel="noopener noreferrer"`.
- Nomor WhatsApp diambil dari `lib/toko.js` dan pesan otomatis memuat nama produk serta harga format rupiah via `formatRupiah()`.
- Teks pesan di-encode menggunakan `encodeURIComponent`.
- Tampilan dan kelas styling tombol tetap dipertahankan.
- Memastikan `CatatanBelumAktif` terkait US-03 sudah dihapus dari halaman detail produk.

**Perbaikan:**
- Membersihkan format nomor telepon dari karakter non-digit agar tautan `https://wa.me/` selalu valid.

## US-04 Login admin

**Prompt:**

Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Menambahkan fungsi `createAdminClient` di `lib/supabase/server.js` menggunakan `@supabase/ssr` dan manajemen cookie (`next/headers`).
- Membuat Server Action `masuk` dan `keluar` di `app/admin/actions.js`.
- Menghubungkan form di `app/admin/login/page.jsx` ke action `masuk` menggunakan `useActionState`.
- Menampilkan pesan error yang jelas jika login gagal dan redirect ke `/admin` jika berhasil.
- Mengaktifkan tombol "Keluar" di `components/NavAdmin.jsx` untuk mengakhiri sesi admin.
- Menghapus `CatatanBelumAktif` dari halaman login.

**Perbaikan:**
- Menangani parameter Server Action agar kompatibel baik saat dipanggil via `useActionState` maupun pemanggilan form langsung, serta menerjemahkan pesan error umum ke Bahasa Indonesia.

## US-05 Ganti password

**Prompt:**

Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Membuat Server Action `gantiPassword` di `app/admin/actions.js`.
- Menerapkan validasi di server: panjang password minimal 8 karakter, konfirmasi cocok, dan verifikasi status login admin via `supabase.auth.getUser()`.
- Menghubungkan form di `app/admin/password/page.jsx` via `useActionState`.
- Menampilkan pesan sukses atau pesan error pada halaman.
- Menghapus `CatatanBelumAktif` dari halaman ganti password.

**Perbaikan:**
- Tidak ada kendala khusus; validasi dan pembaruan password berjalan sesuai kriteria.

## US-06 Proteksi halaman admin

**Prompt:**

Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Membuat `proxy.js` di root proyek sesuai standar Next.js 16 untuk memproteksi seluruh rute di bawah `/admin` (kecuali `/admin/login`).
- Mengalihkan pengguna yang belum login ke `/admin/login`.
- Memastikan Server Action yang memodifikasi data (`gantiPassword`) memverifikasi status login admin di server.
- Menghapus `CatatanBelumAktif` dari `app/admin/page.jsx`.

**Perbaikan:**
- Menyediakan export `proxy` dan `default proxy` pada `proxy.js` untuk memastikan kompatibilitas penuh dengan router Next.js 16.

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

### US-07 List Produk [SENDIRI]

**Prompt:**

Baca AGENTS.md dan docs/user-stories.md bagian US-07.

Ubah app/admin/page.jsx supaya daftar produk diambil langsung dari tabel "produk" di Supabase secara server-side memakai koneksi admin di lib/supabase, bukan lagi dari lib/data-contoh.js. 

Tampilkan daftar produk menggunakan komponen TabelProduk yang sudah ada tanpa mengubah tampilannya, diurutkan berdasarkan id secara ascending. Jika tabel masih kosong atau gagal memuat data, tampilkan pesan yang jelas.

**Hasil:**
- Mengubah `app/admin/page.jsx` menjadi Server Component asinkron yang mengambil data produk langsung dari Supabase dengan `createAdminClient()`.
- Produk diurutkan berdasarkan `id` secara *ascending*.
- Data ditampilkan menggunakan komponen `TabelProduk` tanpa mengubah strukturnya.
- Menampilkan pesan error jika terjadi kegagalan pemanggilan data dan teks "Belum ada produk." jika tabel kosong.
- Menghapus ketergantungan pada `lib/data-contoh.js`.

**Perbaikan:**
- Menambahkan `export const dynamic = "force-dynamic"` agar daftar produk admin selalu mengambil data paling segar dari database setiap request.

