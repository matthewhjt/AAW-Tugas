FROM node:18.18.2 AS builder

WORKDIR /wishlist

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --prod

# Install dependencies
RUN corepack enable && pnpm install --no-frozen-lockfile

# Copy source
COPY . .

# Build TypeScript dan jalankan tsc-alias
RUN pnpm run build

# Generate migration dengan Drizzle
RUN pnpm exec drizzle-kit generate:pg

# Jalankan migrasi setelah generate
RUN node dist/src/db/migrate.js

# Production image
FROM node:18.18.2-slim

ENV PORT 8004
ENV NODE_ENV production

WORKDIR /wishlist

# Copy hasil build dari builder
COPY --from=builder /wishlist /wishlist

COPY --from=builder /wishlist/drizzle /wishlist/drizzle

RUN npm install -g pnpm && pnpm install --prod

# Install dependencies untuk production
RUN pnpm install --prod --frozen-lockfile

EXPOSE 8004

CMD ["sh", "-c", "node dist/src/db/migrate.js && node dist/src/server.js"]