# Sprint 5 - Painel Admin (Kits)

**Período:** Semana 5  
**Foco:** Interface de gestão de kits para admin

## Tarefas

### Frontend - Layout Admin

- [ ] Criar layout de admin separado (`/admin`)
- [ ] Sidebar com navegação
- [ ] Header com dados do usuário logado
- [ ] Proteção de rota (verificar role ADMIN)

### Frontend - Dashboard

- [ ] Página `/admin` com métricas:
  - [ ] Total de kits cadastrados
  - [ ] Kits disponíveis vs alugados
  - [ ] Próximos aluguéis agendados
  - [ ] Categorias mais populares

### Frontend - Gestão de Kits

- [ ] Página `/admin/kits` - Lista de kits
  - [ ] Tabela com nome, status, preço, categoria
  - [ ] Botões de editar/excluir
  - [ ] Filtros e busca
- [ ] Página `/admin/kits/new` - Criar kit
  - [ ] Formulário com todos os campos
  - [ ] Upload de múltiplas imagens
  - [ ] Seleção de categoria
  - [ ] Adicionar itens do kit
- [ ] Página `/admin/kits/[id]/edit` - Editar kit

### Frontend - Gestão de Categorias

- [ ] Página `/admin/categories` - Lista de categorias
- [ ] Modal de criar/editar categoria

### Componentes

- [ ] `DataTable` - Tabela reutilizável com paginação
- [ ] `ImageUpload` - Upload de imagens com preview
- [ ] `KitForm` - Formulário de kit
- [ ] `CategoryForm` - Formulário de categoria

## Critérios de Conclusão

- [ ] Admin consegue criar/editar/excluir kits
- [ ] Admin consegue gerenciar categorias
- [ ] Upload de imagens funcionando
- [ ] Dashboard exibindo métricas
