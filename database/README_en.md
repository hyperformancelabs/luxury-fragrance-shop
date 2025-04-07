# Database Configuration for Luxury Fragrance Shop

**[Tiếng Việt](README.md)**  |  **English**

This directory contains scripts and configuration for managing the SQL Server database used in the Luxury Fragrance Shop project. The database runs in a Docker container for ease of deployment and consistent development environments.

## Overview

The database system uses:
- **Microsoft SQL Server 2022** (latest version)
- **Docker** container for isolation and portability
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

### 2. Available Commands

The following scripts are available to manage your database container:

| Script | Description | Usage |
|--------|-------------|-------|
| `./start.sh` | Starts the database container | `./start.sh [env_file]` |
| `./stop.sh` | Stops the database container | `./stop.sh [env_file]` |
| `./reset.sh` | Resets the database (data will be lost) | `./reset.sh [env_file]` |
| `./delete.sh` | Completely removes container and volumes | `./delete.sh [env_file]` |
| `./fast-check.sh` | Checks if the database is running and accessible | `./fast-check.sh [env_file]` |

For all scripts, you can optionally specify a custom environment file path as the first argument. If not specified, the scripts will look for `.env.local` first, then `.env`.

### 3. Database Connection Information

Once the database is running, you can connect to it using:

- **Server**: `localhost` or `127.0.0.1`
- **Port**: As configured in your `.env` file (default: 1433)
- **Username**: `sa`
- **Password**: As configured in your `.env` file
- **Database**: By default, no database is created. You'll need to create one after connecting.

## Docker Compose Configuration

The `docker-compose.yml` file defines:
- SQL Server image version
- Platform settings (linux/amd64)
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
- Consider restricting access to the database port in production environments.
- Backup your data regularly if used in production.