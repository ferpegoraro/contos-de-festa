# Sprint 8 - CRUD de Cursos

**Período:** Semana 8  
**Foco:** Plataforma de cursos online (Fase 2)

> **Fase 2:** Site já está no ar com kits. Agora vamos adicionar os cursos.

## Tarefas

### Backend - Rotas de Cursos

- [ ] `GET /courses` - Listar cursos publicados (público)
- [ ] `GET /courses/:slug` - Detalhes do curso (público)
- [ ] `POST /courses` - Criar curso (admin)
- [ ] `PUT /courses/:id` - Atualizar curso (admin)
- [ ] `DELETE /courses/:id` - Remover curso (admin)

### Backend - Rotas de Módulos

- [ ] `POST /courses/:id/modules` - Adicionar módulo (admin)
- [ ] `PUT /modules/:id` - Atualizar módulo (admin)
- [ ] `DELETE /modules/:id` - Remover módulo (admin)
- [ ] `PUT /modules/reorder` - Reordenar módulos (admin)

### Backend - Rotas de Aulas

- [ ] `POST /modules/:id/lessons` - Adicionar aula (admin)
- [ ] `PUT /lessons/:id` - Atualizar aula (admin)
- [ ] `DELETE /lessons/:id` - Remover aula (admin)
- [ ] `PUT /lessons/reorder` - Reordenar aulas (admin)

### Backend - Estrutura SOLID

```
api/src/
├── http/controllers/
│   ├── courses/
│   ├── modules/
│   └── lessons/
├── use-cases/
│   ├── courses/
│   ├── modules/
│   └── lessons/
├── repositories/
│   ├── courses-repository.ts
│   ├── modules-repository.ts
│   └── lessons-repository.ts
```

### Frontend - Páginas Públicas

- [ ] Atualizar página `/courses` (remover "Em breve")
- [ ] Página de detalhes do curso (`/courses/[slug]`)
- [ ] Componente `CourseCard` reutilizável
- [ ] Preview do conteúdo (módulos visíveis, aulas bloqueadas)

### Frontend - Admin

- [ ] Página `/admin/courses` - Lista de cursos
- [ ] Página `/admin/courses/new` - Criar curso
- [ ] Página `/admin/courses/[id]/edit` - Editar curso
- [ ] Gestão de módulos e aulas com drag-and-drop

## Critérios de Conclusão

- [ ] CRUD de cursos funcionando
- [ ] CRUD de módulos funcionando
- [ ] CRUD de aulas funcionando
- [ ] Reordenação funcionando
