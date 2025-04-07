#!/bin/bash
set -e

ENV_FILE=${1:-}
DB_NAME=${2:-}

# Auto-detect env file
if [ -z "$ENV_FILE" ]; then
  if [ -f ".env.local" ]; then ENV_FILE=".env.local"
  elif [ -f ".env" ]; then ENV_FILE=".env"
  else echo "❌ No env file found!"; exit 1; fi
fi

echo "🛠️ [create-db.sh] Using env file: $ENV_FILE"
export $(grep -v '^#' "$ENV_FILE" | xargs)

REQUIRED_VARS=(DB_FOLDER MSSQL_SA_PASSWORD MSSQL_PORT CONTAINER_NAME)
for var in "${REQUIRED_VARS[@]}"; do
  [ -z "${!var}" ] && echo "❌ Missing variable: $var" && exit 1
done

# Nếu chưa truyền DB_NAME thì lấy từ env MSSQL_DATABASE
if [ -z "$DB_NAME" ]; then
  if [ -n "$MSSQL_DATABASE" ]; then
    DB_NAME=$MSSQL_DATABASE
    echo "📦 [create-db.sh] No db name provided. Using MSSQL_DATABASE='$DB_NAME' from env."
  else
    echo "❌ [create-db.sh] Missing database name! Provide it as argument or set MSSQL_DATABASE in env."
    exit 1
  fi
fi

# Create database if not exists
echo "📦 [create-db.sh] Creating database '$DB_NAME' inside container '$CONTAINER_NAME'..."
docker exec $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd \
  -S localhost \
  -U sa \
  -P "$MSSQL_SA_PASSWORD" \
  -Q "IF DB_ID('$DB_NAME') IS NULL BEGIN CREATE DATABASE [$DB_NAME]; PRINT('✅ Database $DB_NAME created.'); END ELSE PRINT('ℹ️ Database $DB_NAME already exists.');"

echo "🎯 [create-db.sh] Done!"
