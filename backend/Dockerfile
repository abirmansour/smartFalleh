#backend 
# Build stage
FROM node:22.21.1-alpine AS builder

WORKDIR /app

# 1. Copy ONLY package files first for better caching
COPY package*.json ./
COPY tsconfig*.json ./

# 2. Configure npm with robust settings BEFORE install
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retry-maxtimeout 300000 \
    && npm config set fetch-retry-mintimeout 30000 \
    && npm config set fetch-retries 5 \
    && npm config set maxsockets 1 \
    && npm config set loglevel warn \
    && npm config set prefer-offline true

# 3. Install ALL dependencies (dev + prod) with retry logic
RUN npm ci --no-audit --no-fund --no-progress || \
    (echo "First npm ci failed, retrying..." && sleep 10 && npm ci --no-audit --no-fund --no-progress)

# 4. Copy source code AFTER dependencies are installed
COPY src/ ./src/
COPY test/ ./test/

# 5. Build the application
RUN npm run build

# Production stage
FROM node:22.21.1-alpine

WORKDIR /app

# 6. Copy ONLY package files for production
COPY package*.json ./

# 7. Configure npm for production
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retry-maxtimeout 300000 \
    && npm config set fetch-retry-mintimeout 30000 \
    && npm config set fetch-retries 5

# 8. Install ONLY production dependencies with retry
RUN npm ci --only=production --no-audit --no-fund --no-progress || \
    (echo "Production npm ci failed, retrying..." && sleep 15 && npm ci --only=production --no-audit --no-fund --no-progress)

# 9. Copy built files from builder
COPY --from=builder /app/dist ./dist

# 10. Copy Prisma files if they exist
COPY prisma ./prisma/

# 11. Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=512"

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "dist/main"]