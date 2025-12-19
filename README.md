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
- SQLite (banco de dados)
- JWT para autenticacao
- Multer para upload de arquivos

### Frontend
- React 18
- React Router DOM
- Axios
- React Toastify
- React Icons

## Como Executar

### Backend

```bash
cd backend
npm install
npm run seed  # Cria banco e dados iniciais
npm run dev   # Inicia servidor em modo desenvolvimento
```

O servidor iniciara na porta 5000.

### Frontend

```bash
cd frontend
npm install
npm start
```

O frontend iniciara na porta 3000.

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
├── backend/
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
    └── src/
        ├── components/     # Componentes reutilizaveis
        ├── contexts/       # Context API (Auth)
        ├── pages/          # Paginas da aplicacao
        └── services/       # Servicos de API
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
