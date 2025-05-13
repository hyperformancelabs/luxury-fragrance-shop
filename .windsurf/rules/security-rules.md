---
trigger: model_decision
description: Activate when developing/modifying backend APIs, handling security configurations (JWT, CORS, Spring Security), or defining access rules for 'Luxury Fragrance Shop' endpoints.
---

# Rule: Security Configuration & Authorization - Luxury Fragrance Shop

This rule outlines the general security configuration and authorization principles for the backend API.

## Core Security Concepts

* **Framework:** Uses **Spring Security** for handling authentication and authorization.
* **Authentication:** Employs **JWT (JSON Web Tokens)** for authenticating requests. A `JwtFilter` intercepts requests to validate tokens.
* **Session Management:** Configured as **STATELESS**, meaning each request must carry authentication information (JWT token); server-side sessions are not used for security context.
* **CSRF:** Disabled, as it's common for stateless APIs using tokens.
* **Password Encoding:** Uses **BCrypt** for securely hashing passwords.

## Global API Prefix

* A global **API prefix** (e.g., `/api/v1`) is configured via `ApiConfig` and automatically applied to all REST controller paths by `WebConfig`.
* **Important:** All security path matching rules defined in `SecurityConfig.java` **must include this prefix**.

## Authorization Strategy (`SecurityConfig.java`)

* The primary authorization logic resides within the `filterChain` bean in `SecurityConfig.java`.
* **Public Access:** Specific endpoints are explicitly configured using `requestMatchers(...).permitAll()` to allow access **without authentication**. These typically include login/registration, public data retrieval (products, categories), and potentially payment initiation/callbacks.
* **Authenticated Access:** All other endpoints not listed under `permitAll()` fall under `anyRequest().authenticated()` and **require a valid JWT token** for access.

## CORS Configuration

* Cross-Origin Resource Sharing (CORS) is configured via `corsConfigurationSource()` in `SecurityConfig.java` to allow requests specifically from the defined frontend origins (e.g., `http://localhost:5173`).

## **Granting Access for New APIs (IMPORTANT)**

* **Default:** By default, any **new API endpoint** you create will automatically require authentication due to the `anyRequest().authenticated()` rule.
* **Modification Required:** To change the access level for a new API, **you MUST modify `SecurityConfig.java`:**
    * **To make a new API public:** Add its specific path pattern (including the global prefix) to the list within `requestMatchers(...).permitAll()`.
    * **To keep a new API authenticated (default):** No changes are strictly needed if basic authentication is sufficient.
    * **For Role/Permission-Based Access:** Although not explicitly shown in the current basic configuration, if specific role/permission checks are needed later (e.g., using `.hasRole("ADMIN")` or `.hasAuthority("product.create")`), you will need to add these more granular rules within `authorizeHttpRequests` for the relevant endpoints. Refer to `.windsurf/rbac_definition_rules.md` for understanding the defined roles and permissions.

**Key File:** `config/SecurityConfig.java` is the central point for defining and modifying API access rules.