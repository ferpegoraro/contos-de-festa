# Sprint 3 - Auth Admin + CRUD de Kits

**Período:** Semana 3  
**Foco:** Login admin com chave secreta e CRUD completo de kits e categorias

## Tarefas

### Backend - Configuração

- [ ] Instalar `bcryptjs` para hash de senhas
- [ ] Criar `api/src/env/index.ts` com validação de variáveis de ambiente usando Zod
- [ ] Adicionar variável `ADMIN_SECRET_KEY` no `.env` (chave secreta para criar admins)

### Backend - Autenticação

- [ ] `POST /auth/register` - Registro de admin (exige chave secreta no body)
- [ ] `POST /auth/login` - Login com JWT
- [ ] `GET /auth/me` - Dados do usuário logado
- [ ] Middleware de verificação de JWT
- [ ] Middleware de verificação de role ADMIN

> **Como funciona o registro:** A rota recebe nome, email, senha e uma `secretKey`. O backend compara essa chave com a variável de ambiente `ADMIN_SECRET_KEY`. Se bater, cria o admin. Se não, recusa. Assim qualquer novo admin pode ser criado pelo front sem mexer no código.

### Backend - CRUD de Kits

- [ ] `GET /kits` - Listar kits (público)
- [ ] `GET /kits/:slug` - Detalhes do kit (público)
- [ ] `POST /kits` - Criar kit (admin)
- [ ] `PUT /kits/:id` - Atualizar kit (admin)
- [ ] `DELETE /kits/:id` - Remover kit (admin)

### Backend - CRUD de Categorias

- [ ] `GET /categories` - Listar categorias (público)
- [ ] `POST /categories` - Criar categoria (admin)
- [ ] `PUT /categories/:id` - Atualizar categoria (admin)
- [ ] `DELETE /categories/:id` - Remover categoria (admin)

### Backend - Estrutura de Pastas

```
api/src/
├── env/
│   └── index.ts
├── http/
│   ├── middlewares/
│   │   ├── verify-jwt.ts
│   │   └── verify-role.ts
│   └── controllers/
│       ├── auth/
│       ├── kits/
│       └── categories/
├── use-cases/
│   ├── auth/
│   ├── kits/
│   └── categories/
├── repositories/
│   ├── users-repository.ts
│   ├── kits-repository.ts
│   └── categories-repository.ts
├── lib/
│   └── prisma.ts
├── app.ts
└── server.ts
```

### Frontend - Login

- [ ] Página `/login` com formulário de email e senha
- [ ] Página `/admin/register` com formulário de nome, email, senha e campo "Código de Acesso"
- [ ] Contexto de autenticação (AuthContext)
- [ ] Hook `useAuth` para gerenciar estado de login
- [ ] Proteção de rotas admin (redirecionar se não logado)

## Critérios de Conclusão

- [ ] Admin consegue se registrar usando a chave secreta
- [ ] Admin consegue fazer login
- [ ] CRUD de kits funcionando via API
- [ ] CRUD de categorias funcionando via API
- [ ] Rotas admin protegidas por JWT + role
