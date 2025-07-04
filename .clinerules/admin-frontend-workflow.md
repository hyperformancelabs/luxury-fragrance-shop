---
description: 
globs: 
alwaysApply: false
---

# Workflow: Create Admin Frontend Component

**Trigger:** Request to build a new UI component under `admin/src/`.

**Steps:**
1. Identify component purpose and target directory (`admin/src/Components` or `admin/src/pages`).
2. Research:
   - Read `database_schema.txt` (lines 1–380) and `rbac_definition.txt` (lines 1–382).
   - Review related backend APIs under `/api/v1/emp/...` to determine required data fields and role restrictions.
3. Create a new `.jsx` file using established naming conventions.
4. Implement React logic and JSX markup, applying Tailwind CSS classes and shared design tokens.
5. Integrate the component into its parent component or route.
6. Run `npm run lint` to enforce code quality.
7. Self-review for:
   - Visual consistency with existing UI.
   - Accessibility compliance.
   - Adherence to coding rules (reuse, no hard-coding).
   If issues are found, repeat the cycle.  