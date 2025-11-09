# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# --- FIX: Copy the generated Prisma Client from the builder stage ---
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the prisma schema for runtime
COPY --from=builder /usr/src/app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 6001

# Command to run the application
CMD [ "node", "dist/server.js" ]