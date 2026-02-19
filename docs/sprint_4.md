# Sprint 4 - CRUD de Kits

**Período:** Semana 4  
**Foco:** Catálogo de kits de peg and monte

## Tarefas

- [ ] Implementar rotas no Fastify:
  - [ ] `GET /api/kits` - Listar todos os kits
  - [ ] `GET /api/kits/:id` - Detalhes de um kit
  - [ ] `POST /api/kits` - Criar kit (admin)
  - [ ] `PUT /api/kits/:id` - Atualizar kit (admin)
  - [ ] `DELETE /api/kits/:id` - Remover kit (admin)
- [ ] Configurar upload de imagens (Cloudinary ou S3)
- [ ] Criar plugin Fastify para upload de arquivos (`@fastify/multipart`)
- [ ] No front-end:
  - [ ] Página de listagem de kits (`/kits`)
  - [ ] Página de detalhes do kit (`/kits/[id]`)
  - [ ] Componente de card de kit reutilizável
  - [ ] Filtros por categoria/preço
- [ ] Implementar busca de kits por nome
- [ ] Adicionar paginação na listagem

## Critérios de Conclusão

- [ ] CRUD completo funcionando
- [ ] Imagens sendo salvas e exibidas
- [ ] Listagem com filtros e paginação
