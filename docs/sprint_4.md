# Sprint 4 - Catálogo de Kits + WhatsApp ✅ Concluído

**Foco:** Listagem pública dos kits e sistema de orçamento via WhatsApp

> Todos os componentes e páginas estão prontos. Quando o backend (Sprint 5) estiver pronto, é só substituir os arrays vazios por chamadas à API.

## Tarefas

### Página de Kits (`/kits`)

- [x] Rota criada com tema escuro e estado vazio
- [x] Grid de cards com todos os kits (via `KitCard`)
- [x] Filtro por categoria (via `CategoryFilter`)
- [x] Busca por nome
- [x] Paginação (9 itens por página)
- [x] Loading skeleton enquanto carrega (`KitGridSkeleton`)
- [x] Estado vazio quando não há kits cadastrados
- [x] Estado vazio quando busca/filtro não encontra resultado

### Página de Detalhes do Kit (`/kits/[slug]`)

- [x] Galeria de fotos (carrossel com thumbnails, setas, contador)
- [x] Nome, descrição completa, preço
- [x] Lista de itens inclusos no kit
- [x] Botão "Adicionar ao Orçamento"
- [x] Botão "Perguntar no WhatsApp" (mensagem pré-montada com nome do kit)
- [x] Sugestão de kits relacionados (mesma categoria)
- [x] Estado 404 quando kit não encontrado

### Sistema de Orçamento via WhatsApp

- [x] Componente `QuoteCart` (carrinho de orçamento)
  - Ícone flutuante com contador de itens
  - Drawer com lista dos itens selecionados
  - Botão de remover item
  - Total estimado
  - Botão "Enviar Orçamento via WhatsApp"
  - Botão "Limpar orçamento"
- [x] Gerar link WhatsApp com mensagem pré-montada (lista de kits + preços + total)
- [x] Context do React para manter estado entre páginas (`QuoteProvider`)
- [x] Hook `useQuote` para acessar o carrinho
- [x] Suporte a `NEXT_PUBLIC_WHATSAPP_NUMBER`

### Componentes

- [x] `KitCard` — Card de kit para listagem (imagem, badge categoria, nome, preço, hover)
- [x] `ImageCarousel` — Galeria com setas, thumbnails, contador, estado vazio
- [x] `CategoryFilter` — Pills de categoria com estado ativo
- [x] `QuoteCart` — Carrinho flutuante com drawer
- [x] `KitSkeleton` / `KitGridSkeleton` — Loading states

### Types

- [x] `Kit`, `Category`, `KitImage`, `KitItem` em `src/types/kit.ts`

## Critérios de Conclusão

- [x] Catálogo com filtros e busca funcionando
- [x] Detalhes do kit com galeria de fotos
- [x] Sistema de orçamento via WhatsApp completo
- [x] Tudo responsivo e bonito no mobile

## Arquivos Criados/Modificados

| Arquivo                                     | Ação       | Descrição                                    |
| ------------------------------------------- | ---------- | -------------------------------------------- |
| `src/types/kit.ts`                          | Criado     | Types: Kit, Category, KitImage, KitItem      |
| `src/contexts/quote-context.tsx`            | Criado     | Context + hook do carrinho de orçamento       |
| `src/components/kits/kit-card.tsx`          | Criado     | Card de kit para grid                        |
| `src/components/kits/category-filter.tsx`   | Criado     | Filtro por categoria                         |
| `src/components/kits/image-carousel.tsx`    | Criado     | Galeria de fotos com carrossel               |
| `src/components/kits/quote-cart.tsx`        | Criado     | Carrinho flutuante + drawer                  |
| `src/components/kits/kit-skeleton.tsx`      | Criado     | Loading skeleton do grid                     |
| `src/components/kits/index.ts`              | Criado     | Barrel export                                |
| `src/app/kits/page.tsx`                     | Reescrito  | Catálogo com busca, filtro, paginação        |
| `src/app/kits/[slug]/page.tsx`              | Criado     | Detalhes do kit com galeria e orçamento      |
| `src/app/layout.tsx`                        | Modificado | Adicionou QuoteProvider e QuoteCart          |
