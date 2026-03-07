# Sprint 4 - Painel Admin + Upload de Imagens

**Período:** Semana 4  
**Foco:** Interface admin para gerenciar kits e upload de fotos no Cloudinary

## Tarefas

### Backend - Upload de Imagens

- [ ] Instalar `@fastify/multipart` para receber arquivos
- [ ] Criar conta no Cloudinary e configurar variáveis de ambiente
- [ ] `POST /kits/:id/images` - Upload de imagens (envia pro Cloudinary e salva URL no banco)
- [ ] `DELETE /kits/:id/images/:imageId` - Remover imagem (remove do Cloudinary e do banco)
- [ ] `PUT /kits/:id/images/reorder` - Reordenar imagens e definir imagem principal

### Frontend - Layout Admin

- [ ] Layout de admin com sidebar de navegação (`/admin`)
- [ ] Header mostrando nome do usuário logado
- [ ] Proteção de rota (se não for ADMIN, redireciona pro login)

### Frontend - Gestão de Kits

- [ ] Página `/admin/kits` - Lista de todos os kits
  - [ ] Tabela com foto principal, nome, preço e categoria
  - [ ] Botões de editar e excluir
  - [ ] Busca por nome
- [ ] Página `/admin/kits/new` - Criar novo kit
  - [ ] Formulário com: nome, descrição, tema, preço, categoria
  - [ ] Upload de múltiplas imagens com preview
  - [ ] Escolher qual imagem é a principal
  - [ ] Adicionar itens do kit (nome + quantidade)
- [ ] Página `/admin/kits/[id]/edit` - Editar kit existente

### Frontend - Gestão de Categorias

- [ ] Página `/admin/categories` - Lista de categorias
- [ ] Modal para criar e editar categoria (nome, slug, ícone)

### Componentes Reutilizáveis

- [ ] `DataTable` - Tabela com busca
- [ ] `ImageUpload` - Upload de imagens com preview
- [ ] `KitForm` - Formulário de kit
- [ ] `CategoryForm` - Formulário de categoria

## Critérios de Conclusão

- [ ] Admin consegue criar, editar e excluir kits com fotos
- [ ] Admin consegue gerenciar categorias
- [ ] Upload de imagens para Cloudinary funcionando
- [ ] Interface admin responsiva e funcional
