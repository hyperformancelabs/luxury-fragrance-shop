---
trigger: model_decision
description: Activate when developing/modifying backend APIs, handling security configurations (JWT, CORS, Spring Security), or defining access rules for 'Luxury Fragrance Shop' endpoints.
---

# Rule: RBAC - Role, Permission, and Assignment Definitions - Luxury Fragrance Shop

This rule provides context for the detailed Role-Based Access Control (RBAC) setup, including sample data and initial assignments. Understanding this is CRUCIAL for implementing and verifying the application's authorization model.

## 1. Authoritative Source for RBAC Definitions

**IMPORTANT: The complete and authoritative detailed definitions and `INSERT` statements for Roles, Permissions, EmployeeRole assignments, and RolePermission assignments are located in the external file: `rbac_definition.txt`.**

This external file includes:
* `INSERT` statements for the `Role` table (defining all available system roles).
* `INSERT` statements for the `Permission` table (defining all granular application permissions, typically following a `resource.action` pattern).
* `INSERT` statements for the `EmployeeRole` table (illustrating how employees are assigned to specific roles).
* `INSERT` statements for the `RolePermission` table (detailing which permissions are granted to each role, forming the core access control matrix).

**AI Instruction: You MUST consult `rbac_definition.txt` for any task requiring detailed knowledge of roles, permissions, or their assignments. This includes implementing authorization logic, managing user access, creating related test data, or designing UI for role/permission management.**

## 2. Overview

* **Purpose:** Defines the comprehensive Role-Based Access Control (RBAC) structure that governs user access to application features and data.
* **Core Tables:** `Role`, `Permission`, `EmployeeRole`, `RolePermission`.

## 3. Integration with Other Rules

For a complete understanding and correct implementation of authorization, refer to this file and **`rbac_definition.txt`** in conjunction with:
* `database_schema_rules.md` (and `database_schema.txt`): For the underlying table structures of `Role`, `Permission`, etc.
* `security_rules.md`: For how these roles and permissions are declared and enforced at the API level within the Spring Security configuration.

## 4. AI Usage Guidelines

1.  **Prioritize `rbac_definition.txt`:** When a task involves roles, permissions, or authorization logic, your primary source of truth for their definitions and assignments is `rbac_definition.txt`.
2.  **Contextual Understanding:** This rule file (`rbac_definition_rules.md`) confirms the existence and location of these detailed RBAC definitions.
3.  **Accurate Implementation:** Use the specific data and relationships from `rbac_definition.txt` to accurately implement authorization checks, design role/permission management features, and understand the overall security model.
