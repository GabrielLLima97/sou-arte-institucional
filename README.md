# Sou Arte em Cuidados - Sistema Institucional

Site institucional + portal do socio + portal administrativo, com frontend em Next.js, backend em FastAPI e banco MySQL. Tudo empacotado em Docker.

## Visao geral
- Site institucional com captacao via WhatsApp e email.
- Portal do Socio com comunicados, cursos, links operacionais e informacoes de plano de saude.
- Portal Administrativo para gestao de usuarios, comunicados, cursos e beneficios.

## Tecnologias
- Frontend: Next.js 14 + React + Tailwind CSS
- Backend: FastAPI + SQLAlchemy
- Banco: MySQL 8
- Infra: Docker + Docker Compose

## Estrutura do projeto
```
sou-arte-institucional/
  app/                         # Rotas do Next.js (site e portais)
    portal-admin/              # Portal Administrativo
    portal-socio/              # Portal do Socio
  backend/
    app/                       # API FastAPI (auth, CRUD, schemas)
    schema.sql                 # Schema base
  components/                  # Componentes reutilizaveis
  public/                      # Assets publicos (logos, imagens)
  docker-compose.yml           # Orquestracao local
```

## Portas locais
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- MySQL: localhost:3307 (docker exposto -> 3306 interno)

## Usuarios e acesso inicial
No primeiro start, o backend cria o usuario admin com base nas variaveis:
- ADMIN_EMAIL (default: admin@souarte.com)
- ADMIN_PASSWORD (default: admin123)
- ADMIN_NAME (default: Administrador)

## Variaveis de ambiente (Docker)
Ja configuradas em `docker-compose.yml`:
- DATABASE_URL
- JWT_SECRET
- CORS_ORIGINS
- ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME
- NEXT_PUBLIC_API_BASE_URL

Recomendado trocar `JWT_SECRET` e `ADMIN_PASSWORD` antes de publicar.

## Subir com Docker
```bash
docker compose up -d --build
```

Para parar:
```bash
docker compose down
```

## Funcionalidades principais
### Site institucional
- Secoes institucionais (sobre, servicos, clientes, cidades, associados, contato)
- Captacao via WhatsApp e email

### Portal do Socio
- Comunicados internos (carrossel + modal detalhado)
- Cursos e treinamentos
- Pega plantao (link externo)
- Antecipacao (link externo)
- Plano de saude (informacoes e link)
- Beneficios (em breve)

### Portal Administrativo
- Gestao de usuarios (criar, editar, resetar senha, excluir)
- Importacao em massa via Excel (modelos para criar e excluir)
- Gestao de comunicados (com prazo de exibicao)
- Gestao de cursos (imagem + link)
- Gestao de beneficios (parceiros)

## Banco de dados (tabelas)
- users
- announcements
- courses
- portal_links
- partners

## Observacoes
- O frontend consome a API via `NEXT_PUBLIC_API_BASE_URL`.
- O backend expõe documentacao em: http://localhost:8000/docs

