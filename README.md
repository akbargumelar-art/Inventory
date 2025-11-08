# Sistem Manajemen Inventori - Full Stack

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

## 📂 Struktur Proyek

```
inventori-app/
├── backend/
│   ├── prisma/
│   ├── src/
│   └── Dockerfile         # PENTING: Instruksi build backend
├── src/                   # Kode aplikasi frontend (React)
├── .env.example           # PENTING: Template konfigurasi
├── docker-compose.yml     # Orkestrasi container (backend + db)
└── README.md
```

---

## 🚀 Menjalankan Aplikasi Secara Lokal (Menggunakan Docker)

Ini adalah cara yang direkomendasikan karena paling mendekati lingkungan produksi.

### Prasyarat

- [Docker](https://www.docker.com/get-started) dan [Docker Compose](https://docs.docker.com/compose/install/) terinstall.
- [Node.js](https://nodejs.org/) dan npm (untuk membangun frontend).

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
    - Perintah ini akan membangun dan menjalankan container untuk backend dan database.

4.  **Setup Database (Hanya saat pertama kali)**
    - Buka terminal baru, pastikan container sudah berjalan (`docker ps`).
    - Jalankan migrasi Prisma untuk membuat semua tabel.
      ```bash
      docker-compose exec backend npx prisma migrate deploy
      ```
    - Jalankan *seeder* untuk mengisi data awal (termasuk user `admin` dan `akbar`).
      ```bash
      docker-compose exec backend npx prisma db seed
      ```

5.  **Jalankan Frontend**
    - Buka terminal baru di direktori root proyek.
    - Install dependensi dan jalankan server pengembangan Vite.
      ```bash
      npm install
      npm run dev
      ```
    - Aplikasi frontend sekarang dapat diakses di `http://localhost:5173`.
    - Anda bisa login dengan `username: admin`, `password: password`.

---

## 🌐 Panduan Deploy ke VPS (Ubuntu)

Langkah-langkah ini akan memandu Anda untuk men-deploy aplikasi ini ke server produksi menggunakan Docker, Nginx sebagai *reverse proxy*, dan Certbot untuk SSL.

(Panduan deploy ke VPS tetap sama seperti sebelumnya, pastikan untuk mengikuti langkah membuat file `.env` di direktori root proyek).
