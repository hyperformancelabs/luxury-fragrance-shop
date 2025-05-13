---
trigger: model_decision
description: Activate for developing or modifying the Admin Panel UI (React.js, Vite, Tailwind CSS) including components, pages, services, and state management for 'Luxury Fragrance Shop'.
---

# Rule: Admin User Interface (React.js) - Luxury Fragrance Shop

This rule applies to development tasks for the **Admin Panel UI** (`admin/`).
**Always use in conjunction with:** `project_overview_rules.md`, `coding_style_rules.md`, `development_workflow_rules.md`, and `ai_interaction_rules.md`. For API interaction, refer to `backend_api_rules.md` and `security_rules.md`.

## 1. Project Structure (`admin/`)
* `public/`: Static assets (favicon, `index.html` template).
* `src/`: Main source code.
    * `assets/`: Images, fonts.
    * `components/`: Reusable UI components for the admin panel (PascalCase, e.g., `UserTable.tsx`).
        * `common/`: Generic admin components (e.g., AdminButton, DataGridWrapper).
        * `layout/`: Admin layout components (AdminHeader, AdminSidebar, AdminLayout).
        * *Feature-specific subdirectories (e.g., `userManagement/`, `productManagement/`)*
    * `pages/`: Top-level admin page components (e.g., `DashboardPage.tsx`, `ProductListPage.tsx`).
    * `services/`: API interaction logic (e.g., `adminProductService.ts`, `adminUserService.ts`).
    * `hooks/`: Custom React hooks specific to admin functionality.
    * `context/`: React Context API for admin-specific shared state.
    * `utils/`: Utility functions for the admin panel.
    * `routes/`: Admin route definitions.
    * `App.tsx`: Main admin application component.
    * `main.tsx`: Admin application entry point.
* `tailwind.config.js`: Tailwind CSS configuration (can be same or different from user UI).
* `vite.config.js`: Vite build configuration.

## 2. Coding Standards & Conventions

### 2.1. React
* **Functional Components & Hooks:** Exclusively use functional components with React Hooks.
* **Component Naming:** `PascalCase` (e.g., `OrderDetailsModal.tsx`).
* **File Naming:** `PascalCase.tsx` for components, `camelCase.ts` for non-component files.
* **TypeScript:** Mandatory. Provide explicit type definitions for props, state, function arguments, and return values.
* **State Management:**
    * Prioritize local component state.
    * Use React Context API (`context/`) for shared admin state.
* **Form Handling:**
    * Use controlled components. Implement client-side validation. Libraries like React Hook Form are encouraged for complex admin forms.
* **Event Handlers:** Clear naming (e.g., `handleUserUpdate`, `onFilterChange`).

### 2.2. Styling (Tailwind CSS)
* **Primary Styling:** **Tailwind CSS**.
* **Consistency:** Adhere to the admin panel's established visual theme (colors, typography, spacing) which might differ slightly from the user-facing UI but should be internally consistent.
* **Utility Classes:** Maximize use of Tailwind utilities.
* **Avoid Custom CSS:** Minimize custom CSS. Discuss if Tailwind utilities are insufficient.
* **No Arbitrary New Styles:** Maintain consistency with the existing admin UI's look and feel.

### 2.3. API Interaction (`services/`)
* Centralize API calls in service files.
* Use `async/await`. Implement robust error handling.
* Refer to `backend_api_rules.md` and `security_rules.md`.
* Default backend URL: `http://localhost:8080`.

## 3. UI/UX Design Principles for Admin Panel
* **Efficiency and Clarity:** Design for efficient task completion by administrators. Clarity of information is paramount.
* **Data Density vs. Usability:** Balance the need to display significant data with ease of use. Data tables, filters, and search functionalities are key.
* **Consistency:** Maintain visual and interactive consistency across all admin sections.
* **Logical Flow & Arrangement:**
    * Ensure administrative workflows are intuitive.
    * Arrange forms, tables, and controls logically.
    * Utilize Tailwind's grid and spacing utilities consistently.
* **Responsiveness:** While primarily desktop-focused, ensure usability on smaller tablet screens if feasible.

## 4. Code Quality
* **Clean Code:** (See `coding_style_rules.md`).
    * Write small, single-responsibility components and functions.
* **Reusability:** Design reusable components for common admin UI patterns (e.g., data tables, forms, modals).
* **No Hardcoding:** Use constants or configuration for any non-UI text or settings.