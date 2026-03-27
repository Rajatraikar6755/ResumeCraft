FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY server/prisma ./server/prisma

# Install production deps only (skips canvas and other native test modules)
RUN npm install --omit=dev

# Install ONLY the build tools we need (no native compilation)
RUN npm install --no-save esbuild prisma

COPY . .

# Generate Prisma client and build server bundle
RUN npx prisma generate --schema=server/prisma/schema.prisma
RUN npx esbuild server/index.ts --bundle --platform=node --format=esm --outfile=dist/index.js --packages=external

RUN echo "=== Build output ===" && ls -la dist/

CMD ["node", "dist/index.js"]
