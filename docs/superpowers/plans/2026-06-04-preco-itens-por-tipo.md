# Preço e Itens por Tipo de Kit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preço e itens inclusos passam a ser do Tipo de Kit; o kit herda ambos e pode ter preço promocional (`priceOverride`).

**Architecture:** Herança computada no backend — `KitType` ganha `price` + `items` (VO `KitItem`); `Kit.price` vira `priceOverride` nullable e a serialização expõe `price` efetivo (`priceOverride ?? kitType.price`). Frontend público continua lendo `kit.price`.

**Tech Stack:** Fastify + Prisma + Zod (api), Vitest (unit/e2e/integração), Next.js + SWR (front).

**Spec:** `docs/superpowers/specs/2026-06-04-preco-itens-por-tipo-design.md`

---

### Task 1: Schema Prisma + migração com backfill

**Files:**
- Modify: `api/prisma/schema.prisma`
- Create: `api/prisma/migrations/<timestamp>_price_items_per_kit_type/migration.sql`

- [ ] **Step 1: Atualizar o schema**

No model `KitType`, adicionar `price` e relação `items`; criar model `KitTypeItem`; no model `Kit`, renomear `price` → `priceOverride` (nullable, `@map("price_override")`) e remover `items`; remover o model `KitItem`:

```prisma
model KitType {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  price     Decimal  @db.Decimal(10, 2)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  kits  Kit[]
  items KitTypeItem[]

  @@map("kit_types")
}

model KitTypeItem {
  id        String  @id @default(uuid())
  kitTypeId String  @map("kit_type_id")
  name      String
  quantity  Int?

  kitType KitType @relation(fields: [kitTypeId], references: [id], onDelete: Cascade)

  @@index([kitTypeId])
  @@map("kit_type_items")
}
```

No `Kit`: `priceOverride Decimal? @db.Decimal(10, 2) @map("price_override")` no lugar de `price`, e apagar a linha `items KitItem[]`. Apagar o model `KitItem` inteiro.

- [ ] **Step 2: Gerar migração vazia e escrever o SQL com backfill**

Run: `npm run prisma:migrate -- --name price_items_per_kit_type --create-only`

Substituir o SQL gerado por:

```sql
-- kit_types.price com backfill do primeiro kit de cada tipo
ALTER TABLE "kit_types" ADD COLUMN "price" DECIMAL(10,2) NOT NULL DEFAULT 0;
UPDATE "kit_types" kt SET "price" = COALESCE(
  (SELECT k."price" FROM "kits" k WHERE k."kit_type_id" = kt."id" ORDER BY k."created_at" ASC LIMIT 1), 0);
ALTER TABLE "kit_types" ALTER COLUMN "price" DROP DEFAULT;

-- itens do tipo
CREATE TABLE "kit_type_items" (
  "id" TEXT NOT NULL,
  "kit_type_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "quantity" INTEGER,
  CONSTRAINT "kit_type_items_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "kit_type_items_kit_type_id_idx" ON "kit_type_items"("kit_type_id");
ALTER TABLE "kit_type_items" ADD CONSTRAINT "kit_type_items_kit_type_id_fkey"
  FOREIGN KEY ("kit_type_id") REFERENCES "kit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- kits: price -> price_override (nullable); existentes herdam do tipo
ALTER TABLE "kits" RENAME COLUMN "price" TO "price_override";
ALTER TABLE "kits" ALTER COLUMN "price_override" DROP NOT NULL;
UPDATE "kits" SET "price_override" = NULL;

-- itens por kit morrem
DROP TABLE "kit_items";
```

- [ ] **Step 3: Aplicar e regenerar o client**

Run: `npm run prisma:migrate` (aplica) — Expected: migration applied
Run: `npm run prisma:generate` — Expected: client gerado

---

### Task 2: Entities

**Files:**
- Modify: `api/src/entities/kit-type.ts`
- Modify: `api/src/entities/kit.ts`
- Test: `api/src/entities/kit.spec.ts` (novo)

- [ ] **Step 1: `KitType` ganha `price` e `items`**

```ts
import { Entity } from "../core/entities/entity";
import type { UniqueEntityID } from "../core/entities/unique-entity-id";
import type { Optional } from "../core/types/optional";
import type { KitItem } from "./kit-item";

export interface KitTypeProps {
  name: string;
  slug: string;
  price: number;
  items: KitItem[];
  createdAt: Date;
  updatedAt: Date;
}

export class KitType extends Entity<KitTypeProps> {
  get name(): string {
    return this.props.name;
  }
  get slug(): string {
    return this.props.slug;
  }
  get price(): number {
    return this.props.price;
  }
  get items(): KitItem[] {
    return this.props.items;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<KitTypeProps, "createdAt" | "updatedAt" | "items">,
    id?: UniqueEntityID,
  ): KitType {
    const now = new Date();
    return new KitType(
      {
        ...props,
        items: props.items ?? [],
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id,
    );
  }
}
```

- [ ] **Step 2: `Kit` troca `price`/`items` por `priceOverride` + preço efetivo**

Em `KitProps`: remover `price: number` e `items: KitItem[]`; adicionar `priceOverride: number | null`. Getters:

```ts
get priceOverride(): number | null {
  return this.props.priceOverride;
}
/** Preço efetivo: promocional do kit ou o preço do tipo. */
get price(): number {
  return this.props.priceOverride ?? this.props.kitType.price;
}
```

`create()`: `priceOverride` entra no `Optional` (default `null`); remover `items` do default. **Importante** — `Entity.toJSON()` serializa só props; sobrescrever no `Kit`:

```ts
toJSON(): unknown {
  return { id: this.id.toString(), ...this.props, price: this.price };
}
```

- [ ] **Step 3: Spec do preço efetivo (`api/src/entities/kit.spec.ts`)**

```ts
import { describe, expect, it } from "vitest";
import { Kit } from "./kit";
import { KitType } from "./kit-type";
import { Category } from "./category";

function makeKit(priceOverride: number | null) {
  const kitType = KitType.create({ name: "Kit Básico", slug: "kit-basico", price: 150 });
  const category = Category.create({ name: "Aniversário", slug: "aniversario", description: null, icon: null });
  return Kit.create({
    name: "Kit Princesa", slug: "kit-princesa", description: "desc",
    priceOverride,
    kitTypeId: kitType.id.toString(), categoryId: category.id.toString(),
    kitType, category,
  });
}

describe("Kit — preço efetivo", () => {
  it("sem override, herda o preço do tipo", () => {
    expect(makeKit(null).price).toBe(150);
  });
  it("com override, usa o promocional", () => {
    expect(makeKit(99.9).price).toBe(99.9);
  });
  it("serializa price efetivo no toJSON", () => {
    const json = makeKit(null).toJSON() as { price: number };
    expect(json.price).toBe(150);
  });
});
```

(Conferir assinatura real de `Category.create` antes de rodar.)

- [ ] **Step 4: Rodar** `npm test` — vários arquivos vão falhar (mappers/use cases ainda não migrados); o spec novo deve passar a lógica de entity. Seguir para as próximas tasks antes de exigir suíte verde.

---

### Task 3: Repositórios (interfaces, mappers, Prisma, in-memory)

**Files:**
- Modify: `api/src/repositories/kit-types-repository.ts`
- Modify: `api/src/repositories/kits-repository.ts`
- Modify: `api/src/repositories/prisma/mappers/kit-type-mapper.ts`
- Modify: `api/src/repositories/prisma/mappers/kit-mapper.ts`
- Delete: `api/src/repositories/prisma/mappers/kit-item-mapper.ts` (lógica vira parte do kit-type-mapper)
- Modify: `api/src/repositories/prisma/prisma-kit-types-repository.ts`
- Modify: `api/src/repositories/prisma/prisma-kits-repository.ts`
- Modify: `api/src/repositories/in-memory/in-memory-kit-types-repository.ts`
- Modify: `api/src/repositories/in-memory/in-memory-kits-repository.ts`

- [ ] **Step 1: Interfaces**

`kit-types-repository.ts`:

```ts
export interface CreateKitTypeInput {
  name: string;
  slug: string;
  price: number;
  items?: { name: string; quantity?: number | null }[];
}

export interface UpdateKitTypeInput {
  name?: string;
  slug?: string;
  price?: number;
  /** Quando presente, substitui a lista inteira. */
  items?: { name: string; quantity?: number | null }[];
}
```

`kits-repository.ts`: trocar `price: number` por `priceOverride?: number | null` no create, `price?: number` por `priceOverride?: number | null` no update; remover `items` dos dois.

- [ ] **Step 2: Mappers**

`kit-type-mapper.ts` — include de items + Decimal→Number:

```ts
import type { Prisma } from "@prisma/client";
import { UniqueEntityID } from "../../../core/entities/unique-entity-id";
import { KitItem } from "../../../entities/kit-item";
import { KitType } from "../../../entities/kit-type";

export const kitTypeInclude = {
  items: { orderBy: { name: "asc" } },
} satisfies Prisma.KitTypeInclude;

type Record = Prisma.KitTypeGetPayload<{ include: typeof kitTypeInclude }>;

export const KitTypeMapper = {
  toEntity(record: Record): KitType {
    return new KitType(
      {
        name: record.name,
        slug: record.slug,
        price: Number(record.price),
        items: record.items.map((item) =>
          KitItem.create({ name: item.name, quantity: item.quantity }),
        ),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      new UniqueEntityID(record.id),
    );
  },
};
```

`kit-mapper.ts`: `kitInclude` troca `items: {...}` por nada (remover) e `kitType: true` vira `kitType: { include: kitTypeInclude }`; no `toEntity`, `price: Number(record.price)` vira `priceOverride: record.priceOverride === null ? null : Number(record.priceOverride)`, remove `items`. Apagar import do `KitItemMapper` e deletar o arquivo `kit-item-mapper.ts`.

- [ ] **Step 3: Prisma repositories**

`prisma-kit-types-repository.ts`: todos os finds/list com `include: kitTypeInclude`; `create` com `items: { create: ... }`; `update` em `$transaction` (deleteMany + createMany quando `data.items` presente — mesmo padrão que `prisma-kits-repository.update` usava para items).

`prisma-kits-repository.ts`: `create`/`update` usam `priceOverride: data.priceOverride ?? null` (create) / `priceOverride: data.priceOverride` (update, `undefined` = não mexe; atenção: para permitir limpar a promoção, o update deve aceitar `null` explícito); remover o bloco de items e a transaction.

- [ ] **Step 4: In-memory repositories** — espelhar: `InMemoryKitTypesRepository` guarda `price` e `items` no record e hidrata `KitType.create({...})`; `InMemoryKitsRepository` remove `items` do record e usa `priceOverride`.

- [ ] **Step 5: Typecheck** — Run: `cd api && npx tsc --noEmit` (vão sobrar erros de use cases/controllers — próxima task).

---

### Task 4: Use cases + specs

**Files:**
- Modify: `api/src/use-cases/kit-types/create-kit-type.ts` + `.spec.ts`
- Modify: `api/src/use-cases/kit-types/update-kit-type.ts` + `.spec.ts`
- Modify: `api/src/use-cases/kits/create-kit.ts` + `.spec.ts`
- Modify: `api/src/use-cases/kits/update-kit.ts` + `.spec.ts`
- Modify: `api/src/use-cases/kits/get-kit-by-slug.spec.ts`, `list-kits.spec.ts`, `delete-kit.spec.ts` (fixtures)
- Modify: `api/src/test/factories/*` (makeKitContext — adicionar price/items nos seeds)

- [ ] **Step 1:** `CreateKitTypeUseCase`/`UpdateKitTypeUseCase` repassam `price`/`items` pro repositório (validação de negócio: nenhuma nova — Zod cobre no controller).
- [ ] **Step 2:** `CreateKitUseCase`/`UpdateKitUseCase`: trocar `price` por `priceOverride`, remover `items`.
- [ ] **Step 3:** Specs — casos novos:
  - create-kit-type: cria com price e items; items default `[]`.
  - update-kit-type: muda price; substitui lista inteira de items.
  - create-kit: sem override → `kit.price` = preço do tipo; com override → usa override.
  - update-kit: setar override; limpar override (`priceOverride: null`) volta a herdar.
- [ ] **Step 4:** Run: `npm test` — Expected: suíte unit verde.

---

### Task 5: Controllers (Zod) + e2e

**Files:**
- Modify: `api/src/http/controllers/kit-types/create.ts`, `update.ts`
- Modify: `api/src/http/controllers/kits/create.ts`, `update.ts`
- Modify: `api/src/http/controllers/kit-types/kit-types.e2e-spec.ts`, `api/src/http/controllers/kits/kits.e2e-spec.ts`

- [ ] **Step 1: kit-types schemas**

```ts
const itemsSchema = z
  .array(z.object({
    name: z.string().min(1),
    quantity: z.number().int().positive().nullish(),
  }))
  .optional();

// create
const bodySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  price: z.number().nonnegative(),
  items: itemsSchema,
});
// update: tudo optional (price: z.number().nonnegative().optional())
```

- [ ] **Step 2: kits schemas** — remover `items`; `price: z.number().nonnegative()` vira `priceOverride: z.number().nonnegative().nullish()` (create e update).
- [ ] **Step 3: e2e** — atualizar payloads existentes (kit-types agora exigem `price`; kits não mandam mais `items`/`price`). Casos novos: criar tipo com items e conferir no `GET /kit-types`; criar kit sem override e conferir `price` efetivo na resposta = price do tipo.
- [ ] **Step 4:** Run: `npm test` — Expected: verde.

---

### Task 6: Testes de integração (Postgres real)

**Files:**
- Modify: `api/src/repositories/prisma/prisma-repositories.int-spec.ts`

- [ ] **Step 1:** `seedKitContext` cria tipo com `price: 150` e items; specs de kits trocam `price` por `priceOverride` (e um caso `priceOverride: null` conferindo `kit.price === 150`); spec de update do tipo substituindo items; remover asserts de `prisma.kitItem` (tabela morta) — usar `prisma.kitTypeItem`.
- [ ] **Step 2:** Run: `npm run test:integration` — Expected: verde (Docker up).

---

### Task 7: Frontend — types e hooks

**Files:**
- Modify: `src/types/kit.ts`
- Modify: `src/hooks/api/use-kit-types.ts`
- Modify: `src/hooks/api/use-kits.ts`

- [ ] **Step 1:** `KitType` ganha `price: number` e `items: KitItem[]`; `Kit` ganha `priceOverride: number | null` (mantém `price` efetivo); remover `items` do `Kit`.
- [ ] **Step 2:** Payloads dos hooks: kit-types create/update com `price`/`items`; kits sem `items`, `price` → `priceOverride?: number | null`.
- [ ] **Step 3:** Run: `npx tsc --noEmit` — vai apontar todos os consumidores a ajustar (tasks 8–9).

---

### Task 8: Admin — formulários e tabelas

**Files:**
- Modify: `src/components/admin/kit-type-form.tsx` (+ preço + editor de itens)
- Modify: `src/components/admin/kit-form.tsx` (− itens; preço → promocional opcional com hint do preço do tipo)
- Modify: `src/app/admin/kit-types/page.tsx` (coluna preço)
- Modify: `src/app/admin/kits/page.tsx` (preço efetivo + badge "promo" quando override)

- [ ] **Step 1:** Migrar o editor de itens dinâmico (linhas nome+quantidade, adicionar/remover) do `KitForm` para o `KitTypeForm`, com campo de preço (mesmo input pattern dark).
- [ ] **Step 2:** `KitForm`: remover estado/markup de items; campo "Preço promocional (R$) — opcional" com placeholder `Padrão do tipo: R$ X` reagindo ao tipo selecionado; enviar `priceOverride: valor || null`.
- [ ] **Step 3:** Tabelas: tipos mostram preço; kits mostram `kit.price` com `Promo` badge quando `priceOverride != null`.
- [ ] **Step 4:** Run: `npx tsc --noEmit` + smoke manual no painel.

---

### Task 9: Público — detalhe do kit

**Files:**
- Modify: `src/app/kits/[slug]/page.tsx` ("Itens inclusos" lê `kit.kitType.items`)

- [ ] **Step 1:** Trocar `kit.items` por `kit.kitType.items` (card, preço e carrinho já usam `kit.price` efetivo — sem mudança).
- [ ] **Step 2:** Run: `npx tsc --noEmit` && smoke em `/kits` e detalhe.

---

### Task 10: Verificação final + docs

- [ ] **Step 1:** Run: `npx tsc --noEmit && cd api && npx tsc --noEmit && cd .. && npm run lint && npm test && npm run test:integration && npm run build` — Expected: tudo verde.
- [ ] **Step 2:** Fluxo manual via API (igual ao smoke da sprint 7): criar tipo com price/items → criar kit sem override → `GET /kits` mostra price do tipo e items do tipo → update kit com override → price muda. Limpar dados.
- [ ] **Step 3:** Atualizar `docs/guia_admin.md` (itens e preço agora no Tipo de Kit; preço promocional no kit) e registrar a mudança em `docs/sprint_8.md` ou novo `docs/sprint_9.md`.
