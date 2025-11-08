# Sistem Manajemen Inventori - Full Stack (FIXED & COMPLETED)

Aplikasi web full-stack untuk manajemen inventori barang yang modern, responsif, dan mudah digunakan. Dibangun dengan React (Vite) di frontend, Node.js (Express & Prisma) di backend, dan MySQL sebagai database. Siap untuk dideploy menggunakan Docker.

## ✨ Fitur Utama

- **Login Berbasis Username.**
- **Manajemen Inventori Lengkap:** Kelola Barang, Kategori, dan Lokasi.
- **Transaksi Stok:** Catat penyesuaian stok (dijual, hilang, penerimaan).
- **Manajemen Peminjaman:** Lacak barang yang sedang dipinjam dan kapan harus kembali.
- **Manajemen Pengguna:** Sistem role (Admin, Input Data, Viewer).
- **Autentikasi Aman:** Menggunakan JSON Web Tokens (JWT).
- **Desain Responsif:** Tampilan optimal di desktop (dengan sidebar) dan mobile (dengan navigasi bawah).
- **Siap Deploy:** Konfigurasi Docker dan panduan deployment lengkap.

## ቴክ Teknologi yang Digunakan

- **Frontend:** React, Vite, TypeScript, TailwindCSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MySQL
- **ORM:** Prisma
- **Autentikasi:** JWT, bcryptjs
- **Deployment:** Docker, Docker Compose, Nginx

## 📂 Struktur Proyek (FIXED)

```
inventori-app/
├── backend/
│   ├── prisma/             # Skema & seed database
│   ├── src/                # Kode sumber backend Express
│   └── Dockerfile          # Instruksi build backend
├── frontend/
│   ├── public/             # Aset statis
│   ├── src/                # Kode sumber frontend React
│   ├── Dockerfile          # Instruksi build frontend (dengan Nginx)
│   └── nginx.conf          # Konfigurasi Nginx
├── .env.example            # Template konfigurasi
├── docker-compose.yml      # Orkestrasi semua container
└── README.md
```

---

## 🚀 Menjalankan Aplikasi (Menggunakan Docker)

Ini adalah cara yang direkomendasikan karena paling mendekati lingkungan produksi dan mengelola semua layanan (frontend, backend, database) secara otomatis.

### Prasyarat

- [Docker](https://www.docker.com/get-started) dan [Docker Compose](https://docs.docker.com/compose/install/) terinstall.

### Langkah-langkah

1.  **Clone Repository**
    ```bash
    git clone <url-repository-anda>
    cd inventori-app
    ```

2.  **Konfigurasi Environment**
    - Salin file `.env.example` menjadi `.env` di direktori **root** proyek.
      ```bash
      cp .env.example .env
      ```
    - Buka `.env` dan ganti `JWT_SECRET` dengan string acak yang kuat. Anda bisa membuatnya dengan `openssl rand -base64 32`.

3.  **Jalankan Aplikasi dengan Docker Compose**
    - Dari direktori root proyek, jalankan perintah:
      ```bash
      docker-compose up --build -d
      ```
    - Perintah ini akan membangun image Docker untuk frontend dan backend, serta menjalankan semua container. Tunggu beberapa saat hingga proses selesai.

4.  **Setup Database (Hanya saat pertama kali)**
    - Pastikan container sudah berjalan (`docker ps`).
    - Jalankan migrasi Prisma untuk membuat semua tabel di database.
      ```bash
      docker-compose exec backend npx prisma migrate deploy
      ```
    - Jalankan *seeder* untuk mengisi data awal (termasuk user `admin` dan `akbar`).
      ```bash
      docker-compose exec backend npx prisma db seed
      ```

5.  **Akses Aplikasi**
    - Aplikasi sekarang dapat diakses di browser Anda pada alamat `http://localhost`.
    - Anda bisa login dengan:
      - **Username:** `akbar`
      - **Password:** `password`

---

## ⏹️ Menghentikan Aplikasi

Untuk menghentikan semua container yang berjalan, jalankan perintah berikut dari direktori root proyek:
```bash
docker-compose down
```
