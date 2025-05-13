---
trigger: model_decision
description: Activate when tasks involve database interaction, data modeling, ORM entities, DTOs based on DB, SQL/JPQL query writing, or understanding data relationships for 'Luxury Fragrance Shop'.
---

# Rule: Database Schema - Luxury Fragrance Shop

This rule provides context for the SQL Server database schema.

## 1. Authoritative Source for Schema Details

**IMPORTANT: The complete and authoritative detailed database schema is located in the external file: `database_schema.txt`.**

This external file includes:
* All table definitions.
* Column names, data types, nullability, and other specifications.
* Primary Keys (PK) and Foreign Keys (FK) defining relationships.
* CHECK, UNIQUE, and DEFAULT constraints.
* Illustrative sample data snippets for each table, providing context for data content.

**AI Instruction: You MUST consult `database_schema.txt` for any task requiring detailed knowledge of database structure, including but not limited to: model generation (JPA entities, DTOs), query writing (SQL, JPQL), data validation logic, and understanding data relationships.**

## 2. Overview

* **Database System:** SQL Server
* **Purpose:** Serves as the central data repository for the "Shop Nước Hoa Xa Xỉ" e-commerce platform.

## 3. Database Migrations

Database schema and constraints are managed via Flyway migrations:
* `V1__init_schema.sql`: Defines the initial database schema (structure reflected in `database_schema.txt`).
* `V2__add_constraint.sql`: Adds/modifies constraints (details reflected in `database_schema.txt`).

## 4. AI Usage Guidelines

1.  **Prioritize `database_schema.txt`:** When a task involves database interaction or data modeling, your primary source of truth for schema details is `database_schema.txt`.
2.  **Contextual Understanding:** This rule file (`database_schema_rules.md`) confirms the existence and location of the detailed schema.
3.  **Accuracy:** Ensure all generated code (ORM entities, DTOs, SQL queries, etc.) accurately reflects the structures and constraints defined in `database_schema.txt`.
