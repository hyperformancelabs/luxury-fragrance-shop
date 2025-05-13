---
trigger: always_on
---

# Rule: AI Interaction, Principles & Constraints - Luxury Fragrance Shop

These rules govern how you, the AI, should generally approach tasks, report issues, and optimize interactions, complementing specific development workflows.

## 1. General Principles
* **Rule Adherence:** Strictly follow all provided rule files relevant to the current task (e.g., `project_overview_rules.md`, `coding_style_rules.md`, `security_rules.md`, etc.).
* **Proactive Clarification:** If requirements are unclear, or if rules seem to conflict or are insufficient for the task, ask for clarification *before* extensive implementation.
* **Contextual Awareness:** Maintain awareness of the overall project goals, architecture, and the specific instructions within active workflows (e.g., `/developFrontendFeature`, `/developBackendFeature`) when making decisions.

## 2. Iterative Work Loop Guidelines
* For standard frontend development tasks, refer to and follow the **`/developFrontendFeature` workflow**.
* For standard backend development tasks, refer to and follow the **`/developBackendFeature` workflow**.
* These workflows provide detailed step-by-step guidance for analysis, implementation, and verification.

## 3. Reporting and Debugging
If you encounter an issue that you cannot resolve after reasonable attempts within an iteration of a workflow:
1.  **Report Comprehensively:** Provide a detailed report including:
    * Clear description of the issue and the workflow step where it occurred.
    * HTTP status code and full logs (if applicable, especially for backend).
    * The `curl` command used and its full response (if applicable).
    * Your root cause analysis (best guess).
    * Detailed debug steps and fixes attempted.
    * Specific rules or requirements that might be conflicting or unclear.
2.  **Perseverance (but with limits):** Continue troubleshooting and retesting as guided by the workflow. However, if stuck after multiple (e.g., 2-3) well-documented failed iterations on the *same specific sub-problem within a workflow step*, clearly state this and await further guidance rather than consuming excessive resources.

## 4. Optimization Rules for AI Interaction
1.  **Minimize Credit Usage / Focused Interaction:** Aim to understand the task and relevant rules/workflows fully to handle coding, testing, and fixing efficiently within the defined workflow steps.
2.  **Prioritize Quick Tests:** As part of workflow verification steps, use quick, targeted tests (like `curl` for specific API changes) before suggesting full application runs or extensive UI testing, especially during backend development.
3.  **Leverage Integrated Tools:** If the Windsurf environment provides integrated terminals, test runners, or debug consoles, utilize them as instructed or where obviously beneficial within workflow execution.
4.  **Avoid Unnecessary Intermediate Steps:**
    * Follow the structured steps within the active workflow. Do not propose high-level plans if the task is straightforward and covered by existing rules and the active workflow.
    * Do not ask for feedback on every minor sub-step unless essential for clarification or if a rule/workflow step explicitly requires it (e.g., proposing a significant architectural change). Proceed with implementation if rules, requirements, and workflow guidance are clear.

## 5. Critical Constraints
* **Configuration Files:** **Do not modify critical configuration files** like `application.properties` or `SecurityConfig.java` (especially the security rules within it) **without prior explicit approval and clear justification for that specific change.** If a workflow step suggests such a change is needed, propose the change first and await confirmation.
* **Task Completion:** Do not consider a task or workflow complete until its primary goal is confirmed to be functional (e.g., API returns `200 OK` and correct data, UI renders and functions as expected), or you have exhausted reasonable attempts within the workflow and have reported comprehensively as per section 3.
* **Authentication/Authorization:** Always follow and correctly implement authentication and API security setup as defined in `security_rules.md` and `rbac_definition_rules.md` (and `rbac_definition.txt`).
