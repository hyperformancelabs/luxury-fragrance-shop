#!/bin/bash
set -e

ENV_FILE=${1:-}

# Auto-detect env file
if [ -z "$ENV_FILE" ]; then
  if [ -f ".env.local" ]; then ENV_FILE=".env.local"
  elif [ -f ".env" ]; then ENV_FILE=".env"
  else echo "❌ No env file found!"; exit 1; fi
fi

echo "🔍 [fast-check.sh] Using env file: $ENV_FILE"
export $(grep -v '^#' "$ENV_FILE" | xargs)

REQUIRED_VARS=(MSSQL_SA_PASSWORD CONTAINER_NAME)
for var in "${REQUIRED_VARS[@]}"; do
  [ -z "${!var}" ] && echo "❌ Missing variable: $var" && exit 1
done

# Kiểm tra container có tồn tại không
if [ ! "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo "❌ [fast-check.sh] Container '$CONTAINER_NAME' is not running!"
  exit 1
fi

# Kiểm tra kết nối cơ sở dữ liệu
echo "🔍 [fast-check.sh] Testing database connection..."
if docker exec $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT @@VERSION" -h -1 > /dev/null; then
  echo "✅ [fast-check.sh] Database is running properly!"
  
  # Hiển thị thông tin phiên bản
  VERSION=$(docker exec $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT @@VERSION" -h -1)
  echo "ℹ️ [fast-check.sh] Database server version:"
  echo "$VERSION"
  
  # Hiển thị danh sách cơ sở dữ liệu
  echo "ℹ️ [fast-check.sh] Available databases:"
  docker exec $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT name FROM sys.databases WHERE database_id > 4 ORDER BY name" -h -1
  
  exit 0
else
  echo "❌ [fast-check.sh] Failed to connect to database!"
  exit 1
fi
