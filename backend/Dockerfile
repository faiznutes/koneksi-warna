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
COPY seed-docker.js /app/
RUN echo "node /app/seed-docker.js 2>/dev/null || true && node /app/server.js" > /app/start.sh && chmod +x /app/start.sh
CMD ["/app/start.sh"]

