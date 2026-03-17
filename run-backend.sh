#!/bin/bash

# Start required Docker containers
echo "Starting required Docker containers..."
docker start medusa-postgres local-redis

cd backend
npm run dev