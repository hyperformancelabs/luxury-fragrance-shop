#!/bin/bash
set -e

ENV_FILE=${1:-}
if [ -z "$ENV_FILE" ]; then
  if [ -f ".env.local" ]; then ENV_FILE=".env.local"
  elif [ -f ".env" ]; then ENV_FILE=".env"
  else echo "❌ No env file found!"; exit 1; fi
fi
echo "🛑 [stop.sh] Using env file: $ENV_FILE"
export $(grep -v '^#' "$ENV_FILE" | xargs)

[ -z "$DB_FOLDER" ] && echo "❌ Missing variable: DB_FOLDER" && exit 1

cd "$DB_FOLDER"
docker-compose down || { echo "❌ Failed to stop docker-compose"; exit 1; }
cd ..

echo "✅ Database stopped!"
