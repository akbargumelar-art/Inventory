# Stage 1: Build the application
FROM node:20-alpine AS builder

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
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies first
RUN npm install --omit=dev

# We still need the prisma CLI in the final image to run 'generate'
RUN npm install prisma

# Copy the prisma schema
COPY --from=builder /usr/src/app/prisma ./prisma

# --- FINAL FIX: Generate Prisma Client AGAIN in the final stage ---
# This ensures the correct binary engine is available for the production environment.
RUN npx prisma generate

# Copy the compiled JavaScript code from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port the app runs on
EXPOSE 6001

# Command to run the application
CMD [ "node", "dist/server.js" ]