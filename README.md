# Sistema de Gerenciamento Formativo

Sistema completo para gerenciamento de formacao, incluindo cadastro de usuarios, documentos, videos formativos, acompanhamentos, etapas formativas, locais e funcoes.

## Funcionalidades

- **Autenticacao JWT** - Login seguro com tokens
- **Gestao de Usuarios** - Apenas admin pode cadastrar usuarios
- **Formadores e Formandos** - Cada usuario pode ter um formador associado
- **Documentos** - Upload e visualizacao por etapa, pessoa ou local
- **Videos Formativos** - Upload ou URL (YouTube, Vimeo), filtros por etapa/local/pessoa
- **Acompanhamentos** - Relatorios de conversas visiveis apenas pelo formador e formando envolvidos
- **Etapas Formativas** - Organizacao do processo formativo
- **Locais** - Gerenciamento de locais de formacao
- **Funcoes** - Cargos e funcoes dos usuarios

## Tecnologias

### Backend
- Node.js + Express
- Sequelize ORM
- PostgreSQL (banco de dados)
- JWT para autenticacao
- Multer para upload de arquivos
- Docker

### Frontend
- React 18
- React Router DOM
- Axios
- React Toastify
- React Icons
- Nginx (producao)

## Como Executar

### Opcao 1: Docker Compose (Recomendado)

Executa tudo com um unico comando:

```bash
# Subir todos os servicos (PostgreSQL + Backend + Frontend)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicos
docker-compose down
```

Acesse:
- Frontend: http://localhost:3000
- API: http://localhost:5000

### Opcao 2: Desenvolvimento Local

#### 1. Subir apenas o PostgreSQL com Docker

```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### 2. Backend

```bash
cd backend
npm install
npm run seed  # Cria banco e dados iniciais
npm run dev   # Inicia servidor em modo desenvolvimento
```

O servidor iniciara na porta 5000.

#### 3. Frontend

```bash
cd frontend
npm install
npm start
```

O frontend iniciara na porta 3000.

### Opcao 3: PostgreSQL Local (sem Docker)

Se voce ja tem PostgreSQL instalado:

1. Crie o banco de dados:
```sql
CREATE DATABASE sistema_formativo;
```

2. Configure as variaveis de ambiente no arquivo `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_formativo
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

3. Execute o backend normalmente.

## Variaveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```env
PORT=5000
JWT_SECRET=sua_chave_secreta
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_formativo
DB_USER=postgres
DB_PASSWORD=postgres
```

## Credenciais de Acesso

Apos executar o seed, use estas credenciais:

| Usuario | Email | Senha | Perfil |
|---------|-------|-------|--------|
| Admin | admin@sistema.com | admin123 | admin |
| Joao | joao@sistema.com | senha123 | formador |
| Maria | maria@sistema.com | senha123 | formador |
| Pedro | pedro@sistema.com | senha123 | formando |
| Ana | ana@sistema.com | senha123 | formando |
| Carlos | carlos@sistema.com | senha123 | formando |

## Estrutura do Projeto

```
├── docker-compose.yml      # Producao (todos os servicos)
├── docker-compose.dev.yml  # Desenvolvimento (apenas PostgreSQL)
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── config/         # Configuracoes (DB, seed)
│   │   ├── controllers/    # Logica de negocios
│   │   ├── middlewares/    # Auth, upload
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Rotas da API
│   │   └── server.js       # Servidor Express
│   └── uploads/            # Arquivos enviados
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── components/     # Componentes reutilizaveis
        ├── contexts/       # Context API (Auth)
        ├── pages/          # Paginas da aplicacao
        └── services/       # Servicos de API
```

## Comandos Docker Uteis

```bash
# Build e iniciar
docker-compose up -d --build

# Ver logs de um servico especifico
docker-compose logs -f backend

# Acessar shell do container
docker-compose exec backend sh

# Executar seed dentro do container
docker-compose exec backend npm run seed

# Limpar tudo (incluindo volumes)
docker-compose down -v
```

## API Endpoints

### Autenticacao
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario atual
- `PUT /api/auth/change-password` - Alterar senha

### Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Criar usuario
- `PUT /api/users/:id` - Atualizar usuario
- `DELETE /api/users/:id` - Desativar usuario

### Documentos
- `GET /api/documents` - Listar (filtros: etapa, local, pessoa)
- `POST /api/documents` - Criar (upload)
- `GET /api/documents/:id/download` - Download

### Videos
- `GET /api/videos` - Listar (filtros: etapa, local, pessoa)
- `POST /api/videos` - Criar (upload ou URL)
- `GET /api/videos/:id/stream` - Streaming

### Acompanhamentos
- `GET /api/acompanhamentos` - Listar (somente proprios)
- `POST /api/acompanhamentos` - Criar
- `GET /api/acompanhamentos/formando/:id` - Por formando

### Auxiliares
- `/api/funcoes` - CRUD de funcoes
- `/api/locais` - CRUD de locais
- `/api/etapas-formativas` - CRUD de etapas

## Permissoes

| Recurso | Admin | Formador | Formando |
|---------|-------|----------|----------|
| Usuarios | CRUD | Leitura | Leitura |
| Documentos | CRUD | CRUD | Leitura |
| Videos | CRUD | CRUD | Leitura |
| Acompanhamentos | Todos | Proprios | Proprios |
| Funcoes/Locais/Etapas | CRUD | Leitura | Leitura |

## Licenca

MIT
