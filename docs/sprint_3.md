# Sprint 3 - Autenticação

**Período:** Semana 3  
**Foco:** Sistema de login e registro

## Tarefas

- [ ] Instalar dependências: `@fastify/jwt`, `@fastify/cookie`, `bcrypt`
- [ ] Criar plugin de autenticação no Fastify
- [ ] Implementar rotas de autenticação:
  - [ ] `POST /api/auth/register` - Registro de usuário
  - [ ] `POST /api/auth/login` - Login com JWT
  - [ ] `POST /api/auth/logout` - Logout (invalidar token)
  - [ ] `GET /api/auth/me` - Dados do usuário logado
- [ ] Criar middleware de proteção de rotas (verificar JWT)
- [ ] Implementar validação de dados com `@sinclair/typebox` ou `zod`
- [ ] No front-end:
  - [ ] Criar página de login (`/login`)
  - [ ] Criar página de registro (`/registro`)
  - [ ] Criar contexto de autenticação (AuthContext)
  - [ ] Implementar proteção de rotas no front
- [ ] Testar fluxo completo: registro → login → acesso autenticado

## Critérios de Conclusão

- [ ] Usuário consegue se registrar e fazer login
- [ ] Rotas protegidas bloqueiam acesso sem token
- [ ] Token persiste entre reloads (cookie httpOnly)
