# Chronos Insight

Build ChronosGraph — a production-grade web app for a Multi-Agent Temporal RAG system with conflict detection over a knowledge graph. This is a chat-based AI assistant (similar to ChatGPT/Claude's UI patterns) but organized around "Workspaces" (like ChatGPT Projects) and built specifically to show users when retrieved facts are outdated or contradict each other.

Build this as a proper multi-page app using React Router, with real distinct routes — not a single page with tabs or modals swapping content. Each screen should be its own route/page component.

## Routes

- /login — Login page

- /signup — Sign up page

- / — Workspace picker if the user has no active workspace, otherwise redirect to their last active workspace

- /workspace/:workspaceId — Chat view (default page when entering a workspace)

- /workspace/:workspaceId/chat/:chatId — A specific chat thread

- /workspace/:workspaceId/ingestion — Ingestion Dashboard

- /workspace/:workspaceId/conflicts — Conflict Review Queue

- /workspace/:workspaceId/conflicts/:conflictId — Conflict Inspector (its own full page with a graph visualization, not a modal)

- /workspace/:workspaceId/entity/:entityId — Entity Timeline View (its own full page)

- /workspace/:workspaceId/audit-log — Audit Log

- /settings — Admin/Settings

- /settings/profile — User profile settings

The sidebar (Workspaces/Chats list) and top navigation persist across all /workspace/* routes as a shared layout (layout route pattern) — switching between Chat, Ingestion, Conflicts, etc. navigates to a new URL rather than swapping tab content.

## Authentication Pages

### /login

- Clean, centered card layout (Linear/Notion style) — logo/product name at top, email + password fields, "Log In" button, "Forgot password?" link, "Don't have an account? Sign up" link at the bottom

- A visual "Continue with Google" / SSO-style button placeholder (doesn't need to be functional)

- Subtle error state for invalid credentials (mock validation is fine)

### /signup

- Centered card layout — full name, email, password, confirm password fields, "Create Account" button

- No role selector here — roles are assigned by an Admin after signup, not self-selected. New users land in a "pending/limited access" state until an Admin assigns them a role and workspace (realistic for an enterprise tool handling sensitive documents)

- Link back to /login for existing users

- After login/signup, redirect to the workspace picker (if no workspaces yet) or last active workspace

## Workspace Picker (/)

- Grid or list of workspace cards the user has access to: name, document count, conflict-count badge

- "+ Create New Workspace" card/button

- Clicking a workspace navigates to /workspace/:workspaceId

## Shared Sidebar (persists across all /workspace/* routes)

- "+ New Workspace" button at top

- List of Workspaces (e.g. "Legal Docs", "Medical Records", "HR Policies"), each collapsible/expandable, with a conflict-count badge (small red circle with number) if it has unresolved contradictions

- Under each expanded Workspace, its Chats (e.g. "Contract renewals", "Compliance deadlines") with "+ New Chat" starting a fresh thread scoped to that workspace

- Chats support rename, delete, archive via a hover context menu

- Global search bar at top of sidebar, searching workspace names and chat content

- Bottom of sidebar: user avatar with role badge (Analyst / Steward / Admin) linking to /settings/profile

## Shared Top Navigation (within a workspace, persists across /workspace/:workspaceId/* routes)

- Nav links to Chat, Ingestion Dashboard, Conflict Review Queue, Audit Log — visible based on role (Analyst sees mainly Chat; Steward/Admin see all)

## Page: Chat / Query Interface (/workspace/:workspaceId and /workspace/:workspaceId/chat/:chatId)

- Chat interface, message bubbles for user questions and AI answers

- AI answer cards include:

  - Generated answer text with numbered inline citation markers [1] [2] etc.

  - Collapsible "Evidence & Timeline" section below the answer: source documents, each with a timestamp/validity window

  - If the answer touches a fact with a known or historical contradiction, a clearly visible amber/orange warning badge inline in the answer card: "⚠ Conflicting information exists for this fact" with a "View details" link that navigates to the relevant /workspace/:workspaceId/conflicts/:conflictId page — must be visible directly in the answer, not hidden in a separate tab

- Input box at bottom with send button, plus a collapsed/expandable filter row above it (date range, source type, entity type), hidden by default

- Empty state for a new chat: friendly prompt suggestions, e.g. "What's our current sick leave policy?"

## Page: Ingestion Dashboard (/workspace/:workspaceId/ingestion) — Steward/Admin role

- Drag-and-drop upload zone (PDF, DOCX, XLSX, images)

- Per-document status list/table (not a single spinner). Columns: filename, status badge, uploaded date. Status progresses: Queued → Parsing → Extracting Entities → Resolving Against Existing Graph → Auditing Affected Neighborhood → Complete / Failed (error reason shown on hover for failed items)

- Explicit incremental-update messaging, e.g. "Found 3 new facts, 2 updated facts, auditing 15 affected nodes for conflicts" — reads as updating an existing graph, never a full rebuild

- Summary banner: "X new contradictions detected since your last visit," linking to the Conflict Review Queue

## Page: Conflict Review Queue (/workspace/:workspaceId/conflicts) — Steward/Admin role

- List/card view of detected contradictions. Each card shows:

  - The two conflicting facts side by side, each with source document name and time-validity window (valid_from / valid_to)

  - LLM-suggested resolution with a confidence score (progress bar or percentage)

  - High-confidence items: "Auto-resolved" badge (still clickable to review/override)

  - Low-confidence items: prominent "Needs your review" badge, with Accept / Override / Escalate buttons

  - "View full conflict graph" link navigating to /workspace/:workspaceId/conflicts/:conflictId

## Page: Conflict Inspector (/workspace/:workspaceId/conflicts/:conflictId) — full page

- Interactive node-graph visualization (force-directed style): the entity in question and its connected facts as nodes

- Color coding: green = currently valid, red = superseded/contradicted, gray = under review

- Horizontal timeline slider at the bottom — dragging it highlights which facts were "active" at that point in time

- Clicking a node opens a side panel: source document snippet, extraction timestamp, full metadata

## Page: Entity Timeline View (/workspace/:workspaceId/entity/:entityId)

- Horizontal timeline for one entity (e.g. "Sick Leave Policy") showing each historical version as a labeled block along the time axis

- Overlapping blocks (contradictions) visually flagged with a red connector or overlap highlight

- Clicking a block shows the fact detail and source

## Page: Audit Log (/workspace/:workspaceId/audit-log) — Steward/Admin role

- Searchable, filterable table: timestamp, entity, conflicting facts summary, resolution (auto/human), resolved by (user or "system"), status

- Filters for date range, workspace, resolution type

## Page: Settings (/settings) — Admin role

- User & role management table (Analyst / Steward / Admin)

- Workspace management (create/archive workspaces, per-workspace access control)

- System health panel: ingestion queue length, background auditor status ("last full sweep completed 2 hours ago"), simple status indicators (green/yellow/red)

## Page: Profile (/settings/profile)

- Basic account info, name/email edit, password change, role display (read-only, set by Admin)

## Roles (use mock role-switching for demo purposes)

- Analyst: Chat + Timeline + Evidence Inspector (read-only)

- Steward: everything Analyst has + Ingestion Dashboard + Conflict Review Queue + Audit Log

- Admin: everything + Settings/user management

## Visual style

- Professional, trustworthy, clean — this handles legal/medical/compliance documents, avoid playful or overly colorful styling. Think Linear, Notion, or Vercel dashboard aesthetics: neutral grays/whites, one confident accent color (blue or teal), amber/red reserved strictly for conflict/warning states

- Support both light and dark mode

- Clear, readable typography — data-heavy, trust-sensitive product, not a marketing site

- Honest, calibrated micro-copy — never overconfident. Use "no known conflicts" and "current best evidence" rather than "verified" or "guaranteed accurate"

## Data

Use realistic mock/sample data throughout (sample workspaces: Legal Docs, Medical Records, HR Policies; sample chats and conflicting facts, e.g. a sick-leave policy changing from 10 to 15 days between 2022 and 2026) so the app is fully demoable without a real backend. Structure mock data so it would map cleanly to a future Neo4j/FastAPI backend (entities, relationships, valid_from/valid_to fields, contradiction edges) — clean, typed data models even in mock form.

## Priority build order

1. Login / Signup pages + auth flow (mock)

2. Sidebar + top nav shared layout + Workspace Picker

3. Chat interface with conflict badge in answers

4. Conflict Review Queue + Conflict Inspector page

5. Ingestion Dashboard with per-document status

6. Entity Timeline View

7. Audit Log + Settings/Profile pages

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://conflict-cognition.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6715e1ab-0e22-499f-8a56-03a969db2fe6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
