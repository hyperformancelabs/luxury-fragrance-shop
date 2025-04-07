#!/bin/bash
set -e

ENV_FILE=${1:-}
if [ -z "$ENV_FILE" ]; then
  if [ -f ".env.local" ]; then ENV_FILE=".env.local"
  elif [ -f ".env" ]; then ENV_FILE=".env"
  else echo "❌ No env file found!"; exit 1; fi
fi
echo "🚀 [start.sh] Using env file: $ENV_FILE"
export $(grep -v '^#' "$ENV_FILE" | xargs)

REQUIRED_VARS=(DB_FOLDER MSSQL_SA_PASSWORD MSSQL_PORT CONTAINER_NAME)
for var in "${REQUIRED_VARS[@]}"; do [ -z "${!var}" ] && echo "❌ Missing variable: $var" && exit 1; done

cd "$DB_FOLDER"
docker-compose up -d || { echo "❌ Failed to start docker-compose"; exit 1; }
cd ..

echo "✅ Database started!"
