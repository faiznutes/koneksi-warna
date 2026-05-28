FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++ curl
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:20-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3001

# Start server, wait for DB creation, seed data, then keep running
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'node /app/server.js &
    sleep 3
    node /app/seed-docker.js 2>/dev/null || true
    wait' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]
