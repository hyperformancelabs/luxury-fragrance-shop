---
trigger: model_decision
description: Activate for tasks involving Spring Boot backend API development, RESTful service creation, controller/service/repository logic, DTO design, or API testing for 'Luxury Fragrance Shop'.
---

# Rule: Backend API Development (Spring Boot) - Luxury Fragrance Shop

This rule applies to all development tasks concerning the Spring Boot backend and RESTful APIs.
**Always use in conjunction with:** `project_overview_rules.md`, `database_schema_rules.md` (and `database_schema.txt`), `security_rules.md`, `coding_style_rules.md`, and `development_workflow_rules.md`.

## 1. Backend Project Structure
Refer to the `backend/` section in `project_overview_rules.md`. Key directories:
* `src/main/java/com/hyperformancelabs/backend/`
    * `config/`: Core configuration (Spring, Security, API prefix, etc.).
    * `controller/`: API controllers (request handling, route definitions).
    * `dto/`: Data Transfer Objects (request/response payloads, validation).
    * `exception/`: Custom exception classes and global exception handling.
    * `model/`: JPA Entities (data models mapped to DB tables, align with `database_schema.txt`).
    * `repository/`: Spring Data JPA repositories (database interaction).
    * `service/`: Business logic layer.
    * `util/`: Utility classes.
* `src/main/resources/`
    * `application.properties`: Core application, API, and DB configurations.
    * `db/migration/`: Flyway database migration scripts.

## 2. API Design & Implementation

### 2.1. RESTful Conventions
* Follow RESTful principles for API design (standard HTTP methods: GET, POST, PUT, DELETE, PATCH).
* Use clear, noun-based resource paths (e.g., `/api/v1/products`, `/api/v1/users/{userId}/orders`).
* Global API prefix (`/api/v1`) is defined in `ApiConfig.java` and applied via `WebConfig.java`.

### 2.2. Data Transfer Objects (DTOs)
* Use DTOs for request and response payloads to decouple API contracts from internal models (JPA Entities).
* Apply validation annotations (e.g., `@NotBlank`, `@NotNull`, `@Email`, `@Size`) on request DTOs.
    * *Concise Example DTO:*
        ```java
        // Example: ProductCreateRequest.java
        public class ProductCreateRequest {
            @NotBlank String name;
            @NotNull @Positive BigDecimal price;
            // ... other fields, getters, setters
        }
        ```
* Design response DTOs to provide essential information to the frontend, avoiding over/under-fetching.

### 2.3. Controllers (`controller/`)
* Keep controllers lean: request/response handling, input validation, delegation to services.
* Use Spring MVC annotations: `@RestController`, `@RequestMapping`, `@GetMapping`, etc.
* Document API endpoints using Springdoc/Swagger annotations (`@Operation`, `@Parameter`, etc.).

### 2.4. Services (`service/`)
* Implement core business logic.
* Use `@Transactional` where appropriate.
* Interact with repositories for data access.

### 2.5. Repositories (`repository/`)
* Extend Spring Data JPA interfaces (e.g., `JpaRepository`).
* Define custom query methods as needed.

### 2.6. Error Handling (`exception/`)
* Use a global exception handler (`@ControllerAdvice`).
* Define custom exceptions for business logic errors (e.g., `ResourceNotFoundException`).
* Return appropriate HTTP status codes (400, 401, 403, 404, 500).
    * *Concise Example Custom Exception:*
        ```java
        // Example: ResourceNotFoundException.java
        public class ResourceNotFoundException extends RuntimeException {
            public ResourceNotFoundException(String message) { super(message); }
        }
        ```

## 3. Performance & Scalability
* **Database Queries:** Optimize (beware N+1 problems; use JOIN FETCH/Entity Graphs). Write efficient queries.
* **Caching:** Consider Spring Cache for frequently accessed, rarely changing data.
* **Asynchronous Operations:** Use `@Async` or message queues for long-running, non-immediate tasks.
* **Suitability and Flexibility:** Propose justified deviations from standard structure if it significantly improves performance or suitability, prioritizing maintainable and performant solutions.

## 4. Code Quality & Structure
* **Adherence to Structure:** Strictly follow defined project structure. Seek approval for significant structural changes.
* **Clean Code:** Write readable, maintainable code (see `coding_style_rules.md`).
* **Reusability:** Design reusable services and utilities.
* **No Hardcoding:** Use `application.properties` or environment variables for configurations.
* **Suitability and Flexibility:** Solutions should be consistent yet flexible for future needs. Propose well-reasoned alternatives if standard patterns don't fit.

## 5. API Testing
* Thoroughly test APIs (e.g., `curl`, Postman).
* Verify: HTTP methods, paths, payloads, headers, status codes.
* Test authentication/authorization (see `security_rules.md`).
    * *Example `curl`:* `curl -X POST -H "Content-Type: application/json" -H "Auth: Bearer <token>" -d '{"name":"Test"}' http://localhost:8080/api/v1/example`

## 6. General API Development Flow (Guideline)
When creating or modifying APIs, generally consider these layers:
1.  **Model/Entity (`model/`)**: Define or update data structure.
2.  **DTOs (`dto/`)**: Design data transfer objects for API requests and responses.
3.  **Repository (`repository/`)**: Define data access methods.
4.  **Service (`service/`)**: Implement business logic, transactions, and data manipulation.
5.  **Controller (`controller/`)**: Expose endpoints, handle requests/responses, validate input, and call services.
6.  **Security (`SecurityConfig.java`)**: Update access rules if necessary.
7.  **Testing**: Thoroughly test the implemented API.