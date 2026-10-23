# Dapur Antar API - Docker image
FROM node:22-alpine

# Run in production mode
ENV NODE_ENV=production
WORKDIR /app

# Copy dependency files first so Docker can cache the npm install layer
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the backend source
COPY server.js ./
COPY docs ./docs

# Do not run as root
USER node

EXPOSE 3000

# Container is "healthy" only if the API answers on /api/health
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
