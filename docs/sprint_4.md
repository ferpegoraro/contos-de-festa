# Sprint 4 - CRUD de Kits (PRIORIDADE)

**Período:** Semana 4  
**Foco:** Catálogo completo de kits de festa

## Tarefas

### Backend - Rotas

- [ ] `GET /kits` - Listar todos os kits (público)
- [ ] `GET /kits/:slug` - Detalhes de um kit (público)
- [ ] `POST /kits` - Criar kit (admin)
- [ ] `PUT /kits/:id` - Atualizar kit (admin)
- [ ] `DELETE /kits/:id` - Remover kit (admin)

### Backend - Categorias

- [ ] `GET /categories` - Listar categorias
- [ ] `POST /categories` - Criar categoria (admin)
- [ ] `PUT /categories/:id` - Atualizar categoria (admin)
- [ ] `DELETE /categories/:id` - Remover categoria (admin)

### Backend - Imagens

- [ ] Instalar `@fastify/multipart` para upload
- [ ] Configurar Cloudinary para armazenamento
- [ ] `POST /kits/:id/images` - Upload de imagens
- [ ] `DELETE /kits/:id/images/:imageId` - Remover imagem

### Backend - Estrutura SOLID

```
api/src/
├── http/controllers/
│   ├── kits/
│   │   ├── create-kit.controller.ts
│   │   ├── list-kits.controller.ts
│   │   ├── get-kit.controller.ts
│   │   ├── update-kit.controller.ts
│   │   └── delete-kit.controller.ts
│   └── categories/
│       └── ...
├── use-cases/
│   ├── kits/
│   │   ├── create-kit.ts
│   │   ├── list-kits.ts
│   │   └── ...
│   └── categories/
│       └── ...
├── repositories/
│   ├── kits-repository.ts
│   └── categories-repository.ts
```

### Frontend - Páginas Públicas

- [ ] Página de listagem de kits (`/kits`)
- [ ] Página de detalhes do kit (`/kits/[slug]`)
- [ ] Componente `KitCard` reutilizável
- [ ] Filtros por categoria
- [ ] Busca por nome
- [ ] Paginação

## Critérios de Conclusão

- [ ] CRUD completo de kits funcionando
- [ ] CRUD de categorias funcionando
- [ ] Upload de imagens funcionando
- [ ] Listagem pública com filtros
