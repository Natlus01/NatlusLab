# LabFlow: Laboratory Inventory & Borrowing Management System

Aplikasi web pengelolaan inventaris dan transaksi peminjaman barang laboratorium komputer secara digital, dibangun dengan arsitektur modern, cepat, dan mudah diakses secara online.

Aplikasi ini dibuat untuk memenuhi spesifikasi **Coding Talent Challenge**.

---

## 1. Akun Pengujian Demo (Poin G)

Aplikasi memiliki dua role pengguna dengan sistem autentikasi dan otorisasi terproteksi:

| Role | Username | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `admin123` | Akses penuh dashboard seluruh aktivitas, CRUD data barang, kelola akun Staff (tambah, ubah, aktif/nonaktif), pantau seluruh transaksi & riwayat |
| **STAFF** | `staff` | `staff123` | Akses operasional: melihat ketersediaan stok, mencatat peminjaman, mencatat pengembalian, riwayat transaksi terkait. (Tidak diizinkan menghapus barang atau mengelola akun) |

Tersedia tombol pintas **Demo Admin** dan **Demo Staff** di halaman login untuk mempermudah proses pengujian oleh dosen atau penguji.

---

## 2. Fitur Utama Aplikasi

### A. Autentikasi & Otorisasi
- Halaman login dengan username dan password terenkripsi sesi.
- Proteksi route dan navigasi berdasarkan role pengguna (Admin dan Staff).
- Validasi status akun (Staff dengan status nonaktif dicegah masuk ke sistem).
- Logout aman yang menghapus sesi saat ini.

### B. Dashboard Aktivitas
- Total variasi barang dan unit terdaftar.
- Jumlah barang yang tersedia dan siap dipinjam.
- Jumlah barang yang sedang dipinjam secara riil.
- Total akumulasi transaksi peminjaman.
- Ringkasan aktivitas transaksi terbaru dan status ketersediaan barang kritis.

### C. Manajemen Barang (Khusus Admin)
- Tambah barang inventaris baru.
- Ubah informasi nama, kategori, kode, dan jumlah stok.
- Hapus data barang (dilengkapi proteksi keamanan: barang yang sedang dipinjam tidak dapat dihapus).
- Pencarian dan filter berdasarkan kode, nama, kategori, dan status stok.

### D. Manajemen Peminjaman (Admin & Staff)
- Formulir pencatatan peminjaman: nama peminjam, pilihan barang, jumlah unit, tanggal pinjam, dan catatan.
- Validasi stok otomatis (peminjaman dicegah jika melebihi stok yang tersedia).
- Pengurangan stok barang di laboratorium secara otomatis saat transaksi disimpan.
- Status transaksi otomatis tercatat sebagai `DIPINJAM`.

### E. Pengembalian Barang (Admin & Staff)
- Pemantauan daftar transaksi yang sedang dipinjam.
- Formulir pemrosesan pengembalian: tanggal pengembalian dan catatan kondisi fisik barang.
- Penambahan kembali stok barang ke laboratorium secara otomatis.
- Pembaruan status transaksi menjadi `SELESAI`.

### F. Manajemen Pengguna (Khusus Admin)
- Tambah akun Staff baru.
- Ubah kredensial nama dan password staff.
- Aktifkan atau nonaktifkan akun Staff.

### G. Pencadangan & Pemulihan Data
- Ekspor seluruh basis data inventaris laboratorium ke format JSON.
- Impor data pemulihan dari berkas JSON.
- Reset ke data awal bawaan soal (pabrik).

---

## 3. Data Awal Barang (Wajib Minimal 5)

| Kode Barang | Nama Barang | Kategori | Stok Awal |
| :--- | :--- | :--- | :---: |
| **BR001** | Laptop Lenovo | Laptop & Komputer | 5 unit |
| **BR002** | Mouse Logitech | Aksesori & Periferal | 10 unit |
| **BR003** | Keyboard Mechanical | Aksesori & Periferal | 8 unit |
| **BR004** | Proyektor Epson | Audio Visual & Presentasi | 3 unit |
| **BR005** | Monitor LG | Display & Monitor | 6 unit |
| **BR006** | Router MikroTik RB750Gr3 | Perangkat Jaringan | 4 unit |
| **BR007** | Switch Cisco Catalyst 2960 | Perangkat Jaringan | 2 unit |
| **BR008** | Crimping Tool & LAN Tester | Peralatan & Perkakas Lab | 5 unit |
| **BR009** | Webcam Logitech C920 Pro | Audio Visual & Presentasi | 6 unit |
| **BR010** | Toolkit Obeng Presisi | Peralatan & Perkakas Lab | 7 unit |

---

## 4. Teknologi yang Digunakan

- **Frontend Framework:** React 18 (TypeScript)
- **Styling & UI:** Tailwind CSS (Desain utilitarian presisi, dukungan Dark/Light mode penuh, standar kontras WCAG AA)
- **Icons:** Lucide Icons (ikon fungsional proporsional)
- **Build Tool:** Vite
- **Penyimpanan Data:** Reactive Browser Storage Engine (data tetap tersimpan saat tab/browser ditutup) dilengkapi fitur Cadangan/Impor JSON
- **Platform Hosting:** Siap deploy langsung ke Vercel atau Netlify

---

## 5. Panduan Menjalankan di Komputer Lokal

```bash
# 1. Masuk ke direktori proyek
cd D:/kasir

# 2. Instal dependensi (jika belum)
npm install

# 3. Jalankan server pengembangan
npm run dev

# 4. Bangun berkas produksi
npm run build
```

---

## 6. Panduan Hosting Manual ke GitHub & Vercel (Poin E & G)

### Langkah A: Unggah ke Repositori GitHub
```bash
git add .
git commit -m "feat: implement laboratory inventory and borrowing management system"
git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git
git push -u origin main
```

### Langkah B: Hubungkan dan Publikasikan ke Vercel
1. Buka [https://vercel.com](https://vercel.com) dan masuk dengan akun GitHub Anda.
2. Klik **Add New Project**, lalu pilih repositori yang baru saja Anda buat.
3. Vercel akan otomatis mendeteksi proyek **Vite**.
4. Klik tombol **Deploy**.
5. Dalam kurun waktu kurang dari 1 menit, Vercel akan memberikan URL publik aktif (contoh: `https://labflow-inventory.vercel.app`) yang dapat dibuka oleh dosen.

---

## 7. Format Pengumpulan Tugas

```text
==============================
LEMBAR PENGUMPULAN TUGAS
CODING TALENT CHALLENGE
==============================
1. Nama Lengkap           : [Nama Lengkap Mahasiswa]
2. NIM                    : [NIM Mahasiswa]
3. URL Aplikasi Hosting   : [URL Publik Vercel/Netlify Anda]
4. URL Repository GitHub  : [URL Repositori GitHub Anda]
5. Akun Demo Admin        :
   - Username             : admin
   - Password             : admin123
6. Akun Demo Staff        :
   - Username             : staff
   - Password             : staff123
7. Teknologi Digunakan    : React (TypeScript), Tailwind CSS, Vite
==============================
```
