# Testing Workestra Portal Web

## Overview
The Portal Web is a Next.js 14 frontend (`apps/portal-web/`) that serves as the corporate platform shell. It uses mock data (no backend required for frontend testing).

## Devin Secrets Needed
None — the Portal Web runs entirely with mock data and no authentication.

## Setup

```bash
# Install dependencies (from repo root)
npm install

# Start dev server
npm run dev -w apps/portal-web
# Runs on http://localhost:3000
```

Verify the server is up: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` should return `200`.

## Page Routes & What to Test

| Route | Page | Key Interactive Elements |
|---|---|---|
| `/` | Home | 4 stat cards, 4 quick action cards, pending tasks list, recent requests, recent documents, comunicados, favoritos |
| `/tasks` | Central de Tarefas | Search input, status filter dropdown, priority filter dropdown, 8 task rows with SLA progress bars |
| `/requests` | Solicitações | Tab navigation (Todas/Em andamento/Pendentes/Concluídas), search input, 7 request rows |
| `/documents` | Documentos | Drag-and-drop upload zone, list/grid view toggle, search input, breadcrumb, 10 items (4 folders + 6 files) |
| `/processes` | Processos | 6 process definitions with stat cards, action buttons (Visualizar/Indicadores/Configurar) |
| `/portals` | Portais | 4 portal cards with Visualizar/Editar buttons |
| `/communities` | Comunidades | 4 community cards with member/post counts |
| `/admin` | Administração | 10 admin section cards with detailed statistics |

## Shell Layout (All Pages)
- **Sidebar**: 8 nav items, collapsible via "Recolher" button at bottom or hamburger menu in topbar
- **Topbar**: Breadcrumb ("Workestra / {page}"), global search, "Nova solicitação" button, notifications bell, help button, user avatar "US"
- Sidebar collapse hides text labels, badges, and section labels (Gestão, Sistema); shows only icons
- "Central de Tarefas" nav item has a badge showing "12"

## Testing Tips

### Filters & Search
- Tasks page: Search filters by task title. Priority filter is a `<select>` with options: Todas as prioridades, Crítica, Alta, Média, Baixa. Status filter: Todos os status, Pendente, Em andamento, Atrasado.
- Documents page: Search filters by document name across both folders and files.
- Requests page: Tabs filter by status category. The counts in tab labels (e.g., "Todas (7)") should match the filtered row count.

### View Toggles
- Documents page has list/grid toggle buttons (List and Grid icons) next to the search bar.

### SLA Indicators (Tasks Page)
- Green: SLA < 80%
- Yellow: SLA 80-99%
- Red: SLA >= 100% (overdue)
- TSK-004 is a good test case for overdue (110% SLA)

### Mock Data Counts
- Home: 12 Tarefas Pendentes, 8 Solicitações Abertas, 5 Concluídas Hoje, 3 SLA em Risco
- Tasks: 8 total (5 pending, 2 in progress, 1 overdue)
- Requests: 7 total (3 in progress, 1 pending, 2 completed, 1 cancelled)
- Documents: 10 total (4 folders + 6 files)
- Processes: 6 definitions
- Portals: 4 portals
- Communities: 4 communities
- Admin: 10 sections

## Common Issues
- The dev server might take a few seconds to compile on first page visit — wait for it.
- If `npm run dev` fails, try `npm install` first to ensure dependencies are installed.
- The app uses CSS variables from `packages/ui-tokens/` — if styles look wrong, check that the workspace dependency is properly linked.
