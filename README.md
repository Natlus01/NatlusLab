# NatlusLab: Laboratory Inventory & Borrowing Management System

Sistem informasi pengelolaan inventaris dan transaksi peminjaman alat/perangkat laboratorium komputer secara digital berbasis web mandiri (*self-hosted*). Dirancang dengan arsitektur modern, cepat, responsif, dan siap produksi.

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **Backend API:** Node.js, Express.js 5, TypeScript (TSX Runtime)
- **Database:** PostgreSQL 16 (Relational Database Management System di Docker)
- **Visual Analytics:** Recharts (Diagram Batang & Lingkaran Interaktif)
- **Identifikasi Cepat:** QR Code Generator (`qrcode.react`) & Kamera Scanner Real-time (`html5-qrcode`)
- **Dokumen Resmi:** jsPDF & autoTable (Cetak Berita Acara Peminjaman & Rekapitulasi PDF)
- **Spreadsheet:** SheetJS / xlsx (Ekspor Data Inventaris & Transaksi ke Excel)
- **Infrastruktur & Tunnel:** Ubuntu Server, PM2 Process Manager, Cloudflare Tunnel (SSL HTTPS)

---

## 1. Akun Pengguna Bawaan (Kredensial Akses)

Sistem memiliki dua tingkat hak akses (Role-Based Access Control) terproteksi:

| Role | Username | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `admin123` | Akses penuh dashboard analitik, manajemen inventaris barang (CRUD), kelola akun Staff (tambah, ubah, aktif/nonaktif), pantau & proses seluruh sirkulasi transaksi, ekspor & impor cadangan data JSON |
| **STAFF** | `staff` | `staff123` | Akses operasional harian: monitoring stok ketersediaan unit laboratorium, pencatatan peminjaman baru, pemrosesan pengembalian barang, serta riwayat transaksi terkait |

> [!IMPORTANT]
> **Kebijakan Keamanan Kredensial Repositori Publik:**
> Demi mematuhi prinsip keamanan standar (*Security Best Practices & OWASP*), kata sandi akun administratif pada server hosting publik **tidak dipublikasikan secara terbuka pada repositori GitHub ini**. 
> - Kredensial akun pengujian untuk Dosen/Penilai dicantumkan secara khusus pada form pengumpulan tugas resmi.
> - Untuk lingkungan pengembangan lokal (*Local Development*), pengembang dapat mengatur kata sandi secara bebas melalui berkas konfigurasi `.env`.

> [!NOTE]
> **Keamanan Sesi Terproteksi:**
> - Sesi login otomatis berakhir saat tab browser ditutup (*session isolation*).
> - Auto logout otomatis aktif jika tidak ada aktivitas pengguna selama 15 menit (*idle timeout*).

---

## 2. Fitur Utama Sistem

### A. Autentikasi & Otorisasi
- Autentikasi sesi terproteksi dengan pemisahan peran (*Admin* dan *Staff*).
- Proteksi rute navigasi dan validasi status akun aktif (staff nonaktif dicegah masuk ke sistem).
- Fitur keluar sesi (*logout*) aman.

### B. Dashboard Analitik & Monitoring
- Metrik akumulasi: total jenis barang terdaftar, unit siap dipinjam, unit sedang dipinjam secara riil, dan total transaksi sirkulasi.
- **Visualisasi Grafik Interaktif (Recharts):**
  - *Bar Chart*: Perbandingan ketersediaan stok lab vs sedang dipinjam per kategori perangkat.
  - *Pie Chart*: Proporsi rasio total unit aset laboratorium.
- Pemantauan status ketersediaan barang berstatus kritis/menipis secara otomatis.
- Ringkasan aktivitas transaksi peminjaman dan pengembalian paling baru.
- **Indikator Live-Sync:** Pembaruan data otomatis (*auto-refresh*) secara *real-time* lintas tab.

### C. Manajemen Data Inventaris (Admin)
- Penambahan dan pembaruan data barang (kode unik, nama, kategori, stok unit).
- **Stiker QR Code Inventaris:** Pembuatan stiker QR Code unik per barang yang dapat diunduh (SVG) dan dicetak fisik untuk ditempelkan pada perangkat.
- **Ekspor Dokumen & Laporan:**
  - Unduh rekapitulasi inventaris ke format spreadsheet **Excel (`.xlsx`)**.
  - Cetak **Laporan Rekapitulasi Inventaris (PDF)** resmi siap arsip.
- Filter pencarian cepat berdasarkan kata kunci nama, kode barang, kategori, serta status ketersediaan.
- Proteksi penghapusan aman: barang yang unitnya sedang dalam masa peminjaman aktif dicegah untuk dihapus dari basis data.

### D. Manajemen Sirkulasi Peminjaman (Admin & Staff)
- **Halaman Khusus Formulir Peminjaman:** Antarmuka formulir terpadu yang siap diisi langsung tanpa perlu membuka modal tersembunyi.
- **Pemindai Kamera QR Code (Scanner Real-time):** Petugas dapat memindai stiker QR pada fisik alat secara instan menggunakan kamera laptop/ponsel.
- **Katalog Cepat Unit Tersedia:** Panel samping menampilkan daftar barang yang memiliki stok siap pinjam (cukup klik nama barang untuk langsung memilihnya).
- Validasi stok cerdas: peminjaman ditolak jika permintaan melebihi jumlah unit yang tersedia di laboratorium.
- **Cetak Bukti Peminjaman (PDF):** Cetak otomatis Berita Acara Peminjaman lengkap dengan kop resmi lab, nomor transaksi, dan kolom tanda tangan.

### E. Pemrosesan Pengembalian Barang (Admin & Staff)
- **Halaman Khusus Monitoring Pengembalian:** Hanya menampilkan barang yang masih berstatus `DIPINJAM` untuk memudahkan pengawasan petugas.
- Kartu indikator KPI memantau jumlah transaksi aktif dan total fisik unit yang masih berada di luar lab.
- Formulir pengembalian: verifikasi tanggal kembali serta pencatatan kondisi fisik peralatan.
- Pengembalian unit stok ke laboratorium secara otomatis dengan pembaruan status transaksi menjadi `SELESAI`.

### F. Riwayat Transaksi & Logbook Sirkulasi
- Rekapitulasi komprehensif seluruh aktivitas peminjaman dan pengembalian.
- Filter status transaksi: `Semua`, `Sedang Dipinjam`, dan `Selesai`.
- Ekspor seluruh histori sirkulasi ke berkas **Excel (`.xlsx`)** dan cetak ulang bukti peminjaman PDF.

### G. Manajemen Pengguna & Hak Akses (Admin)
- Pembuatan dan pembaruan akun staf laboratorium.
- Fitur aktivasi dan nonaktivasi instan akun staf tanpa menghapus riwayat transaksi yang pernah diproses.

### G. Pencadangan & Pemulihan Basis Data
- Berkas skema terstruktur di folder `database/schema.sql` untuk inisialisasi basis data PostgreSQL.
- Ekspor & impor data cadangan berformat JSON langsung dari antarmuka sistem.
- Prosedur pencadangan SQL berkala melalui `pg_dump`.

---

## 3. Data Awal Inventaris Laboratorium

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

## 4. Menjalankan di Komputer Lokal (Pengembangan)

### Prasyarat
- **Node.js:** Versi 18 LTS atau 20 LTS
- **Package Manager:** npm (bawaan Node.js)
- **Git:** Terpasang di komputer Anda

### Langkah Pengerjaan
```bash
# 1. Clone repositori ke komputer lokal
git clone https://github.com/Natlus01/NatlusLab.git
cd NatlusLab

# 2. Pasang seluruh dependensi proyek
npm install

# 3. Jalankan server lokal Vite (mode development)
npm run dev

# 4. Bangun berkas statis produksi untuk pengujian
npm run build
```

---

## 5. Panduan Lengkap Deployment: Ubuntu Server + Nginx + PostgreSQL

Panduan berikut digunakan untuk menerbitkan aplikasi ke subdomain **`lab.natlus.my.id`** di server mandiri Ubuntu menggunakan Nginx, database PostgreSQL, dan sertifikat SSL gratis Let's Encrypt.

### Tahap 1: Konfigurasi DNS di Pengelola Domain (`natlus.my.id`)
Buka panel DNS pengelola domain Anda (misal Cloudflare, Niagahoster, DomaiNesia, IDCloudHost, dll.), lalu buat DNS Record berikut:

| Type | Name / Host | Target / Value | TTL | Keterangan |
| :---: | :---: | :---: | :---: | :--- |
| **A** | `lab` | `IP_PUBLIC_UBUNTU_ANDA` | Auto / 300 | Mengarahkan `lab.natlus.my.id` ke server VPS Anda |

> [!NOTE]
> Jika Anda menggunakan Cloudflare, pastikan pada tahap awal status proxy diatur ke **DNS Only** (ikon awan abu-abu) agar proses penerbitan sertifikat SSL Certbot di server dapat memvalidasi domain dengan lancar.

---

### Tahap 2: Persiapan dan Instalasi Paket di Ubuntu Server
Hubungi server VPS Anda melalui terminal SSH:
```bash
ssh user@IP_PUBLIC_UBUNTU_ANDA
```

Perbarui paket sistem dan pasang Nginx, Git, Node.js 20 LTS, Certbot, serta PostgreSQL:
```bash
# 1. Update repository & upgrade paket sistem
sudo apt update && sudo apt upgrade -y

# 2. Pasang Nginx, Git, Curl, dan UFW Firewall
sudo apt install nginx git curl ufw -y

# 3. Pasang Node.js 20 LTS & npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# 4. Pasang Certbot & plugin Nginx untuk SSL gratis Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y

# 5. Pasang Database PostgreSQL & modul pendukung
sudo apt install postgresql postgresql-contrib -y
```

Pastikan layanan PostgreSQL dan Nginx berjalan aktif:
```bash
sudo systemctl status postgresql --no-pager
sudo systemctl status nginx --no-pager
```

---

### Tahap 3: Unduh Proyek via Git Clone ke Server
Siapkan direktori aplikasi pada `/var/www/natluslab`:
```bash
# 1. Buat folder direktori dan atur kepemilikan user
sudo mkdir -p /var/www/natluslab
sudo chown -R $USER:$USER /var/www/natluslab

# 2. Clone repositori resmi dari GitHub
git clone https://github.com/Natlus01/NatlusLab.git /var/www/natluslab

# 3. Masuk ke direktori proyek
cd /var/www/natluslab
```

---

### Tahap 4: Inisialisasi & Konfigurasi Database PostgreSQL

#### A. Buat Database dan User Khusus
Masuk ke prompt PostgreSQL:
```bash
sudo -u postgres psql
```

Jalankan perintah SQL berikut:
```sql
-- 1. Buat database baru
CREATE DATABASE natluslab_db;

-- 2. Buat user khusus (ganti 'password_rahasia_anda' dengan kata sandi yang kuat)
CREATE USER natluslab_user WITH ENCRYPTED PASSWORD 'password_rahasia_anda';

-- 3. Berikan hak akses penuh ke user
GRANT ALL PRIVILEGES ON DATABASE natluslab_db TO natluslab_user;

-- 4. Pindah ke database dan atur skema publik
\c natluslab_db
GRANT ALL ON SCHEMA public TO natluslab_user;

-- Keluar dari prompt
\q
```

#### B. Eksekusi Skema Tabel & Data Awal Otomatis
Eksekusi berkas `database/schema.sql` yang sudah tersedia di repositori:
```bash
# Impor seluruh tabel (users, items, transactions) dan seed data
psql -U natluslab_user -d natluslab_db -h localhost -f /var/www/natluslab/database/schema.sql
```
*(Masukkan kata sandi `natluslab_user` saat diminta).*

#### C. Verifikasi Tabel Basis Data
Periksa apakah seluruh tabel telah terbuat dengan benar:
```bash
psql -U natluslab_user -d natluslab_db -h localhost -c "\dt"
```
Periksa data awal barang:
```bash
psql -U natluslab_user -d natluslab_db -h localhost -c "SELECT code, name, category, stock FROM items LIMIT 5;"
```

---

### Tahap 5: Bangun Berkas Produksi Aplikasi (Build)
Di dalam direktori `/var/www/natluslab`, jalankan instalasi dependensi dan kompilasi:
```bash
cd /var/www/natluslab
npm install
npm run build
```
Hasil kompilasi siap saji akan berada di folder `/var/www/natluslab/dist`.

Atur izin akses direktori agar Nginx dapat membaca berkas web:
```bash
sudo chown -R www-data:www-data /var/www/natluslab/dist
sudo chmod -R 755 /var/www/natluslab/dist
```

---

### Tahap 6: Konfigurasi Virtual Host Nginx
Buat berkas konfigurasi Nginx baru untuk subdomain:
```bash
sudo nano /etc/nginx/sites-available/lab.natlus.my.id
```

Salin dan tempel blok konfigurasi berikut:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name lab.natlus.my.id;

    root /var/www/natluslab/dist;
    index index.html;

    # Kompresi Gzip untuk performa kecepatan loading
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json;

    # Routing Single Page Application (SPA): rute dialihkan ke index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Browser Caching untuk berkas aset statis (JS, CSS, Gambar, Font)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Header Pengamanan
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```
Simpan perubahan (`Ctrl + O`, lalu `Enter`, kemudian keluar dengan `Ctrl + X`).

Aktifkan konfigurasi Nginx:
```bash
# Buat tautan simbolis (symlink)
sudo ln -s /etc/nginx/sites-available/lab.natlus.my.id /etc/nginx/sites-enabled/

# Uji sintaks konfigurasi
sudo nginx -t

# Muat ulang Nginx
sudo systemctl reload nginx
```

---

### Tahap 7: Pasang Sertifikat SSL HTTPS Gratis (Certbot Let's Encrypt)
Jalankan Certbot untuk mengamankan domain dengan enkripsi SSL otomatis:
```bash
sudo certbot --nginx -d lab.natlus.my.id
```

- Masukkan alamat email aktif Anda untuk peringatan pembaruan keamanan.
- Ketik `Y` untuk menyetujui *Terms of Service*.
- Pilih opsi **Redirect HTTP to HTTPS** agar semua koneksi otomatis dialihkan ke HTTPS.

Uji coba mekanisme perpanjangan otomatis (*auto-renewal*):
```bash
sudo certbot renew --dry-run
```

---

### Tahap 8: Pengaturan Keamanan Firewall (UFW)
Aktifkan firewall Ubuntu untuk membuka hanya port SSH dan Web:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

### Tahap 9: Pemeliharaan & Backup Otomatis Database

#### 1. Alur Pembaruan Kode Aplikasi (Update Routine)
Jika ada perubahan kode di GitHub yang ingin diterapkan ke server:
```bash
cd /var/www/natluslab
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
```

#### 2. Pencadangan Rutin Basis Data PostgreSQL
Buat direktori penyimpanan cadangan:
```bash
sudo mkdir -p /var/backups/natluslab
sudo chown -R $USER:$USER /var/backups/natluslab
```

Ekspor database ke berkas SQL:
```bash
pg_dump -U natluslab_user -d natluslab_db -h localhost > /var/backups/natluslab/backup_$(date +%F_%H%M%S).sql
```

Pulihkan (*restore*) database dari berkas cadangan jika diperlukan:
```bash
psql -U natluslab_user -d natluslab_db -h localhost < /var/backups/natluslab/nama_file_backup.sql
```

#### 3. Otomatisasi Backup Harian (Cron Job)
Buka crontab:
```bash
crontab -e
```
Tambahkan baris berikut di bagian paling bawah untuk melakukan backup otomatis setiap jam 02:00 pagi:
```text
0 2 * * * pg_dump -U natluslab_user -d natluslab_db -h localhost > /var/backups/natluslab/backup_$(date +\%F).sql 2>> /var/backups/natluslab/backup.log
```

---

## 6. Panduan Pemecahan Masalah (Troubleshooting)

| Gejala Masalah | Penyebab Umum | Solusi Praktis |
| :--- | :--- | :--- |
| **Error 403 Forbidden** saat membuka web | Izin berkas (*permissions*) pada folder `/dist` belum dapat dibaca oleh user web server | Jalankan `sudo chown -R www-data:www-data /var/www/natluslab/dist` dan `sudo chmod -R 755 /var/www/natluslab/dist` |
| **Error 404 Not Found** saat refresh halaman selain root | Konfigurasi SPA router belum aktif di Nginx | Pastikan baris `try_files $uri $uri/ /index.html;` ada di dalam blok `location /` berkas `/etc/nginx/sites-available/lab.natlus.my.id` |
| **Password authentication failed for user "natluslab_user"** | Metode autentikasi PostgreSQL lokal diatur ke `peer` | Buka `/etc/postgresql/*/main/pg_hba.conf`, ubah baris `local all all peer` atau `127.0.0.1/32` menjadi metode `scram-sha-256` atau `md5`, lalu jalankan `sudo systemctl restart postgresql` |
| **Certbot SSL Gagal Memverifikasi Domain** | DNS belum terpropagasi atau terhalang Cloudflare Proxy | Pastikan status proxy di Cloudflare adalah **DNS Only** (awan abu-abu) sebelum menjalankan `certbot`, dan pastikan Record A sudah mengarah ke IP VPS yang benar |

---

## 7. Struktur Direktori Proyek

```text
NatlusLab/
├── database/
│   └── schema.sql          # Skema DDL tabel PostgreSQL & seed data bawaan
├── dist/                   # Berkas kompilasi statis produksi (dilayani oleh Nginx)
├── src/
│   ├── components/         # Komponen UI modular
│   │   ├── auth/           # Halaman Login & otentikasi role
│   │   ├── common/         # Komponen dasar (Button, Modal, Input, Badge, SearchBar)
│   │   ├── dashboard/      # Ringkasan analitik, metrik, aktivitas terbaru
│   │   ├── items/          # Manajemen inventaris & modal CRUD barang
│   │   ├── layout/         # Notus Sidebar, Navbar, dan wrapper Layout
│   │   ├── settings/       # Fitur pencadangan data JSON & reset pabrik
│   │   ├── transactions/   # Sirkulasi peminjaman & pengembalian peralatan
│   │   └── users/          # Manajemen akun staf laboratorium
│   ├── context/            # Global AuthContext & ThemeContext
│   ├── data/               # Data awal barang inventaris & pengguna bawaan
│   ├── services/           # Storage Engine reaktif dengan persistensi lokal
│   ├── types/              # Definisi interface TypeScript
│   ├── App.tsx             # Root router & penanganan state utama
│   ├── index.css           # Styling Tailwind CSS
│   └── main.tsx            # Entry point aplikasi React
├── .gitignore              # Daftar berkas terabaikan dari Git
├── index.html              # Shell HTML aplikasi
├── package.json            # Daftar dependensi & script proyek
├── tailwind.config.js      # Konfigurasi palet warna & tema Notus
└── vite.config.ts          # Konfigurasi bundler Vite
```

---

## 8. Lisensi & Pemeliharaan

Dikelola dan dipelihara secara mandiri oleh tim **Natlus** untuk operasional pengelolaan inventaris laboratorium komputer.
