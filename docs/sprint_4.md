# Sprint 4 - Catálogo de Kits + WhatsApp

**Foco:** Listagem pública dos kits e sistema de orçamento via WhatsApp

## Tarefas

### Página de Kits (`/kits`)

- [ ] Grid de cards com todos os kits
- [ ] Filtro por categoria
- [ ] Busca por nome
- [ ] Paginação
- [ ] Loading skeleton enquanto carrega

### Página de Detalhes do Kit (`/kits/[slug]`)

- [ ] Galeria de fotos (carrossel)
- [ ] Nome, descrição completa, preço
- [ ] Lista de itens inclusos no kit
- [ ] Botão "Adicionar ao Orçamento"
- [ ] Sugestão de kits relacionados (mesma categoria)

### Sistema de Orçamento via WhatsApp

- [ ] Componente `QuoteCart` (carrinho de orçamento)
  - Ícone flutuante com contador de itens
  - Drawer/modal com lista dos itens selecionados
  - Botão de remover item
  - Botão "Enviar Orçamento via WhatsApp"
- [ ] Gerar link WhatsApp com mensagem pré-montada
- [ ] Context do React para manter estado entre páginas
- [ ] Variável `NEXT_PUBLIC_WHATSAPP_NUMBER`

### Componentes

- [ ] `KitCard` — Card de kit para listagem
- [ ] `ImageCarousel` — Galeria de fotos do kit
- [ ] `CategoryFilter` — Filtro de categorias
- [ ] `QuoteCart` — Carrinho de orçamento flutuante

## Critérios de Conclusão

- [ ] Catálogo com filtros e busca funcionando
- [ ] Detalhes do kit com galeria de fotos
- [ ] Sistema de orçamento via WhatsApp completo
- [ ] Tudo responsivo e bonito no mobile
