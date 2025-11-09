# Stage 1: Build the application
# Use a specific Alpine version that has the required openssl compatibility package
FROM node:20-alpine3.18 AS builder

WORKDIR /usr/src/app

# Copy package files and install all dependencies for build
COPY package*.json ./
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client to be used during the build process
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Stage 2: Create the final production image
# Use the same specific Alpine version
FROM node:20-alpine3.18

# --- FINAL FIX: Install OpenSSL 1.1 compatibility library required by Prisma ---
RUN apk add --no-cache openssl1.1-compat

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies first
RUN npm install --omit=dev

# We still need the prisma CLI in the final image to run 'generate'
RUN npm install prisma

# Copy the prisma schema
COPY --from=builder /usr/src/app/prisma ./prisma

# Generate Prisma Client AGAIN in the final stage
# This ensures the correct binary engine is available for the production environment.
RUN npx prisma generate

# Copy the compiled JavaScript code from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port the app runs on
EXPOSE 6001

# Command to run the application
CMD [ "node", "dist/server.js" ]
