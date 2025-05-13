---
description: Details the structured approach for implementing new server-side API endpoints that serve administrative functions. It focuses on secure data processing, adherence to architectural principles, and proper testing of administrative APIs.
---

# Workflow: Create Admin Backend API Endpoint

**Trigger:** Request to add a new Admin API endpoint in `backend/src/main/java`.

**Steps:**
1. Identify endpoint purpose, HTTP method, and URL path with `/api/v1/emp/...` prefix.
2. Research:
   - Read `database_schema.txt` (lines 1–380) and `rbac_definition.txt` (lines 1–382) for relevant entities and permission rules.
3. Create or update Controller, Service, and Repository classes under `backend/src/main/java` following existing package structure.
4. Implement business logic, input validation, and exception handling.
5. **API Testing:** Use `run_in_terminal` to execute `curl` commands with `/api/v1` prefix, e.g.:
   ```bash
   curl -X GET http://localhost:8080/api/v1/emp/example
   ```
6. Run unit and integration tests if available.
7. Self-review for performance, security, and adherence to coding rules; if issues are found, repeat the cycle.
