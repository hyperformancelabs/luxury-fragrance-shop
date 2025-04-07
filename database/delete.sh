#!/bin/bash
set -e

ENV_FILE=${1:-}
if [ -z "$ENV_FILE" ]; then
  if [ -f ".env.local" ]; then ENV_FILE=".env.local"
  elif [ -f ".env" ]; then ENV_FILE=".env"
  else echo "❌ No env file found!"; exit 1; fi
fi
echo "🗑️ [delete.sh] Using env file: $ENV_FILE"
export $(grep -v '^#' "$ENV_FILE" | xargs)

REQUIRED_VARS=(DB_FOLDER CONTAINER_NAME)
for var in "${REQUIRED_VARS[@]}"; do [ -z "${!var}" ] && echo "❌ Missing variable: $var" && exit 1; done

echo ""
while true; do
  read -p "❓ Confirm DELETE container '$CONTAINER_NAME' and volumes? (yes/no): " CONFIRM
  case "$CONFIRM" in
    yes) echo "✅ Deleting..."; break ;;
    no) echo "❌ Aborted."; exit 0 ;;
    *) echo "⚠️  Please type 'yes' or 'no' exactly." ;;
  esac
done

if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
  docker rm -f $CONTAINER_NAME || true
else
  echo "ℹ️ No container '$CONTAINER_NAME' found."
fi

cd "$DB_FOLDER"
docker-compose down -v --remove-orphans || true
cd ..

echo "✅ Deleted database container and volumes!"
