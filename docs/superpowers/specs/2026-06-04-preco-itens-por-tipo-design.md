# Design — Preço e itens inclusos por Tipo de Kit

**Data:** 2026-06-04
**Status:** Aprovado pelo Fernando

## Objetivo

O preço e a lista de itens inclusos deixam de pertencer ao kit individual e passam a ser definidos no **Tipo de Kit** (Kit Básico, Kit de Mesa...). Todos os kits de um tipo herdam preço e itens. O kit pode, opcionalmente, ter um **preço promocional** que sobrescreve o do tipo.

## Decisões (confirmadas com o usuário)

1. **Itens**: existem **apenas no tipo**. O kit individual não tem itens próprios nem extras.
2. **Preço**: herda do tipo, **com exceção opcional por kit** (`priceOverride`, ex.: promoção). Preço efetivo = `kit.priceOverride ?? kitType.price`.
3. **Abordagem**: herança computada no backend (A). A API devolve o preço efetivo no campo `price` que já existe — consumidores públicos não quebram.

## Modelo de dados (Prisma)

```
KitType
  + price      Decimal           (obrigatório)
  + items      KitTypeItem[]     (nova tabela: id, kitTypeId, name, quantity?)

Kit
  - price      → renomeado para priceOverride, vira Decimal? (nullable)
  - items      → REMOVIDO (tabela kit_items morre)
```

**Migração:**
- `kit_types.price`: backfill com o preço do primeiro kit existente do tipo; `0` se o tipo não tiver kits.
- `kits.price` → `kits.price_override`: kits existentes ficam com `NULL` (passam a herdar do tipo).
- `kit_items`: dropada. (Os itens atuais de kits não migram para o tipo — o admin recadastra no tipo; hoje só há dados de teste.)

## Domínio (api/src)

- `KitType` (entity): ganha `price: number` e `items: KitItem[]` (reusa o Value Object `KitItem` — name + quantity, sem id).
- `Kit` (entity): `priceOverride: number | null`; getter `price` retorna `priceOverride ?? kitType.price` (preço efetivo). Remove `items`.
- Use cases:
  - `CreateKitTypeUseCase` / `UpdateKitTypeUseCase`: aceitam `price` e `items` (update substitui a lista inteira, mesmo padrão do que existia em kits).
  - `CreateKitUseCase` / `UpdateKitUseCase`: `price` vira `priceOverride` opcional; deixam de aceitar `items`.
- Repositórios (interface + Prisma + in-memory) acompanham.

## API (controllers)

- `POST/PUT /kit-types`: body ganha `price` (nonnegative) e `items[]` opcionais.
- `GET /kit-types`: resposta inclui `price` e `items`.
- `POST/PUT /kits`: `price` sai do schema; entra `priceOverride` (nonnegative, nullish).
- Serialização do kit (`toJSON`): expõe `price` (efetivo), `priceOverride` e `kitType { price, items }`.

## Frontend

**Tipos (`src/types/kit.ts`):** `KitType` ganha `price` e `items`; `Kit` ganha `priceOverride`, mantém `price` (efetivo, vindo da API); `KitItem` sem mudança.

**Admin:**
- `KitTypeForm` (modal): + campo preço, + editor de itens dinâmico (migrado do `KitForm`).
- `KitForm`: remove seção de itens; campo de preço vira opcional — "Preço promocional — deixe vazio para usar o preço do tipo (R$ X)", mostrando o preço do tipo selecionado.
- Tabela de tipos: coluna de preço.
- Tabela de kits: preço efetivo, com indicação visual quando é promocional (override ativo).

**Público:**
- Card, detalhe, carrinho e mensagem do WhatsApp: continuam lendo `kit.price` (agora efetivo) — sem mudança visual.
- Detalhe do kit: "Itens inclusos" lê de `kit.kitType.items`.

## Testes

- Unit: specs de kit-types (price/items, substituição da lista), kits (priceOverride, preço efetivo), entity `Kit` (getter efetivo).
- E2E: rotas de kit-types com price/items; kits sem items no body.
- Integração (Postgres real): atualizar specs dos repositórios para o novo schema.

## Fora de escopo

- Migrar itens de kits existentes para os tipos (recadastro manual).
- Agrupamento/filtro do catálogo por tipo.
- Histórico de preços / promoções com validade.

---

## Adendo (2026-06-04, aprovado): Catálogo de Itens

Os itens deixam de ser texto livre por tipo e viram um **catálogo reutilizável**:

- Nova tabela `items` (`id`, `name` único) com CRUD próprio no admin (seção "Itens").
- `kit_type_items` passa a referenciar `item_id` (FK) + `quantity`; coluna `name` morre. Único por (`kit_type_id`, `item_id`).
- Excluir item em uso por algum tipo → bloqueado (`ResourceInUseError`), como categorias.
- No form de Tipo de Kit, o admin **seleciona** o item num dropdown + quantidade.
- Serialização pública mantém `{ name, quantity }` (agora com `itemId` junto) — site público não muda.
- Migração: seed de `items` a partir dos nomes distintos existentes em `kit_type_items`.
