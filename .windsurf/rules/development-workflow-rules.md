---
trigger: always_on
---

# Rule: Development Workflow & Quality Assurance - Luxury Fragrance Shop

This rule outlines the general development workflow, coding principles, and quality assurance expectations.
**Always consult `ai_interaction_rules.md` for detailed AI work loops and reporting.**

## 1. Pre-Development Phase

### 1.1. Understand Requirements
* Thoroughly analyze the task, user story, or bug report.
* Ensure all objectives, acceptance criteria, and constraints are clear.

### 1.2. Load and Consult Relevant Rules
Before writing any code, load and understand all applicable rules for the current task:
* **Always:** `project_overview_rules.md`, `coding_style_rules.md`, this `development_workflow_rules.md`, and `ai_interaction_rules.md`.
* **Database related:** `database_schema_rules.md` (and `database_schema.txt`).
* **RBAC/Authorization related:** `rbac_definition_rules.md` (and `rbac_definition.txt`).
* **Backend specific:** `backend_api_rules.md`, `security_rules.md`.
* **Frontend (User UI) specific:** `frontend_ui_rules.md`.
* **Frontend (Admin UI) specific:** `admin_ui_rules.md`.

### 1.3. Review Configurations
* Check relevant configuration files if the task involves them (e.g., `application.properties` for backend, Vite/Tailwind configs for frontend).

### 1.4. Understand Existing Logic & Structure
* Review existing code in related modules (controllers, services, components, etc.) to ensure consistency and avoid duplication.
* **Backend - Adherence & Flexibility:** Strictly follow the defined project structure and architectural patterns. If a task seems to require a deviation from the established structure or core logic (e.g., for significant performance gains or better suitability to a unique problem), **propose the change with clear justification and await confirmation before proceeding.** Solutions should be robust and flexible for future needs.
* **Frontend - Adherence & Consistency:** Maintain consistency with existing UI components, styles, and user experience patterns.

### 1.5. Clarification
* If any information is missing, ambiguous, or seems to conflict with existing rules/code, **ask for clarification before proceeding.**

## 2. Development Phase

### 2.1. Follow Project Structure
* Adhere strictly to the defined project and module structures outlined in the relevant rule files.

### 2.2. Code Quality Principles
* **Write Scalable, Maintainable, and Secure Code:** Focus on clarity, efficiency, reusability, and security in all implementations.
* **Clean Code:** Apply principles from `coding_style_rules.md`.
* **No Hard-Coding:** Never hard-code sensitive information, URLs, display strings, or configuration values. Utilize configuration files, environment variables, or constants.
* **Defensive Coding:** Anticipate potential issues (e.g., null inputs, invalid data, API errors) and handle them gracefully.

### 2.3. Non-Functional Requirements (Backend Focus)
* **Performance:** Implement efficient algorithms and database queries. Be mindful of potential bottlenecks (see `backend_api_rules.md`).
* **Error Handling:** Implement robust error handling and logging (see `backend_api_rules.md`).

### 2.4. UI/UX Principles (Frontend Focus)
* Adhere to UI/UX guidelines in `frontend_ui_rules.md` and `admin_ui_rules.md` (intuitive, modern, consistent, logical layout).

## 3. Post-Development Phase (Testing & Verification)

### 3.1. Unit & Integration Testing (Conceptual)
* While the AI may not write these tests unless specifically instructed, the code produced **must be testable**.
* Consider how individual units (functions, components, services) and their integrations would be tested.

### 3.2. Functional Testing
* **Backend:** Thoroughly test all API endpoints as per `backend_api_rules.md` (using `curl` or similar tools). Cover happy paths, edge cases, invalid inputs, and authentication/authorization scenarios.
* **Frontend:** Manually test all UI changes in the browser across different states and user interactions. Verify responsiveness and visual consistency.

### 3.3. Regression Testing (Critical)
* **Responsibility:** After implementing new features or fixing bugs, the AI is responsible for considering and, where possible, outlining steps to verify that existing functionalities are not adversely affected.
* **Core Logic Changes:** Exercise extreme caution when modifying shared modules or core application logic. Rigorously test impacted areas.
* **Automated Tests:** If automated tests exist for the project, ensure they all pass after changes are made. (AI should assume this is a manual step by the developer unless integrated testing tools are available to the AI).
* **Goal:** Ensure that new code **does not break existing, working features.**

### 3.4. Debugging
* If issues arise, analyze logs, error messages, and code to identify the root cause.
* Follow the iterative debugging process outlined in `ai_interaction_rules.md`.