#!/bin/bash
set -e

# =======================
# 🧩 Shared utilities
# =======================

confirm_action() {
    local prompt="$1"
    while true; do
        read -p "$prompt (yes/no): " confirm
        confirm=$(echo "$confirm" | tr '[:upper:]' '[:lower:]')
        if [[ "$confirm" == "yes" ]]; then
            return 0
        elif [[ "$confirm" == "no" ]]; then
            echo "❌ Action cancelled."
            return 1
        else
            echo "❌ Please type 'yes' or 'no'."
        fi
    done
}

verify_sa_password() {
    while true; do
        read -s -p "🔐 Enter SA password to continue: " input_pwd
        echo

        echo "🛡️ [dbctl.sh] Verifying SA credentials..."

        if docker exec "$CONTAINER_NAME" /opt/mssql-tools/bin/sqlcmd \
            -S localhost \
            -U sa \
            -P "$input_pwd" \
            -Q "SELECT 1" -h -1 > /dev/null 2>&1; then
            MSSQL_SA_PASSWORD="$input_pwd"
            return
        else
            echo "❌ Incorrect SA password. Please try again."
        fi
    done
}

select_permissions() {
    echo "🔧 Select permissions to grant (space-separated, default: all):"
    echo "Available: SELECT INSERT UPDATE DELETE EXECUTE VIEW DEFINITION"
    read -p "Enter permissions (or leave blank for all): " input
    if [ -z "$input" ]; then
        echo "SELECT, INSERT, UPDATE, DELETE, EXECUTE, VIEW DEFINITION"
    else
        echo "$input" | sed 's/ /, /g'
    fi
}

# =======================
# 🎯 Core actions
# =======================

create_database() {
    verify_sa_password
    local db_name=$1
    echo "📦 [dbctl.sh] Creating database '$db_name'..."

    docker exec $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd \
        -S localhost \
        -U sa \
        -P "$MSSQL_SA_PASSWORD" \
        -Q "IF DB_ID('$db_name') IS NULL BEGIN CREATE DATABASE [$db_name]; PRINT('✅ Database $db_name created.'); END ELSE PRINT('ℹ️ Database $db_name already exists.');"
}

delete_database() {
    verify_sa_password
    local db_name=$1
    echo "🗑️ [dbctl.sh] Deleting database '$db_name'..."
    confirm_action "⚠️ This will permanently delete database '$db_name'" || return

    docker exec $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd \
        -S localhost \
        -U sa \
        -P "$MSSQL_SA_PASSWORD" \
        -Q "IF DB_ID('$db_name') IS NOT NULL BEGIN ALTER DATABASE [$db_name] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [$db_name]; PRINT('✅ Database $db_name deleted.'); END ELSE PRINT('ℹ️ Database $db_name does not exist.');"
}

create_user() {
    verify_sa_password
    local username=${1:-$MSSQL_USERNAME}
    local password=${2:-$MSSQL_PASSWORD}

    if [ -z "$username" ] || [ -z "$password" ]; then
        echo "❌ Missing username or password."
        exit 1
    fi
    if [ "$username" = "sa" ]; then
        echo "❌ Cannot create or overwrite 'sa' user."
        exit 1
    fi

    echo "👤 [dbctl.sh] Creating user '$username'..."
    docker exec $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd \
        -S localhost \
        -U sa \
        -P "$MSSQL_SA_PASSWORD" \
        -Q "IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = '$username') BEGIN CREATE LOGIN [$username] WITH PASSWORD = '$password'; PRINT('✅ User $username created.'); END ELSE PRINT('ℹ️ User $username already exists.');"
}

delete_user() {
    verify_sa_password
    local username=$1
    echo "🗑️ [dbctl.sh] Deleting user '$username'..."

    if [ "$username" = "sa" ]; then
        echo "❌ Cannot delete 'sa' user."
        return 1
    fi

    confirm_action "⚠️ This will permanently delete user '$username'" || return

    docker exec $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd \
        -S localhost \
        -U sa \
        -P "$MSSQL_SA_PASSWORD" \
        -Q "IF EXISTS (SELECT * FROM sys.server_principals WHERE name = '$username') BEGIN DROP LOGIN [$username]; PRINT('✅ User $username deleted.'); END ELSE PRINT('ℹ️ User $username does not exist.');"
}

modify_user_permissions() {
    verify_sa_password
    local username=$1
    local db_name=$2

    echo "🔑 [dbctl.sh] Modifying permissions for user '$username' on database '$db_name'..."
    confirm_action "⚠️ This will overwrite permissions for '$username' in '$db_name'" || return

    local permissions=$(select_permissions)

    docker exec $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd \
        -S localhost \
        -U sa \
        -P "$MSSQL_SA_PASSWORD" \
        -Q "USE [$db_name]; IF EXISTS (SELECT * FROM sys.database_principals WHERE name = '$username') BEGIN DROP USER [$username]; END; CREATE USER [$username] FOR LOGIN [$username]; GRANT $permissions TO [$username]; PRINT('✅ Permissions updated for user $username.');"
}

change_user_password() {
    verify_sa_password
    local username=$1
    local new_password=$2

    if [ -z "$username" ] || [ -z "$new_password" ]; then
        echo "❌ Username and new password are required."
        exit 1
    fi
    if [ "$username" = "sa" ]; then
        echo "❌ Cannot change password for 'sa' user."
        exit 1
    fi

    confirm_action "⚠️ Are you sure you want to change password for '$username'?" || return

    docker exec $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd \
        -S localhost \
        -U sa \
        -P "$MSSQL_SA_PASSWORD" \
        -Q "ALTER LOGIN [$username] WITH PASSWORD = '$new_password'; PRINT('✅ Password updated.');"
}

show_db_info() {
    echo "🔍 [dbctl.sh] Fetching MSSQL info..."

    echo -e "\n📦 Version:"
    docker exec $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd \
        -S localhost \
        -U sa \
        -P "$MSSQL_SA_PASSWORD" \
        -Q "SELECT @@VERSION" -h -1 -W

    echo -e "\n📚 Databases:"
    docker exec $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd \
        -S localhost \
        -U sa \
        -P "$MSSQL_SA_PASSWORD" \
        -Q "SET NOCOUNT ON; SELECT name FROM sys.databases WHERE database_id > 4 ORDER BY name;" \
        -h -1 -W -s "," | column -t -s ','

    echo -e "\n👥 Logins:"
    docker exec $CONTAINER_NAME /opt/mssql-tools/bin/sqlcmd \
        -S localhost \
        -U sa \
        -P "$MSSQL_SA_PASSWORD" \
        -Q "SET NOCOUNT ON; SELECT name, type_desc FROM sys.server_principals WHERE type_desc = 'SQL_LOGIN' AND name NOT IN ('sa', '##MS_PolicyEventProcessingLogin##', '##MS_PolicyTsqlExecutionLogin##') ORDER BY name;" \
        -h -1 -W -s "," | column -t -s ','
}

# =======================
# 🚀 Script bootstrap
# =======================

ENV_FILE=""
for (( i=1; i<=$#; i++ )); do
    arg=${!i}
    if [ "$arg" = "--env" ]; then
        next=$((i + 1))
        ENV_FILE=${!next}
        break
    fi
done

if [ -z "$ENV_FILE" ]; then
    if [ -f ".env.local" ]; then
        ENV_FILE=".env.local"
    elif [ -f ".env" ]; then
        ENV_FILE=".env"
    else
        echo "❌ No env file found!"
        exit 1
    fi
fi

echo "🛠️ [dbctl.sh] Using env file: $ENV_FILE"
export $(grep -v '^#' "$ENV_FILE" | xargs)

REQUIRED_VARS=(DB_FOLDER MSSQL_PORT CONTAINER_NAME)
for var in "${REQUIRED_VARS[@]}"; do
    [ -z "${!var}" ] && echo "❌ Missing variable: $var" && exit 1
done

# =======================
# 🧭 CLI entrypoint
# =======================

if [ $# -eq 0 ]; then
    while true; do
        clear
        echo "\n📋 [dbctl.sh] Menu"
        echo "1. Create Database"
        echo "2. Delete Database"
        echo "3. Create User"
        echo "4. Delete User"
        echo "5. Modify User Permissions"
        echo "6. Change User Password"
        echo "7. Show DB Info"
        echo "8. Exit"
        read -p "Choose option (1-8): " choice
        case $choice in
            1) read -p "DB name: " db; create_database "$db"; read -n 1 -s -r -p $'\nPress any key to continue...';;
            2) read -p "DB name: " db; delete_database "$db"; read -n 1 -s -r -p $'\nPress any key to continue...';;
            3) read -p "Username: " u; read -s -p "Password: " p; echo; create_user "$u" "$p"; read -n 1 -s -r -p $'\nPress any key to continue...';;
            4) read -p "Username: " u; delete_user "$u"; read -n 1 -s -r -p $'\nPress any key to continue...';;
            5) read -p "Username: " u; read -p "DB name: " db; modify_user_permissions "$u" "$db"; read -n 1 -s -r -p $'\nPress any key to continue...';;
            6) read -p "Username: " u; read -s -p "New password: " p; echo; change_user_password "$u" "$p"; read -n 1 -s -r -p $'\nPress any key to continue...';;
            7) show_db_info; read -n 1 -s -r -p $'\nPress any key to continue...';;
            8) echo "👋 Goodbye!"; exit 0;;
            *) echo "❌ Invalid option."; read -n 1 -s -r -p $'\nPress any key to try again...';;
        esac
    done
else
    case "$1" in
        --create-db) create_database "$2";;
        --delete-db) delete_database "$2";;
        --create-user) create_user "$2" "$3";;
        --delete-user) delete_user "$2";;
        --modify-user) modify_user_permissions "$2" "$3";;
        --change-password) change_user_password "$2" "$3";;
        --show-info) show_db_info;;
        --help|*)
            echo "📖 Usage: ./dbctl.sh [options]"
            echo "  --create-db [name]        Create DB"
            echo "  --delete-db [name]        Delete DB"
            echo "  --create-user [u] [p]     Create user"
            echo "  --delete-user [u]         Delete user"
            echo "  --modify-user [u] [db]    Grant permissions"
            echo "  --change-password [u] [p] Change password"
            echo "  --show-info               Show DB info"
            echo "  --env [file]              Use env file"
            echo "  --help                    Show help"
            ;;
    esac
fi
