# Sprint 9 - Preço e Itens por Tipo de Kit ✅ Concluído

**Foco:** Mudança no modelo de negócio — o preço e os itens inclusos passam a pertencer ao **Tipo de Kit**; o kit (tema) herda ambos, com preço promocional opcional.

> Spec: [docs/superpowers/specs/2026-06-04-preco-itens-por-tipo-design.md](./superpowers/specs/2026-06-04-preco-itens-por-tipo-design.md)
> Plano: [docs/superpowers/plans/2026-06-04-preco-itens-por-tipo.md](./superpowers/plans/2026-06-04-preco-itens-por-tipo.md)

## Como funciona

- **Tipo de Kit** (Kit Básico, Kit de Mesa...): tem `price` e lista de itens inclusos (arco, pano...). Todos os kits do tipo herdam.
- **Kit** (Kit Princesa, Kit Safari...): é só o tema — nome, fotos, descrição, categoria. Pode ter `priceOverride` (promoção); `null` herda do tipo.
- **Preço efetivo** = `kit.priceOverride ?? kitType.price` — calculado no backend e exposto no campo `price` de sempre, então o site público não mudou.

## Tarefas

### Banco

- [x] `kit_types.price` (backfill com o preço do primeiro kit de cada tipo)
- [x] Tabela `kit_type_items` (cascade no delete do tipo)
- [x] `kits.price` → `kits.price_override` (nullable; existentes = NULL, herdam)
- [x] `kit_items` removida
- [x] Migração `20260604120000_price_items_per_kit_type` aplicada sem drift

### Backend

- [x] `KitType` entity: `price` + `items` (reusa o VO `KitItem`)
- [x] `Kit` entity: `priceOverride` + getter `price` efetivo + `toJSON` com `price` calculado
- [x] Repositórios (interfaces, mappers com `kitTypeInclude`, Prisma com transaction de substituição de itens, in-memory)
- [x] Use cases: kit-types com price/items (update substitui a lista inteira); kits com priceOverride (null limpa)
- [x] Controllers Zod: `POST/PUT /kit-types` exigem/aceitam `price` + `items`; kits trocam `price` por `priceOverride` nullish
- [x] Testes: 104 unit/e2e + 13 integração com Postgres real — todos verdes

### Frontend

- [x] Types: `KitType.price/items`, `Kit.priceOverride` (mantém `price` efetivo)
- [x] `KitTypeForm`: campo de preço + editor de itens dinâmico (react-hook-form + useFieldArray)
- [x] `KitForm`: sem itens; "Preço promocional" opcional com hint do preço do tipo selecionado; lista somente-leitura dos itens do tipo
- [x] Tabela de tipos: colunas Preço e Itens inclusos
- [x] Tabela de kits: preço efetivo + badge "Promo" quando override ativo
- [x] Detalhe público (`/kits/[slug]`): "Itens inclusos" lê `kit.kitType.items` com quantidade (×2)

### Validação

- [x] Fluxo manual via API: tipo com preço+itens → kit herda (price 199.9, itens ok) → promo 149.9 → limpa promo volta a herdar → tipo muda pra 250 → kit acompanha
- [x] `next build` de produção passa
- [x] `docs/guia_admin.md` atualizado com o novo fluxo

## Pós-migração (atenção da admin)

- O tipo **"Kit de Mesa"** ficou com preço R$ 0 (não tinha kits) — definir o preço real no painel.
- Itens que antes eram por kit **não migraram** — recadastrar nos Tipos de Kit.

---

## Adendo — Catálogo de Itens ✅

Os itens deixaram de ser texto livre e viraram um **catálogo reutilizável**:

- [x] Tabela `items` (nome único) + `kit_type_items` referenciando `item_id` (migração `20260604150000_items_catalog`, com seed dos nomes existentes e dedupe)
- [x] Entity `Item` + `KitItem` VO com `itemId` (nome desnormalizado para exibição)
- [x] `ItemsRepository` (Prisma + in-memory com `countUsages`)
- [x] Use cases: create (nome único), list, update (rename propaga), delete (bloqueado se em uso → 409)
- [x] Rotas `/items` (GET público, CRUD admin) + validação de `itemId` nos kit-types
- [x] Admin: seção **Itens** (tabela + modal), card no dashboard, nav na sidebar
- [x] `KitTypeForm`: itens agora são **selecionados** do catálogo (dropdown + quantidade), com aviso quando o catálogo está vazio
- [x] Testes: 117 unit/e2e + 16 integração — verdes; fluxo manual validado via API (duplicado 409, delete em uso 409, rename propagando para os tipos)
