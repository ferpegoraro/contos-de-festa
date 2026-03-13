# Sprint 5 - Painel Admin (Frontend)

**Foco:** Interface admin para a proprietária gerenciar kits e categorias

## Tarefas

### Layout Admin

- [ ] Sidebar de navegação (`/admin`)
- [ ] Header com nome do usuário logado
- [ ] Proteção de rota (se não logado, redireciona pro login)
- [ ] Layout responsivo (sidebar vira menu mobile)

### Autenticação (Frontend)

- [ ] Página `/login` — formulário de email e senha
- [ ] Página `/admin/register` — formulário com nome, email, senha e código de acesso
- [ ] AuthContext para gerenciar estado de login
- [ ] Hook `useAuth`

### Gestão de Kits

- [ ] Página `/admin/kits` — Lista de todos os kits
  - Tabela com foto, nome, preço, categoria
  - Botões editar e excluir
  - Busca por nome
- [ ] Página `/admin/kits/new` — Criar novo kit
  - Formulário: nome, descrição, tema, preço, categoria
  - Upload de múltiplas imagens com preview
  - Escolher imagem principal
  - Adicionar itens do kit (nome + quantidade)
- [ ] Página `/admin/kits/[id]/edit` — Editar kit existente

### Gestão de Categorias

- [ ] Página `/admin/categories` — Lista de categorias
- [ ] Modal para criar e editar categoria (nome, slug, ícone)

### Componentes Admin

- [ ] `DataTable` — Tabela com busca
- [ ] `ImageUpload` — Upload de imagens com preview
- [ ] `KitForm` — Formulário de kit
- [ ] `CategoryForm` — Formulário de categoria

## Critérios de Conclusão

- [ ] Admin consegue navegar pelo painel
- [ ] Formulários de CRUD completos e funcionais (frontend)
- [ ] Upload de imagens com preview (sem Cloudinary ainda)
- [ ] Interface responsiva
- [ ] Dados mockados prontos pra conectar com API
