# Sistem Manajemen Inventori - Full Stack

Aplikasi web full-stack untuk manajemen inventori barang yang modern, responsif, dan mudah digunakan. Dibangun dengan React (Vite) di frontend, Node.js (Express & Prisma) di backend, dan MySQL sebagai database. Siap untuk dideploy menggunakan Docker.

## ✨ Fitur Utama

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
- **Autentikasi:** JWT, bcrypt.js
- **Deployment:** Docker, Docker Compose

## 📂 Struktur Proyek

```
inventori-app/
├── backend/               # Kode aplikasi backend (Node.js/Express)
│   ├── prisma/
│   │   ├── schema.prisma  # Skema database Prisma
│   │   └── migrations/    # File migrasi database
│   ├── src/
│   │   ├── api/           # Router Express untuk setiap resource
│   │   ├── controllers/   # Logika untuk menangani request
│   │   ├── middleware/    # Middleware (e.g., auth)
│   │   └── server.ts      # Entry point server
│   ├── Dockerfile         # Instruksi build image Docker backend
│   └── package.json
├── db/
│   └── schema.sql         # Skema SQL manual untuk setup database
├── public/                # Aset statis frontend
├── src/                   # Kode aplikasi frontend (React)
├── docker-compose.yml     # Orkestrasi container (backend + db)
├── index.html
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

2.  **Konfigurasi Backend**
    - Salin file environment example di direktori `backend`.
      ```bash
      cp backend/.env.example backend/.env
      ```
    - Buka `backend/.env` dan sesuaikan nilainya jika perlu. Nilai default sudah dikonfigurasi untuk `docker-compose.yml`.
      ```env
      DATABASE_URL="mysql://user:password@db:3306/inventory_db"
      JWT_SECRET="your-super-secret-key"
      PORT=6001
      ```

3.  **Jalankan Aplikasi dengan Docker Compose**
    - Dari direktori root proyek, jalankan perintah:
      ```bash
      docker-compose up --build
      ```
    - Perintah ini akan:
        - Membangun *image* Docker untuk aplikasi backend.
        - Menjalankan container untuk **backend** (di port 6001) dan **database MySQL** (di port 3306).
        - Membuat database `inventory_db` secara otomatis.

4.  **Setup Database (Hanya saat pertama kali)**
    - Buka terminal baru.
    - Jalankan migrasi Prisma untuk membuat semua tabel di database.
      ```bash
      docker-compose exec backend npx prisma migrate dev --name init
      ```
    - (Opsional) Jalankan *seeder* untuk mengisi data awal.
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
    - Aplikasi frontend sekarang dapat diakses di `http://localhost:5173` (atau port lain yang ditampilkan).
    - Aplikasi backend dapat diakses di `http://localhost:6001`.

---

## 🌐 Panduan Deploy ke VPS (Ubuntu)

Langkah-langkah ini akan memandu Anda untuk men-deploy aplikasi ini ke server produksi menggunakan Docker, Nginx sebagai *reverse proxy*, dan Certbot untuk SSL.

### Prasyarat

- Sebuah VPS (misalnya dari DigitalOcean, Vultr, dll.) yang menjalankan Ubuntu.
- Sebuah nama domain yang sudah diarahkan ke alamat IP VPS Anda.

### Langkah 1: Setup Server Awal

1.  **Login ke VPS Anda**
    ```bash
    ssh root@YOUR_SERVER_IP
    ```

2.  **Install Docker dan Docker Compose**
    ```bash
    # Install Docker
    sudo apt-get update
    sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt-get update
    sudo apt-get install -y docker-ce

    # Install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    ```

3.  **Install Nginx**
    ```bash
    sudo apt-get install -y nginx
    ```

4.  **Install Certbot (untuk SSL)**
    ```bash
    sudo apt-get install -y certbot python3-certbot-nginx
    ```

### Langkah 2: Deploy Aplikasi

1.  **Clone Kode dari GitHub**
    ```bash
    git clone https://github.com/your-username/your-repo.git /var/www/inventori-app
    cd /var/www/inventori-app
    ```

2.  **Konfigurasi Environment Backend**
    - Buat file `.env` di direktori `backend`.
      ```bash
      cp backend/.env.example backend/.env
      ```
    - **PENTING:** Edit `backend/.env` dan ganti `JWT_SECRET` dengan string acak yang sangat kuat. Anda bisa membuatnya dengan `openssl rand -base64 32`.

3.  **Bangun dan Jalankan Aplikasi dengan Docker Compose**
    ```bash
    sudo docker-compose up --build -d
    ```
    Flag `-d` akan menjalankan container di *background* (detached mode).

4.  **Setup Database Produksi**
    ```bash
    sudo docker-compose exec backend npx prisma migrate deploy
    ```
    Perintah ini menggunakan `migrate deploy` yang lebih cocok untuk lingkungan produksi daripada `migrate dev`.

### Langkah 3: Konfigurasi Nginx sebagai Reverse Proxy

1.  **Buat File Konfigurasi Nginx Baru**
    ```bash
    sudo nano /etc/nginx/sites-available/your_domain
    ```

2.  **Tempel Konfigurasi Berikut**
    - Ganti `your_domain` dengan nama domain Anda.
    ```nginx
    server {
        listen 80;
        server_name your_domain www.your_domain;

        location / {
            # Atur proxy untuk frontend (misalnya, jika Anda mendeploy build statis)
            # Untuk sekarang, kita fokus pada backend
            return 404; # Atau arahkan ke halaman "Under Construction"
        }

        location /api/ {
            proxy_pass http://localhost:6001/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **Aktifkan Konfigurasi**
    ```bash
    sudo ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/
    sudo nginx -t # Test konfigurasi
    sudo systemctl restart nginx
    ```
    Backend Anda sekarang harus dapat diakses di `http://your_domain/api/`.

### Langkah 4: Bangun dan Sajikan Frontend

1.  **Bangun Aset Frontend**
    - Dari direktori root proyek di VPS Anda (`/var/www/inventori-app`):
      ```bash
      npm install
      npm run build
      ```
    - Ini akan membuat direktori `dist/` yang berisi semua file statis (HTML, CSS, JS).

2.  **Update Konfigurasi Nginx untuk Frontend**
    - Buka kembali file konfigurasi Nginx:
      ```bash
      sudo nano /etc/nginx/sites-available/your_domain
      ```
    - Ubah blok `location /` untuk menyajikan file dari direktori `dist`:
    ```nginx
    server {
        listen 80;
        server_name your_domain www.your_domain;

        root /var/www/inventori-app/dist;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://localhost:6001/;
            # ... (konfigurasi proxy_pass lainnya tetap sama) ...
        }
    }
    ```

3.  **Restart Nginx**
    ```bash
    sudo nginx -t
    sudo systemctl restart nginx
    ```
    Aplikasi frontend Anda sekarang harus live di `http://your_domain`.

### Langkah 5: Amankan dengan SSL (HTTPS)

1.  **Jalankan Certbot**
    ```bash
    sudo certbot --nginx -d your_domain -d www.your_domain
    ```
    - Ikuti petunjuk di layar. Certbot akan secara otomatis mendapatkan sertifikat SSL dan mengkonfigurasi ulang Nginx untuk menggunakannya, termasuk mengatur *redirect* dari HTTP ke HTTPS.

2.  **Selesai!**
    Aplikasi full-stack Anda sekarang live, aman, dan dapat diakses di `https://your_domain`.