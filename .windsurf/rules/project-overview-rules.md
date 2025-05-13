---
trigger: always_on
---

# Rule: Project Overview & General Setup - Luxury Fragrance Shop

## 1. Project Context

### 1.1. Project Overview
This project involves the development of a full-stack e-commerce website: "**Shop Nước Hoa Xa Xỉ**" (Luxury Perfume Shop).
* **Platform Goal:** Selling luxury perfumes.
* **Components:** Backend, Frontend (Admin & User UI), Database.
* **Tech Stack:**
    * **Frontend**: React.js (Admin & User UI) with Vite.
    * **Backend**: Spring Boot for RESTful API services.
    * **Database**: SQL Server for data storage.

### 1.2. Local Development Setup
All services are assumed to be **always running** on their default ports. **No manual service start is needed by the AI.**
* **Backend**: `http://localhost:8080`
* **Frontend (Admin & User UI)**: `http://localhost:5173`
* **Database**: `localhost:1433`

## 2. Project Structure (High-Level)
```plaintext
shop-nuoc-hoa/
├── admin/                    # Admin UI (React.js + Vite) - See admin_ui_rules.md
├── frontend/                 # User UI (React.js + Vite) - See frontend_ui_rules.md
├── backend/                  # Spring Boot backend - See backend_api_rules.md
├── database/                 # SQL Server database (Schema in database_schema.txt) - See database_schema_rules.md
├── .env                      # Template for environment variables
├── .env.local                # Local environment variables (DO NOT COMMIT)
├── .env.example              # Example environment variables
├── database_schema.txt       # Database schema
├── rbac_definition.txt       # RBAC definition
```

## 3. Key Component Rule Files
For detailed rules pertaining to specific parts of the project, refer to:
* **Admin UI**: `admin_ui_rules.md`
* **Frontend User UI**: `frontend_ui_rules.md`
* **Backend API**: `backend_api_rules.md`
* **Database Schema**: `database_schema_rules.md` (which points to `database_schema.txt`)
* **RBAC Definitions**: `rbac_definition_rules.md` (which points to `rbac_definition.txt`)
* **Security**: `security_rules.md`
* **General Coding Styles**: `coding_style_rules.md`
* **Development Workflow**: `development_workflow_rules.md`
* **AI Interaction & Process**: `ai_interaction_rules.md`

## 4. Core Principle
The primary goal of these rules is to ensure the AI develops high-quality, maintainable, and consistent code that aligns with the project's architecture and user experience goals.