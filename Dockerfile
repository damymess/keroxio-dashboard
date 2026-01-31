# ===========================================
# Keroxio Dashboard - Dockerfile
# ===========================================

FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Fix permissions and build
RUN chmod -R +x node_modules/.bin && npm run build

# ===========================================
# Production stage with nginx
# ===========================================
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
