# Sprint 5 - CRUD de Cursos

**Período:** Semana 5  
**Foco:** Plataforma de cursos online

## Tarefas

- [ ] Implementar rotas no Fastify:
  - [ ] `GET /api/cursos` - Listar cursos disponíveis
  - [ ] `GET /api/cursos/:id` - Detalhes do curso com módulos
  - [ ] `POST /api/cursos` - Criar curso (admin)
  - [ ] `PUT /api/cursos/:id` - Atualizar curso (admin)
  - [ ] `DELETE /api/cursos/:id` - Remover curso (admin)
- [ ] Implementar rotas de módulos e aulas:
  - [ ] `POST /api/cursos/:id/modulos` - Adicionar módulo
  - [ ] `POST /api/modulos/:id/aulas` - Adicionar aula
- [ ] No front-end:
  - [ ] Página de listagem de cursos (`/cursos`)
  - [ ] Página de detalhes do curso (`/cursos/[id]`)
  - [ ] Componente de card de curso
  - [ ] Preview do conteúdo (módulos visíveis, aulas bloqueadas)
- [ ] Integrar player de vídeo (YouTube embed ou Vimeo)

## Critérios de Conclusão

- [ ] CRUD de cursos funcionando
- [ ] Estrutura de módulos e aulas criada
- [ ] Página de curso exibindo conteúdo
