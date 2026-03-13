# Sprint 6 - Backend (Banco, Auth, API, Upload)

**Foco:** Toda a camada de backend — banco de dados, autenticação e API REST

## Tarefas

### Docker + PostgreSQL

- [ ] Criar `docker-compose.yml` com PostgreSQL 16
- [ ] Testar container
- [ ] Configurar `DATABASE_URL` no `.env`

### Prisma 6

- [ ] Instalar Prisma 6
- [ ] Criar schema (User, Category, Kit, KitImage, KitItem)
- [ ] Rodar migrations
- [ ] Criar `api/src/lib/prisma.ts`

### Autenticação

- [ ] `POST /auth/register` — Registro com chave secreta
- [ ] `POST /auth/login` — Login JWT
- [ ] `GET /auth/me` — Dados do usuário logado
- [ ] Middleware JWT + Role ADMIN

### CRUD de Kits

- [ ] `GET /kits` — Listar kits (público)
- [ ] `GET /kits/:slug` — Detalhes (público)
- [ ] `POST /kits` — Criar (admin)
- [ ] `PUT /kits/:id` — Atualizar (admin)
- [ ] `DELETE /kits/:id` — Remover (admin)

### CRUD de Categorias

- [ ] `GET /categories` — Listar (público)
- [ ] `POST /categories` — Criar (admin)
- [ ] `PUT /categories/:id` — Atualizar (admin)
- [ ] `DELETE /categories/:id` — Remover (admin)

### Upload de Imagens

- [ ] Integrar Cloudinary
- [ ] `POST /kits/:id/images` — Upload
- [ ] `DELETE /kits/:id/images/:imageId` — Remover
- [ ] `PUT /kits/:id/images/reorder` — Reordenar

## Critérios de Conclusão

- [ ] Banco rodando com todas as tabelas
- [ ] API REST completa e testada
- [ ] Auth funcionando com JWT
- [ ] Upload de imagens no Cloudinary
