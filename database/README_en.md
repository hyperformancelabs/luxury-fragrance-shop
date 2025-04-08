# Database Configuration for Luxury Fragrance Shop

**[Tiếng Việt](README.md)**  |  **English**

This directory contains scripts and configuration for managing the SQL Server database used in the Luxury Fragrance Shop project. The database runs in a Docker container for ease of deployment and consistent development environments.

## Overview

The database system uses:
- **Microsoft SQL Server 2022** (latest version)
- **Docker** container for isolation and portability
- **Custom Dockerfile** with `sqlcmd` pre-installed
- **Bash scripts** for easy management operations

## Prerequisites

Before setting up the database, ensure you have:

1. [Docker](https://www.docker.com/get-started) installed and running
2. [Docker Compose](https://docs.docker.com/compose/install/) installed
3. Basic shell commands (Bash) knowledge
4. A system with sufficient resources to run SQL Server (minimum 2GB RAM)

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file to create your configuration:

```bash
cp .env.example .env.local  # or .env if you prefer
```

Edit the new file to adjust:
- `MSSQL_SA_PASSWORD`: Choose a strong password for the SA user
- `MSSQL_PORT`: Change if port 1433 is already in use on your system
- `CONTAINER_NAME`: Customize the container name if needed
- `MSSQL_DATABASE`: Default database name to be created

### 2. Basic Management Commands

The following scripts are available to manage your database container:

| Script | Description | Usage |
|--------|-------------|-------|
| `./start.sh` | Starts the database container | `./start.sh [env_file]` |
| `./stop.sh` | Stops the database container | `./stop.sh [env_file]` |
| `./reset.sh` | Resets the database (data will be lost) | `./reset.sh [env_file]` |
| `./delete.sh` | Completely removes container and volumes | `./delete.sh [env_file]` |
| `./fast-check.sh` | Quick DB status check, displays databases and users | `./fast-check.sh [env_file]` |
| `./restart.sh` | Restarts the database container | `./restart.sh [env_file]` |
| `./dbctl.sh` | Comprehensive database management tool (see below) | `./dbctl.sh [options]` |
| `./synconfigs.sh` | Synchronizes environment variables between root and database directory | `./synconfigs.sh` |

For all scripts, you can optionally specify a custom environment file path as the first argument. If not specified, the scripts will look for `.env.local` first, then `.env`.

### 3. SQL Server Management Tool (dbctl.sh)

`dbctl.sh` is a comprehensive tool for managing your SQL Server database:

**Key features:**
- Create and delete databases
- Create and delete user accounts
- Manage user permissions
- Change user passwords
- Display system and database information

**Usage:**

1. **Interactive mode:** Run without parameters to open the interactive menu
   ```bash
   ./dbctl.sh
   ```

2. **Direct command mode:**
   ```bash
   ./dbctl.sh --create-db mydb
   ./dbctl.sh --create-user username password
   ./dbctl.sh --modify-user username mydb
   ./dbctl.sh --show-info
   ```

3. **Environment file option:**
   ```bash
   ./dbctl.sh --env .env.custom
   ```

To see all available options:
```bash
./dbctl.sh --help
```

### 4. Configuration Sync Tool (synconfigs.sh)

The `synconfigs.sh` script helps synchronize environment variables between different configuration files:

- Synchronizes from root environment files to database directory
- Supports `.env`, `.env.example`, and `.env.local` files
- Automatically detects common variables and only synchronizes these
- Preserves structure and format of the destination file

### 5. Database Connection Information

Once the database is running, you can connect to it using:

- **Server**: `localhost` or `127.0.0.1`
- **Port**: As configured in your `.env` file (default: 1433)
- **Username**: `sa` or an account you've created
- **Password**: As configured in your environment file
- **Database**: Use the `MSSQL_DATABASE` value or a database you've created with `dbctl.sh`

## Docker Configuration

The project uses two main configuration files to set up the environment:

### Dockerfile
- Based on the official SQL Server 2022 image
- Pre-installs `sqlcmd` and related tools
- Configures PATH for easy `sqlcmd` usage
- Automatically accepts Microsoft's EULA

### docker-compose.yml
- Builds container from Dockerfile
- Environment variables configuration
- Port mapping
- Persistent volume for data storage
- Health check parameters

## Data Persistence

Database files are stored in a Docker volume named `db_data`. This ensures that your data persists between container restarts unless you explicitly use `reset.sh` or `delete.sh`.

## Troubleshooting

Common issues and solutions:

1. **Port already in use**: Change the `MSSQL_PORT` in your environment file.
2. **Container won't start**: Check Docker logs with `docker logs <container_name>`.
3. **Connection refused**: Run `./fast-check.sh` to verify the database is running properly.
4. **Permission denied on scripts**: Run `chmod +x *.sh` to make scripts executable.

## Security Considerations

- The default SA password in `.env.example` is for demonstration only. Always use a strong, unique password in production.
- Use `dbctl.sh` to create users with appropriate permissions instead of using the SA account for applications.
- Consider restricting access to the database port in production environments.
- Backup your data regularly if used in production.