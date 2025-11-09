# Tahap 1: Build React App
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Tahap 2: Serve with Nginx
FROM nginx:stable-alpine
# Salin hasil build dari tahap sebelumnya ke direktori serve Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Hapus konfigurasi default Nginx
RUN rm /etc/nginx/conf.d/default.conf
# Salin konfigurasi Nginx kustom kita
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
