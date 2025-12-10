#frontend
# Build stage
FROM node:22.21.1-alpine AS builder

WORKDIR /app

# 1. Copy ONLY package files first
COPY package*.json ./

# 2. Configure npm
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retry-maxtimeout 300000 \
    && npm config set fetch-retry-mintimeout 30000 \
    && npm config set fetch-retries 5 \
    && npm config set maxsockets 1

# 3. Install dependencies with retry
RUN npm ci --no-audit --no-fund --no-progress || \
    (echo "First npm ci failed, retrying..." && sleep 10 && npm ci --no-audit --no-fund --no-progress)

# 4. Copy ALL source code
COPY . .

# 5. Build with memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Production stage
FROM nginx:alpine

# 6. Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# 7. Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# 8. Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 9. Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]