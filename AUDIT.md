# Workestra — Audit Report

## Summary

**Every single backend service is a stub.** All 14 API modules return empty arrays or hardcoded fake responses. Zero Prisma integration exists — no service connects to the database. The entire frontend uses inline hardcoded mock data — no API calls are made. The worker has zero real job implementations.

---

## Backend Services (ALL 14 are stubs)

| Service | Status | Details |
|---------|--------|---------|
| `auth` | ❌ STUB | Returns null. Keycloak placeholder code, no real auth |
| `users` | ❌ STUB | Returns empty arrays. `syncFromKeycloak()` returns `{ synced: 0 }` |
| `permissions` | ❌ STUB | `checkPermission()` always returns `true` |
| `tasks` | ❌ STUB | Returns empty arrays. 5 TODOs for Camunda integration |
| `requests` | ❌ STUB | Returns empty arrays. TODO for Camunda process start |
| `workflows` | ❌ STUB | Returns empty arrays. 5 TODOs for Zeebe/Operate |
| `forms` | ❌ STUB | Returns empty arrays. TODO for persistence |
| `documents` | ❌ STUB | Returns empty arrays. 6 TODOs for MinIO/Tika/OpenSearch |
| `datasets` | ❌ STUB | Returns empty arrays. 4 TODOs for data source queries |
| `integrations` | ❌ STUB | Returns empty arrays. No real logic |
| `notifications` | ❌ STUB | Returns empty arrays. TODO for SMTP |
| `search` | ❌ STUB | Returns empty arrays. 5 TODOs for OpenSearch |
| `audit` | ❌ STUB | Returns empty arrays. TODO for PostgreSQL persistence |
| `admin` | ❌ STUB | Returns hardcoded fake status (`keycloak: 'connected'`, etc.) |

## Frontend Pages (ALL 8 use hardcoded data)

| Page | Hardcoded Items |
|------|----------------|
| Home | 4 stats, 5 tasks, 4 requests, 3 documents, 2 announcements, 3 favorites |
| Tasks | 8 task objects with fake SLA percentages |
| Requests | 7 request objects with fake statuses |
| Documents | 4 folders + 6 files, all fake. Upload does nothing |
| Processes | 6 process definitions with fake instance counts |
| Portals | 4 portal objects |
| Communities | 4 community objects |
| Admin | 10 admin sections with fake counts (156 users, 12 groups, etc.) |

## Worker (ALL jobs are stubs)

- `notification-job.ts` — 4 TODOs, no real email/notification logic
- `indexing-job.ts` — 6 TODOs, no MinIO/Tika/OpenSearch connection
- `dataset-sync-job.ts` — 6 TODOs, no data source sync
- `workflow-timer-job.ts` — 3 TODOs, no SLA/timer logic
- `integration-webhook-job.ts` — 2 TODOs, no HTTP calls
- `scheduler-manager.ts` — 4 TODOs, empty cron bodies
- `worker-app.ts` — 4 TODOs, no connections to Redis/PG/MinIO/OpenSearch

## Infrastructure to Remove

- **Keycloak** service in docker-compose (57 references across codebase)
- **Traefik** proxy service in docker-compose (5 references)
- All Keycloak env vars in `.env.example` and `infra/portainer/env/.env.example`
- Keycloak references in README.md, admin page, auth/users services, prisma schema

## Total TODO Count: 60+

---

## Replacement Plan

### 1. Remove Keycloak/Traefik/Nginx
- Delete services from docker-compose
- Remove all env vars
- Clean code references
- Update README

### 2. LDAP Authentication
- Implement `ldapjs` adapter for bind/search
- JWT session with `jsonwebtoken` + `passport`
- User/group sync from LDAP to PostgreSQL
- Login endpoint, session management, auth guards

### 3. Database Layer (Prisma)
- Create PrismaModule/PrismaService for NestJS
- Update schema (remove `keycloakId`, add LDAP fields, add push subscription, kanban models)
- Generate migrations
- Wire all services to use Prisma

### 4. Real API Services
- Every service gets real CRUD with Prisma
- Proper pagination, filtering, error handling
- Audit logging on mutations

### 5. Documents (MinIO)
- Real upload to MinIO via `minio` SDK
- Metadata persistence in PostgreSQL
- Version management
- Download via presigned URLs
- Tika content extraction for search

### 6. File Preview
- PDF: presigned URL served to `<iframe>` / PDF.js
- DOCX: server-side conversion via `libreoffice` or Tika HTML extraction
- XLSX: server-side conversion or parsed preview
- TXT: direct content display
- Images: direct `<img>` display
- Fallback: download button

### 7. Push Notifications
- Service worker registration on frontend
- VAPID key generation
- Subscription persistence in PostgreSQL
- `web-push` library for server-side dispatch
- Notification bell UI with real data

### 8. Kanban
- Board/column/card models in Prisma
- Drag-and-drop frontend with `@dnd-kit`
- Real persistence of card positions
- Link cards to process instances and assignees

### 9. Frontend Rewiring
- API client service with `fetch`
- React Query or SWR for data fetching
- Loading skeletons, error states, empty states
- Success toast notifications
- Remove all inline hardcoded data arrays
