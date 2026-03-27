FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY server/prisma ./server/prisma

# Install ALL dependencies (dev needed for esbuild + prisma CLI)
RUN npm install --include=dev

# Copy source code
COPY . .

# Generate Prisma client + build server bundle
RUN npx prisma generate --schema=server/prisma/schema.prisma && \
    npx esbuild server/index.ts --bundle --platform=node --format=esm --outfile=dist/index.js --packages=external

# Verify build output exists
RUN echo "=== Build output ===" && ls -la dist/

CMD ["node", "dist/index.js"]
