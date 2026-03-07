# Schema do Banco de Dados

Documentação do banco PostgreSQL com Prisma — versão simplificada.

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

┌─────────────┐       ┌─────────────┐
│  Category   │       │     Kit     │
├─────────────┤       ├─────────────┤
│ id          │◄──────│ categoryId  │
│ name        │       │ name        │
│ slug        │       │ slug        │
│ icon        │       │ description │
└─────────────┘       │ price       │
                      │ featured    │
                      └──────┬──────┘
                             │
              ┌──────────────┼──────────────┐
              ▼                             ▼
       ┌─────────────┐               ┌─────────────┐
       │  KitImage   │               │   KitItem   │
       ├─────────────┤               ├─────────────┤
       │ kitId       │               │ kitId       │
       │ url         │               │ name        │
       │ order       │               │ quantity    │
       │ isPrimary   │               └─────────────┘
       └─────────────┘
```

---

## Tabelas

### `users` — Usuários do sistema (só admins por enquanto)

- **id** — Identificador único (gerado automaticamente)
- **name** — Nome do admin
- **email** — Email de login (único)
- **password** — Senha criptografada com bcrypt
- **role** — `USER` ou `ADMIN`
- **createdAt / updatedAt** — Datas de criação e atualização

### `categories` — Categorias dos kits

- **id** — Identificador único
- **name** — Nome da categoria (ex: "Aniversário", "Casamento")
- **slug** — URL amigável (ex: "aniversario") — único
- **description** — Descrição opcional
- **icon** — Nome do ícone para exibir no site
- **createdAt** — Data de criação

Relacionamento: uma categoria tem vários kits.

### `kits` — Kits de peg e monte

- **id** — Identificador único
- **name** — Nome do kit
- **slug** — URL amigável (único)
- **description** — Descrição completa (texto longo)
- **theme** — Tema do kit (ex: "Safari", "Princesas") — opcional
- **price** — Preço de referência
- **featured** — Se deve aparecer em destaque na home
- **categoryId** — Categoria do kit (opcional)
- **createdAt / updatedAt** — Datas

Relacionamentos: um kit tem várias imagens e vários itens.

### `kit_images` — Fotos dos kits

- **id** — Identificador único
- **url** — URL da imagem no Cloudinary
- **alt** — Texto alternativo (acessibilidade)
- **order** — Ordem de exibição na galeria
- **isPrimary** — Se é a foto de capa do kit
- **kitId** — Qual kit essa imagem pertence

Ao deletar um kit, suas imagens são removidas automaticamente (cascade).

### `kit_items` — Itens inclusos no kit

- **id** — Identificador único
- **name** — Nome do item (ex: "Mesa provençal", "Arco de balões")
- **quantity** — Quantidade incluída
- **kitId** — Qual kit esse item pertence

Ao deletar um kit, seus itens são removidos automaticamente (cascade).
