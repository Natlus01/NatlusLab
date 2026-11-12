# NatlusLab: Laboratory Inventory & Borrowing Management System

Sistem informasi pengelolaan inventaris dan transaksi peminjaman alat/perangkat laboratorium komputer secara digital berbasis web mandiri (*self-hosted*). Dirancang dengan arsitektur modern, cepat, responsif, dan siap produksi.

- **Domain Produksi:** [https://lab.natlus.my.id](https://lab.natlus.my.id)
- **Repository GitHub:** [https://github.com/Natlus01/kasir-natlus](https://github.com/Natlus01/kasir-natlus)
- **Arsitektur:** React 18, TypeScript, Tailwind CSS, Vite, Nginx Web Server di Ubuntu Server, SSL Let's Encrypt (HTTPS).

---

## 1. Akun Pengguna Bawaan (Kredensial Akses)

Sistem memiliki dua tingkat hak akses (Role-Based Access Control) terproteksi:

| Role | Username | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `admin123` | Akses penuh dashboard analitik, manajemen inventaris barang (CRUD), kelola akun Staff (tambah, ubah, aktif/nonaktif), pantau & proses seluruh sirkulasi transaksi, ekspor & impor cadangan data JSON |
| **STAFF** | `staff` | `staff123` | Akses operasional harian: monitoring stok ketersediaan unit laboratorium, pencatatan peminjaman baru, pemrosesan pengembalian barang, serta riwayat transaksi terkait |

> [!TIP]
> Pada halaman login tersedia tombol akses cepat **Demo Admin** dan **Demo Staff** untuk pengujian langsung. Untuk lingkungan produksi mandiri, Anda dapat mengubah kredensial atau menambahkan staf baru melalui menu **Manajemen Staff**.

---

## 2. Fitur Utama Sistem

### A. Autentikasi & Otorisasi
- Autentikasi sesi terproteksi dengan pemisahan peran (*Admin* dan *Staff*).
- Proteksi rute navigasi dan validasi status akun aktif (staff nonaktif dicegah masuk ke sistem).
- Fitur keluar sesi (*logout*) aman.

### B. Dashboard Analitik & Monitoring
- Metrik akumulasi: total jenis barang terdaftar, unit siap dipinjam, unit sedang dipinjam secara riil, dan total transaksi sirkulasi.
- Pemantauan status ketersediaan barang berstatus kritis/menipis secara otomatis.
- Ringkasan 5 aktivitas transaksi peminjaman dan pengembalian paling baru.

### C. Manajemen Data Inventaris (Admin)
- Penambahan dan pembaruan data barang (kode unik, nama, kategori, stok unit).
- Filter pencarian cepat berdasarkan kata kunci nama, kode barang, kategori, serta status ketersediaan.
- Proteksi penghapusan aman: barang yang unitnya sedang dalam masa peminjaman aktif dicegah untuk dihapus dari basis data.

### D. Manajemen Sirkulasi Peminjaman (Admin & Staff)
- Formulir pencatatan peminjaman terintegrasi: identitas peminjam, pilihan barang, jumlah unit yang diambil, tanggal pinjam, dan catatan operasional.
- Validasi stok cerdas: peminjaman ditolak jika permintaan melebihi jumlah unit yang tersedia di laboratorium.
- Sinkronisasi otomatis: unit stok berkurang seketika saat peminjaman divalidasi dengan status `DIPINJAM`.

### E. Pemrosesan Pengembalian Barang (Admin & Staff)
- Daftar monitoring barang yang sedang dipinjam.
- Formulir pengembalian: verifikasi tanggal kembali serta pencatatan kondisi fisik peralatan.
- Pengembalian unit stok ke laboratorium secara otomatis dengan pembaruan status transaksi menjadi `SELESAI`.

### F. Manajemen Pengguna & Hak Akses (Admin)
- Pembuatan dan pembaruan akun staf laboratorium.
- Fitur aktivasi dan nonaktivasi instan akun staf tanpa menghapus riwayat transaksi yang pernah diproses.

### G. Pencadangan & Pemulihan Basis Data
- Ekspor seluruh basis data inventaris, pengguna, dan transaksi ke berkas JSON terstruktur.
- Pemulihan (*restore*) data instan melalui fitur impor berkas JSON.
- Opsi reset ke data awal pabrik.

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

### Langkah Pengerjaan
```bash
# 1. Clone repositori ke komputer lokal
git clone https://github.com/Natlus01/kasir-natlus.git
cd kasir-natlus

# 2. Pasang seluruh dependensi proyek
npm install

# 3. Jalankan server lokal Vite (mode development)
npm run dev

# 4. Bangun berkas statis produksi untuk pengujian
npm run build
```

---

## 5. Panduan Deployment Lengkap ke Ubuntu Server + Nginx

Panduan berikut digunakan untuk menerbitkan aplikasi ke subdomain **`lab.natlus.my.id`** di server mandiri Ubuntu menggunakan Nginx dan sertifikat SSL gratis Let's Encrypt.

### Tahap 1: Konfigurasi DNS di Pengelola Domain (`natlus.my.id`)
Buka panel DNS tempat Anda membeli domain `natlus.my.id` (misalnya Cloudflare, Niagahoster, DomaiNesia, IDCloudHost, dll.), lalu tambahkan DNS Record berikut:

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

Perbarui paket sistem dan pasang Nginx, Git, Node.js LTS, dan Certbot:
```bash
# 1. Update repository & upgrade paket
sudo apt update && sudo apt upgrade -y

# 2. Pasang Nginx, Git, Curl, dan UFW
sudo apt install nginx git curl ufw -y

# 3. Pasang Node.js 20 LTS & npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# 4. Pasang Certbot & plugin Nginx untuk SSL gratis Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
```

Pastikan Node.js dan Nginx telah terpasang dengan baik:
```bash
node -v   # Menampilkan versi Node (misal v20.x)
nginx -v  # Menampilkan versi Nginx
```

---

### Tahap 3: Unduh Proyek dan Build Berkas Produksi di Server
Siapkan direktori aplikasi pada `/var/www/natluslab`:
```bash
# 1. Buat folder direktori dan atur kepemilikan user
sudo mkdir -p /var/www/natluslab
sudo chown -R $USER:$USER /var/www/natluslab

# 2. Clone repositori dari GitHub
git clone https://github.com/Natlus01/kasir-natlus.git /var/www/natluslab

# 3. Masuk ke direktori dan pasang dependensi
cd /var/www/natluslab
npm install

# 4. Bangun berkas statis produksi
npm run build
```
Setelah proses build selesai, berkas web siap saji akan berada di folder `/var/www/natluslab/dist`.

---

### Tahap 4: Konfigurasi Virtual Host Nginx
Buat berkas konfigurasi Nginx baru untuk subdomain:
```bash
sudo nano /etc/nginx/sites-available/lab.natlus.my.id
```

Salin dan tempel konfigurasi berikut:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name lab.natlus.my.id;

    root /var/www/natluslab/dist;
    index index.html;

    # Kompresi Gzip untuk kecepatan loading aset
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json;

    # Routing SPA: seluruh rute dialihkan ke index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Browser Caching untuk aset statis Vite (JS, CSS, Media, Font)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Header Keamanan
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```
Simpan perubahan (`Ctrl + O`, lalu `Enter`, kemudian keluar dengan `Ctrl + X`).

Aktifkan konfigurasi dengan membuat *symbolic link* ke `sites-enabled`:
```bash
# Buat symlink
sudo ln -s /etc/nginx/sites-available/lab.natlus.my.id /etc/nginx/sites-enabled/

# Uji apakah sintaks konfigurasi Nginx sudah benar
sudo nginx -t

# Muat ulang layanan Nginx
sudo systemctl reload nginx
```

---

### Tahap 5: Pasang Sertifikat SSL HTTPS Gratis (Certbot Let's Encrypt)
Jalankan perintah Certbot untuk memasang sertifikat keamanan SSL otomatis pada domain Anda:
```bash
sudo certbot --nginx -d lab.natlus.my.id
```

- Masukkan alamat email Anda untuk pemberitahuan pembaruan keamanan.
- Setujui syarat dan ketentuan (*Terms of Service*).
- Pilih opsi **Redirect HTTP to HTTPS** (jika ditanyakan) agar seluruh lalu lintas HTTP secara otomatis diarahkan ke HTTPS.

Uji coba mekanisme perpanjangan otomatis (*auto-renewal*):
```bash
sudo certbot renew --dry-run
```

---

### Tahap 6: Pengaturan Firewall (UFW)
Pastikan port SSH dan Web (HTTP & HTTPS) diizinkan:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

Sekarang Anda dapat membuka aplikasi secara langsung melalui peramban web di:
**[https://lab.natlus.my.id](https://lab.natlus.my.id)**

---

### Tahap 7: Alur Pembaruan Aplikasi (Jika Ada Perubahan Kode)
Jika di masa depan Anda melakukan pembaruan kode dan mendorong (*push*) perubahan ke GitHub, Anda hanya perlu menjalankan perintah berikut di terminal server:
```bash
cd /var/www/natluslab
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
```

---

## 6. Struktur Direktori Proyek

```text
kasir-natlus/
├── dist/                   # Hasil kompilasi statis produksi (yang dilayani oleh Nginx)
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
├── index.html              # HTML shell aplikasi
├── package.json            # Daftar dependensi & script proyek
├── tailwind.config.js      # Konfigurasi palet warna & tema Notus
└── vite.config.ts          # Konfigurasi bundler Vite
```

---

## 7. Lisensi & Pemeliharaan

Dikelola dan dipelihara secara mandiri oleh tim **Natlus** untuk operasional pengelolaan inventaris laboratorium komputer.
