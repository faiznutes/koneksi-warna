#!/bin/sh
set -e
echo "Starting server..."
node /app/server.js &
SERVER_PID=$!
sleep 4
echo "Seeding data..."
node /app/seed-docker.js 2>/dev/null || true
echo "Ready."
wait $SERVER_PID
