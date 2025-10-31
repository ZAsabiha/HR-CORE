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

# Prisma schema & client
COPY prisma ./prisma
RUN npx prisma generate

# App source
COPY . .

# Ensure runtime folders exist
RUN mkdir -p uploads/cvs uploads/leave-documents

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Apply pending migrations, then start
CMD sh -c "npx prisma migrate deploy && node index.js"
