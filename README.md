# Workestra

**Plataforma corporativa unificada** para gestão de processos, documentos, tarefas e integrações.

Inspirada na proposta funcional do Fluig, com UX própria, operação self-hosted e deploy via Portainer.

## Arquitetura

```
[Usuário]
   │
   ▼
[Portal Web] ── Next.js 14 (React 18)
   │
   ▼
[Platform API] ── NestJS 10 + Prisma
   │
   ├──▶ [PostgreSQL] ── Main Database + Full-text Search
   ├──▶ [LDAP] ── Authentication & User/Group Sync
   ├──▶ [MinIO] ── Object Storage (Documents)
   ├──▶ [Tika] ── Content Extraction
   ├──▶ [OpenSearch] ── Advanced Search (optional)
   ├──▶ [Camunda 8] ── Zeebe Workflow Engine (optional)
   ├──▶ [Web Push] ── VAPID Push Notifications
   └──▶ [SMTP] ── Email Notifications

[Platform Worker] ── Background Jobs
   │
   ├──▶ Notifications (email, push, SLA alerts)
   ├──▶ Indexing (OpenSearch + Tika)
   ├──▶ Dataset Sync (REST, SQL, SOAP, ERP)
   ├──▶ Workflow Timers
   └──▶ Integration Webhooks
```

## Estrutura do Monorepo

```
apps/
  portal-web/          # Next.js - Frontend corporativo
  platform-api/        # NestJS - API principal (16 módulos)
  platform-worker/     # Node.js - Processamento assíncrono
packages/
  ui-tokens/           # Design tokens e paleta visual
  shared-types/        # Tipos TypeScript compartilhados
  workflow-schema/     # Schemas de workflow/BPMN
infra/
  portainer/
    env/               # Variáveis de ambiente
    stacks/            # Docker Compose para Portainer
docs/                  # Documentação
```

## Stack Tecnológica

| Componente | Tecnologia |
|---|---|
| Frontend | Next.js 14 + React 18 + SWR |
| Backend API | NestJS 10 + Prisma ORM |
| Worker | Node.js + Bull queues |
| Database | PostgreSQL 16 |
| Authentication | LDAP + JWT (bcryptjs) |
| Workflow Engine | Camunda 8 / Zeebe (optional) |
| Object Storage | MinIO |
| Search | PostgreSQL full-text (+ OpenSearch optional) |
| Content Extraction | Apache Tika |
| Cache/Queue | Redis 7 |
| Push Notifications | web-push (VAPID) |
| Validation | Zod |

## Início Rápido

### Pré-requisitos

- Node.js >= 20
- Docker & Docker Compose
- Portainer (para deploy em produção)

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Gerar cliente Prisma e rodar migrations
cd apps/platform-api
npx prisma generate
npx prisma db push
cd ../..

# Executar o portal web em modo dev
npm run dev:portal

# Executar a API em modo dev
npm run dev:api

# Executar o worker em modo dev
npm run dev:worker

# Build de todos os projetos
npm run build

# Lint
npm run lint

# Type check
npm run typecheck
```

### Gerar VAPID keys (push notifications)

```bash
npx web-push generate-vapid-keys
# Adicione VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY ao .env.local
```

### Deploy com Docker (Portainer)

```bash
# Copiar variáveis de ambiente
cp .env.example infra/portainer/stacks/.env

# Subir a stack
cd infra/portainer/stacks
docker compose up -d
```

#### Ordem de Inicialização

1. PostgreSQL
2. Redis
3. OpenSearch (optional)
4. MinIO
5. Tika (optional)
6. Zeebe (optional)
7. Platform API
8. Platform Worker
9. Portal Web

## Funcionalidades

### Portal Web
- **Login** — Autenticação LDAP ou credenciais locais
- **Home** — Dashboard com pendências, solicitações recentes, documentos, favoritos, comunicados
- **Central de Tarefas** — Inbox com filtros por status, prioridade e SLA
- **Solicitações** — Criar, acompanhar e gerenciar solicitações (workflows)
- **Documentos** — Upload drag-and-drop, biblioteca (lista/grid), preview, versionamento, download
- **Processos** — Definições de processos, instâncias ativas
- **Kanban** — Quadros com colunas, cards, drag-and-drop, responsáveis
- **Portais** — Páginas internas
- **Comunidades** — Colaboração
- **Busca Global** — Documentos, tarefas, solicitações, processos, usuários
- **Administração** — Dashboard do sistema, status dos serviços, gestão de grupos/portais/comunidades
- **Notificações** — Sino com contagem, push notifications via service worker

### Platform API (16 Módulos)
- `auth` — Login LDAP + JWT, sessão, /me endpoint
- `users` — Gestão de usuários com sincronização LDAP
- `home` — Dashboard personalizado, favoritos
- `permissions` — ACL e controle de acesso funcional
- `tasks` — Central de tarefas com filtros e SLA
- `requests` — Solicitações com número sequencial e histórico
- `workflows` — Definições de processos
- `forms` — Formulários dinâmicos (campos JSON)
- `documents` — ECM/GED (MinIO + PostgreSQL + Tika), upload, versionamento, preview, download
- `datasets` — Interface unificada de dados (REST, SQL interno)
- `integrations` — Integrações externas (Mattermost, Google Chat, webhooks)
- `notifications` — Notificações + web-push (VAPID)
- `search` — Busca global cross-entity
- `audit` — Log de auditoria
- `admin` — Dashboard administrativo, status do sistema, gestão de recursos
- `kanban` — Quadros, colunas, cards com drag-and-drop

### Platform Worker (Jobs)
- Envio de e-mails e notificações push
- Indexação de documentos (Tika + OpenSearch)
- Sincronização de datasets
- Timers de SLA e escalação
- Webhooks de integração

## Princípios

1. O usuário final **não acessa** diretamente Camunda ou MinIO — toda UX é entregue pelo Portal Web
2. Autenticação via **LDAP + JWT** (sem dependência de Keycloak)
3. O módulo de Datasets é uma **interface padronizada** de consulta de dados
4. Documentos usam MinIO para binários, PostgreSQL para metadados/ACL, Tika para extração
5. Push notifications reais via **VAPID/web-push** com service worker
6. Todos os endpoints retornam dados reais do banco — **zero mocks, zero stubs**

## Variáveis de Ambiente

Consulte `.env.example` para a lista completa de variáveis configuráveis.

### Variáveis obrigatórias
- `DATABASE_URL` — Conexão PostgreSQL
- `REDIS_URL` — Conexão Redis
- `JWT_SECRET` — Segredo para tokens JWT

### Variáveis opcionais
- `LDAP_URL`, `LDAP_BIND_DN`, `LDAP_BIND_PASSWORD`, `LDAP_SEARCH_BASE` — Autenticação LDAP
- `MINIO_*` — Armazenamento de documentos
- `VAPID_*` — Push notifications
- `TIKA_URL` — Extração de conteúdo
- `OPENSEARCH_URL` — Busca avançada
- `ZEEBE_ADDRESS` — Workflow engine
- `SMTP_*` — Email

## Licença

Proprietário - Uso interno corporativo.
