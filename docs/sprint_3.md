# Sprint 3 - Autenticação

**Período:** Semana 3  
**Foco:** Sistema de login e registro (admin para gestão de kits)

## Tarefas

### Backend

- [ ] Instalar dependências: `bcryptjs`
- [ ] Criar `api/src/lib/prisma.ts` - Cliente Prisma
- [ ] Criar `api/src/env/index.ts` - Validação de variáveis com Zod
- [ ] Implementar rotas de autenticação:
  - [ ] `POST /auth/register` - Registro de usuário
  - [ ] `POST /auth/login` - Login com JWT
  - [ ] `POST /auth/logout` - Logout (invalidar token)
  - [ ] `GET /auth/me` - Dados do usuário logado
- [ ] Criar middleware de verificação de JWT
- [ ] Criar middleware de verificação de role (ADMIN)
- [ ] Implementar validação de dados com Zod

### Frontend

- [ ] Criar página de login (`/login`)
- [ ] Criar página de registro (`/register`)
- [ ] Criar contexto de autenticação (AuthContext)
- [ ] Implementar proteção de rotas no front
- [ ] Criar hook `useAuth` para gerenciar estado

### Estrutura de Pastas (Backend)

```
api/src/
├── http/
│   └── controllers/
│       └── auth/
│           ├── register.controller.ts
│           ├── login.controller.ts
│           └── me.controller.ts
├── use-cases/
│   └── auth/
│       ├── register.ts
│       └── authenticate.ts
├── repositories/
│   └── users-repository.ts
```

## Critérios de Conclusão

- [ ] Usuário consegue se registrar e fazer login
- [ ] Rotas protegidas bloqueiam acesso sem token
- [ ] Admin consegue acessar rotas administrativas
