# Schema do Banco de Dados

Documentação do banco PostgreSQL com Prisma — versão simplificada.

> **Sprint 9:** preço e itens inclusos pertencem ao **Tipo de Kit**. O kit herda ambos; `price_override` permite promoção por kit.

---

## Diagrama de Relacionamentos

```
┌─────────────┐
│    User     │  (só admin)
├─────────────┤
│ id          │
│ name        │
│ email       │
│ password    │
│ role        │
└─────────────┘

┌──────────────┐      ┌──────────────┐       ┌───────────────┐
│   KitType    │      │     Kit      │       │   Category    │
├──────────────┤      ├──────────────┤       ├───────────────┤
│ id           │◄─────│ kitTypeId    │──────►│ id            │
│ name         │      │ categoryId   │       │ name          │
│ slug         │      │ name         │       │ slug          │
│ price        │      │ slug         │       │ icon          │
└──────┬───────┘      │ description  │       └───────────────┘
       │              │ priceOverride│  (null = herda do tipo)
       ▼              │ featured     │
┌──────────────┐      └──────┬───────┘
│ KitTypeItem  │             │
├──────────────┤             ▼
│ kitTypeId    │      ┌──────────────┐
│ itemId ──┐   │      │   KitImage   │
│ quantity │   │      ├──────────────┤
└──────────┼───┘      │ kitId        │
           ▼          │ url          │
┌──────────────┐      │ order        │
│     Item     │      │ isPrimary    │
├──────────────┤      └──────────────┘
│ id           │
│ name (único) │  ← catálogo de peças (reutilizado pelos tipos)
└──────────────┘
```

**Preço efetivo do kit** = `kit.priceOverride ?? kitType.price` (calculado no backend).

---

## Tabelas

### `users` — Usuários do sistema (só admins por enquanto)

- **id** — Identificador único (gerado automaticamente)
- **name** — Nome do admin
- **email** — Email de login (único)
- **password_hash** — Senha criptografada com bcrypt
- **role** — `USER` ou `ADMIN`
- **created_at / updated_at** — Datas de criação e atualização

### `kit_types` — Tipos/formatos de kit (Kit Básico, Kit de Mesa...)

- **id** — Identificador único
- **name** — Nome do tipo
- **slug** — URL amigável (único)
- **price** — **Preço do aluguel** — todos os kits deste tipo herdam
- **created_at / updated_at** — Datas

Relacionamentos: um tipo tem vários kits e vários itens inclusos.

### `items` — Catálogo de peças

- **id** — Identificador único
- **name** — Nome do item (ex: "Arco de balões") — **único**
- **created_at / updated_at** — Datas

Cadastrado uma vez, reutilizado por vários tipos de kit. Não pode ser excluído enquanto algum tipo o usar.

### `kit_type_items` — Itens inclusos no tipo de kit (ligação)

- **id** — Identificador único
- **kit_type_id** — Qual tipo
- **item_id** — Qual item do catálogo
- **quantity** — Quantidade incluída (opcional)
- Único por (`kit_type_id`, `item_id`) — um item não repete no mesmo tipo

Valem para **todos** os kits do tipo. Ao deletar um tipo, as ligações somem (cascade); os itens do catálogo permanecem.

### `categories` — Categorias dos kits

- **id** — Identificador único
- **name** — Nome da categoria (ex: "Aniversário", "Casamento")
- **slug** — URL amigável (ex: "aniversario") — único
- **description** — Descrição opcional
- **icon** — Nome do ícone para exibir no site
- **created_at / updated_at** — Datas

Relacionamento: uma categoria tem vários kits.

### `kits` — Kits de peg e monte (os temas)

- **id** — Identificador único
- **name** — Nome do kit (ex: "Kit Princesa")
- **slug** — URL amigável (único)
- **description** — Descrição completa (texto longo)
- **short_description** — Resumo para os cards (opcional)
- **price_override** — **Preço promocional** (opcional) — `NULL` herda o preço do tipo
- **featured** — Se deve aparecer em destaque na home
- **kit_type_id** — Tipo do kit (define preço e itens)
- **category_id** — Categoria do kit
- **created_at / updated_at** — Datas

Relacionamento: um kit tem várias imagens.

### `kit_images` — Fotos dos kits

- **id** — Identificador único
- **url** — URL da imagem no Cloudinary
- **public_id** — Id no Cloudinary (para deletar lá também)
- **alt** — Texto alternativo (acessibilidade)
- **order** — Ordem de exibição na galeria
- **is_primary** — Se é a foto de capa do kit
- **kit_id** — Qual kit essa imagem pertence

Ao deletar um kit, suas imagens são removidas automaticamente (cascade).
