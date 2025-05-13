---
description: Defines a protocol for effectively responding to inquiries regarding the project. It involves leveraging project documentation, codebase analysis, and contextual understanding to provide accurate and relevant information.
---

# Workflow: Project Q&A

**Trigger:** A user question about project details or implementation.

**Steps:**
1. Analyze question to clarify user intent.
2. Research context:
   - Use semantic search in `admin/`, `frontend/`, and `backend/`.
   - Reference `database_schema.txt` (lines 1–380) and `rbac_definition.txt` (lines 1–382).
   - Consult `windsurf_project_rules.md` for conventions and constraints.
3. Synthesize a concise, accurate answer, citing file names or code snippets as needed.
4. If more information is required, ask follow-up questions.
