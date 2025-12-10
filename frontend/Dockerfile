# frontend
# Build stage
FROM node:22.21.1-alpine AS builder

WORKDIR /app

# 1. Copy ONLY package files first
COPY package*.json ./

# 2. Configure npm with better settings for slow connections
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 60000 \
    && npm config set fetch-retries 10 \
    && npm config set maxsockets 3 \
    && npm config set loglevel warn \
    && npm config set prefer-offline true

# 3. Clean npm cache and install dependencies with multiple fallbacks
RUN npm cache clean --force \
    && (npm ci --no-audit --no-fund --no-progress || \
        (echo "npm ci failed, trying npm install..." && \
         npm install --legacy-peer-deps --no-audit --no-fund --no-progress) || \
        (echo "Installation still failing, trying offline mode..." && \
         npm ci --prefer-offline --no-audit --no-fund --no-progress))

# 4. Verify critical dependencies are installed
RUN npm list react-icons || npm install react-icons@latest --no-audit --no-fund --no-progress

# 5. Copy ALL source code
COPY . .

# 6. Verify source code structure
RUN echo "Verifying source structure..." \
    && ls -la src/ \
    && echo "Checking Contact component..." \
    && [ -f src/components/Contact/Contact.jsx ] && echo "✅ Contact.jsx exists" || echo "❌ Contact.jsx missing" \
    && head -5 src/components/Contact/Contact.jsx

# 7. Build with memory limit and timeout
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN echo "Starting build process..." \
    && timeout 300 npm run build || \
    (echo "Build timed out after 5 minutes" && exit 1)

# 8. Verify build output
RUN echo "Build completed. Checking output..." \
    && ls -la dist/ \
    && echo "✅ Build verification complete"

# Production stage
FROM nginx:alpine

# 9. Set nginx user to non-root for security
RUN addgroup -g 1001 -S nginx-group \
    && adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx-group -g nginx nginx-user \
    && chown -R nginx-user:nginx-group /var/cache/nginx \
    && chown -R nginx-user:nginx-group /var/log/nginx \
    && chown -R nginx-user:nginx-group /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown -R nginx-user:nginx-group /var/run/nginx.pid

# 10. Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# 11. Copy built assets with proper permissions
COPY --from=builder --chown=nginx-user:nginx-group /app/dist /usr/share/nginx/html

# 12. Copy nginx configuration with security headers
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 13. Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html \
    && chown -R nginx-user:nginx-group /usr/share/nginx/html

# 14. Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

EXPOSE 80

# 15. Run as non-root user
USER nginx-user

CMD ["nginx", "-g", "daemon off;"]