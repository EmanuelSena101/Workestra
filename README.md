# Workestra

**Plataforma corporativa unificada** para gestão de processos, documentos, tarefas e integrações.

Inspirada na proposta funcional do Fluig, com UX própria, operação self-hosted e deploy via Portainer.

## Arquitetura

```
[Usuário]
   │
   ▼
[Portal Web] ── Next.js (React)
   │
   ▼
[Platform API] ── NestJS
   │
   ├──▶ [Camunda 8] ── Zeebe + Operate + Tasklist
   ├──▶ [Keycloak] ── Identity & SSO
   ├──▶ [MinIO] ── Object Storage
   ├──▶ [PostgreSQL] ── Main Database
   ├──▶ [OpenSearch] ── Full-text Search
   ├──▶ [Tika] ── Content Extraction
   └──▶ [SMTP] ── Email Notifications

[Platform Worker] ── Background Jobs
   │
   ├──▶ Notifications (email, SLA alerts)
   ├──▶ Indexing (OpenSearch + Tika)
   ├──▶ Dataset Sync (REST, SQL, SOAP, ERP)
   ├──▶ Workflow Timers
   └──▶ Integration Webhooks
```

## Estrutura do Monorepo

```
apps/
  portal-web/          # Next.js - Frontend corporativo
  platform-api/        # NestJS - API principal
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
| Frontend | Next.js 14 + React 18 |
| Backend API | NestJS 10 |
| Worker | Node.js |
| Database | PostgreSQL 16 |
| Identity/SSO | Keycloak 24 |
| Workflow Engine | Camunda 8 (Zeebe) |
| Object Storage | MinIO |
| Search | OpenSearch 2.13 |
| Content Extraction | Apache Tika |
| Cache/Queue | Redis 7 |
| ORM | Prisma |
| Validation | Zod |
| Reverse Proxy | Traefik v3 |

## Início Rápido

### Pré-requisitos

- Node.js >= 20
- Docker & Docker Compose
- Portainer (para deploy em produção)

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

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

### Deploy com Docker (Portainer)

```bash
# Copiar variáveis de ambiente
cp infra/portainer/env/.env.example infra/portainer/stacks/.env

# Subir a stack
cd infra/portainer/stacks
docker compose up -d
```

#### Ordem de Inicialização

1. PostgreSQL
2. Redis
3. OpenSearch
4. MinIO
5. Tika
6. Keycloak
7. Zeebe
8. Operate + Tasklist
9. Platform API
10. Platform Worker
11. Portal Web
12. Traefik (Proxy)

## Funcionalidades

### Portal Web
- **Home** — Pendências, solicitações recentes, documentos, atalhos, favoritos, comunicados
- **Central de Tarefas** — Inbox própria com filtros por status, prioridade e SLA
- **Solicitações** — Criar, acompanhar e gerenciar solicitações (workflows)
- **Documentos** — Upload drag-and-drop, biblioteca, preview, versionamento, metadados
- **Processos** — Definições de processos, instâncias ativas, indicadores
- **Portais** — Páginas internas e widgets
- **Comunidades** — Colaboração e troca de conhecimento
- **Administração** — Usuários, permissões, datasets, notificações, auditoria

### Platform API (Módulos)
- `auth` — Autenticação via Keycloak OIDC
- `users` — Gestão de usuários com sincronização Keycloak
- `permissions` — ACL e controle de acesso funcional
- `tasks` — Central de tarefas (integração Camunda)
- `requests` — Solicitações / workflow instances
- `workflows` — Deploy e gestão de processos BPMN
- `forms` — Formulários dinâmicos
- `documents` — ECM/GED (MinIO + PostgreSQL + Tika)
- `datasets` — Interface unificada de dados (REST, SQL, SOAP, ERP)
- `integrations` — Integrações externas e webhooks
- `notifications` — Notificações internas e e-mail
- `search` — Busca global (OpenSearch)
- `audit` — Log de auditoria
- `admin` — Administração funcional

### Platform Worker (Jobs)
- Envio de e-mails e notificações
- Indexação de documentos (Tika + OpenSearch)
- Sincronização de datasets
- Timers de SLA e escalação
- Webhooks de integração

## Princípios

1. O usuário final **não acessa** diretamente Camunda, Keycloak ou MinIO
2. Toda a UX é entregue pelo **Portal Web próprio**
3. A gestão funcional de acesso existe no sistema, não apenas no Keycloak
4. O módulo de Datasets é uma **interface padronizada** de consulta de dados
5. Documentos usam MinIO para binários, PostgreSQL para metadados/ACL, Tika para extração e OpenSearch para busca

## Variáveis de Ambiente

Consulte `infra/portainer/env/.env.example` para a lista completa de variáveis configuráveis.

## Licença

Proprietário - Uso interno corporativo.
