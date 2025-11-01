# Use Debian-based image to avoid musl/openssl issues
FROM node:20-bookworm-slim

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

# Install deps first (cache-friendly)
COPY package*.json ./
RUN npm ci

# Copy Prisma schema (no generate yet)
COPY prisma ./prisma

# App source
COPY . .

# Ensure runtime folders exist
RUN mkdir -p uploads/cvs uploads/leave-documents

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Generate client + run migrations at runtime (envs are available), then start
CMD sh -c "npx prisma generate && npx prisma migrate deploy && node index.js"
