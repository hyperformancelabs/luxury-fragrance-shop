---
trigger: model_decision
description: Activate for developing or modifying the user-facing frontend UI (React.js, Vite, Tailwind CSS) including components, pages, services, and state management for 'Luxury Fragrance Shop'.
---

# Rule: Frontend User Interface (React.js) - Luxury Fragrance Shop (User-Facing)

This rule applies to development tasks for the **user-facing** Frontend UI (`frontend/`).
**Always use in conjunction with:** `project_overview_rules.md`, `coding_style_rules.md`, `development_workflow_rules.md`, and `ai_interaction_rules.md`. For API interaction, refer to `backend_api_rules.md` and `security_rules.md`.

## 1. Project Structure (`frontend/`)
* `public/`: Static assets (favicon, `index.html` template).
* `src/`: Main source code.
    * `assets/`: Images, fonts, global styles (if any beyond Tailwind).
    * `components/`: Reusable UI components (PascalCase, e.g., `ProductCard.tsx`).
        * `common/`: Very generic components (Button, Input, Modal).
        * `layout/`: Structural components (Header, Footer, Sidebar).
        * *Feature-specific subdirectories (e.g., `product/`, `cart/`)*
    * `pages/`: Top-level page components, corresponding to routes (e.g., `HomePage.tsx`, `ProductDetailPage.tsx`).
    * `services/`: API interaction logic (e.g., `productService.ts`, `authService.ts`).
    * `hooks/`: Custom React hooks (e.g., `useAuth.ts`).
    * `context/`: React Context API for global/shared state (e.g., `AuthContext.tsx`, `CartContext.tsx`).
    * `utils/`: Utility functions (formatters, validators).
    * `routes/`: Route definitions.
    * `App.tsx`: Main application component.
    * `main.tsx`: Application entry point.
* `tailwind.config.js`: Tailwind CSS configuration.
* `vite.config.js`: Vite build configuration.

## 2. Coding Standards & Conventions

### 2.1. React
* **Functional Components & Hooks:** Exclusively use functional components with React Hooks.
* **Component Naming:** `PascalCase` (e.g., `ProductGallery.tsx`).
* **File Naming:** `PascalCase.tsx` for components, `camelCase.ts` for non-component files (services, utils, hooks).
* **TypeScript:**
    * Mandatory for all new code.
    * Provide explicit type definitions for props, state, function arguments, and return values. Use interfaces or types as appropriate.
* **State Management:**
    * Prioritize local component state (`useState`, `useReducer`) for component-specific data.
    * For global or shared state (e.g., user authentication, shopping cart, theme), use **React Context API** (`context/`). Avoid prop drilling. For very complex state, discuss potential use of libraries like Zustand or Redux Toolkit.
* **Form Handling:**
    * Use controlled components for forms.
    * Implement client-side validation before submitting data. Libraries like React Hook Form can be considered for complex forms.
* **Event Handlers:** Name event handlers clearly (e.g., `handleInputChange`, `onProductSubmit`).

### 2.2. Styling (Tailwind CSS)
* **Primary Styling:** **Tailwind CSS** is the primary styling framework.
* **Mobile-First:** Design and style with a mobile-first approach.
* **Utility Classes:** Maximize the use of Tailwind's utility classes.
* **Consistency:** Use Tailwind's theme (colors, spacing, typography defined in `tailwind.config.js`) consistently.
* **Avoid Custom CSS:** Minimize writing custom CSS files. If a complex style cannot be achieved with Tailwind utilities, discuss it first. If approved, place it in a relevant component's directory or a global stylesheet if truly global.
* **No Arbitrary New Styles:** Do not introduce new visual styles (colors, fonts, spacing patterns) that deviate from the established theme without explicit discussion and approval. The goal is a cohesive and unified look and feel.

### 2.3. API Interaction (`services/`)
* Centralize API calls in service files (e.g., `productService.ts`).
* Use `async/await` for asynchronous operations.
* Implement robust error handling for API requests.
* Refer to `backend_api_rules.md` and `security_rules.md` for backend endpoint details and authentication.
* Default backend URL: `http://localhost:8080` (ensure prefix from `ApiConfig` is used).

## 3. UI/UX Design Principles
* **Intuitive and User-Friendly:** Prioritize creating interfaces that are easy to understand and navigate.
* **Modern Aesthetics:** Aim for a clean, modern, and visually appealing design.
* **Consistency:**
    * Maintain visual and interactive consistency across all pages and components.
    * Refer to existing pages/components when building new ones to ensure stylistic alignment.
* **Logical Flow & Arrangement:**
    * Ensure business logic is clearly represented in the UI flow.
    * Arrange components logically on the page, ensuring good visual hierarchy, readability, and no overlapping elements.
    * Utilize Tailwind's grid and spacing utilities consistently for harmonious layouts.
* **Simplicity and Clarity:** Prefer simple and clear designs over overly complex ones.
* **Responsiveness:** Ensure all UI elements are fully responsive and adapt gracefully to different screen sizes.

## 4. Code Quality
* **Clean Code:** (See `coding_style_rules.md`).
    * Write small, single-responsibility components and functions.
* **Reusability:** Create generic, reusable components in `components/common/` or feature-specific reusable ones in their respective directories.
* **No Hardcoding:** Avoid hardcoding text, URLs, or configuration. Use constants, environment variables, or internationalization libraries if applicable.
