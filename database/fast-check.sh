#!/bin/bash
set -e

ENV_FILE=${1:-}
WAIT_TIMEOUT=30

if [ -z "$ENV_FILE" ]; then
  if [ -f ".env.local" ]; then ENV_FILE=".env.local"
  elif [ -f ".env" ]; then ENV_FILE=".env"
  else echo "❌ No env file found!"; exit 1; fi
fi
echo "⚡ [fast-check.sh] Using env file: $ENV_FILE"
export $(grep -v '^#' "$ENV_FILE" | xargs)

REQUIRED_VARS=(DB_FOLDER MSSQL_PORT CONTAINER_NAME)
for var in "${REQUIRED_VARS[@]}"; do [ -z "${!var}" ] && echo "❌ Missing variable: $var" && exit 1; done

if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo "✅ Container '$CONTAINER_NAME' is running."
else
  echo "❌ Container '$CONTAINER_NAME' is NOT running."
  exit 1
fi

echo "⏳ Checking TCP port $MSSQL_PORT..."
for ((i=1;i<=WAIT_TIMEOUT;i++)); do
  if nc -z localhost $MSSQL_PORT; then
    echo "✅ TCP port $MSSQL_PORT is open."
    exit 0
  fi
  echo "🔄 [$i/$WAIT_TIMEOUT] Retrying..."
  sleep 1
done

echo "❌ TCP port $MSSQL_PORT is not open after $WAIT_TIMEOUT seconds."
exit 1
