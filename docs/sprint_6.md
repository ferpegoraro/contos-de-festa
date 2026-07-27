# Sprint 6 - Painel Admin (Frontend) ✅ Concluído

**Foco:** Interface admin para a proprietária gerenciar kits e categorias, conectada à API

## Tarefas

### Layout Admin

- [x] Sidebar de navegação (`/admin`)
- [x] Header com nome do usuário logado
- [x] Proteção de rota (se não logado, redireciona pro login)
- [x] Layout responsivo (sidebar vira menu mobile)

### Autenticação (Frontend)

- [x] Página `/login` — formulário de email e senha
- [x] Página `/admin/register` — formulário com nome, email, senha e código de acesso
- [x] AuthContext para gerenciar estado de login
- [x] Hook `useAuth`

### Gestão de Kits

- [x] Página `/admin/kits` — Lista de todos os kits
  - Tabela com foto, nome, preço, categoria
  - Botões editar e excluir
  - Busca por nome
- [x] Página `/admin/kits/new` — Criar novo kit
  - Formulário: nome, descrição, tema, preço, categoria
  - Upload de múltiplas imagens com preview
  - Escolher imagem principal
  - Adicionar itens do kit (nome + quantidade)
- [x] Página `/admin/kits/[id]/edit` — Editar kit existente

### Gestão de Categorias

- [x] Página `/admin/categories` — Lista de categorias
- [x] Modal para criar e editar categoria (nome, slug, ícone)

### Gestão de Tipos de Kit

- [x] Página `/admin/kit-types` — Lista dos tipos cadastrados (Kit de Mesa, Kit 1, Kit 2, Kit 3, etc.)
  - Tabela com nome e slug
  - Botões editar e excluir
- [x] Modal para criar e editar tipo de kit (nome, slug opcional)
- [x] Slug auto-gerado a partir do nome (consumindo `POST /kit-types`)
- [x] No `KitForm`, dropdown de tipo de kit consumindo `GET /kit-types`

### Componentes Admin

- [x] `DataTable` — Tabela com busca
- [x] `ImageUpload` — Upload de imagens com preview
- [x] `KitForm` — Formulário de kit
- [x] `CategoryForm` — Formulário de categoria
- [x] `KitTypeForm` — Formulário de tipo de kit

### Padrão de Consumo da API

> Antes de espalhar `fetch` pelas páginas, criar a base centralizada. Evita duplicar loading/erro e prepara terreno para a Sprint 8.

- [x] Cliente HTTP em `src/lib/api/client.ts` (baseUrl, header de Auth, tratamento de erro)
- [x] Hooks tipados em `src/hooks/api/`:
  - `useKits(filters)`, `useKit(slug)`
  - `useCategories()`, `useKitTypes()`
- [x] Para mutações (criar/editar/excluir): expor funções que revalidem o cache (hoje via `reload()` do hook — SWR fica para Sprint 8)
- [ ] Formulários do admin com `react-hook-form` + Zod (mesmo schema do backend, importado) — adiado para Sprint 8

## Critérios de Conclusão

- [x] Admin consegue navegar pelo painel
- [x] Formulários de CRUD conectados com a API (Sprint 5)
- [x] Upload de imagens funcionando via Cloudinary
- [x] Admin consegue cadastrar/editar/excluir tipos de kit (Kit de Mesa, Kit 1, Kit 2, Kit 3...) e usá-los no formulário de Kit
- [x] Interface responsiva
