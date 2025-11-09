# Tahap 1: Build Aplikasi
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin skema Prisma
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Salin sisa kode sumber
COPY . .

# Build TypeScript ke JavaScript
RUN npm run build

# Tahap 2: Rilis (Production Image)
FROM node:20-alpine
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install hanya dependensi produksi
RUN npm install --omit=dev

# Salin hasil build dari tahap 'builder'
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Expose port yang digunakan aplikasi
EXPOSE 6001

# Command untuk menjalankan aplikasi
CMD ["node", "dist/server.js"]