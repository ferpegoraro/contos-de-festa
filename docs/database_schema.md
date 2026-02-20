# Schema do Banco de Dados

Documentação técnica do banco de dados PostgreSQL com Prisma.

---

## Diagrama de Relacionamentos

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Compra    │       │    Curso    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │◄──────│ usuarioId   │       │ id          │
│ nome        │       │ cursoId     │──────►│ titulo      │
│ email       │       │ status      │       │ descricao   │
│ senha       │       │ valor       │       │ preco       │
│ role        │       └─────────────┘       │ thumbnail   │
└─────────────┘                             └──────┬──────┘
      │                                            │
      ▼                                            ▼
┌─────────────┐                             ┌─────────────┐
│  Progresso  │                             │   Modulo    │
├─────────────┤                             ├─────────────┤
│ usuarioId   │                             │ cursoId     │
│ aulaId      │◄────────────────────────────│ titulo      │
│ concluida   │                             │ ordem       │
└─────────────┘                             └──────┬──────┘
                                                   │
                                                   ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Categoria  │       │     Kit     │       │    Aula     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │◄──────│ categoriaId │       │ moduloId    │
│ nome        │       │ nome        │       │ titulo      │
│ slug        │       │ preco       │       │ videoUrl    │
└─────────────┘       │ status      │       │ duracao     │
                      └──────┬──────┘       └─────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼                             ▼
       ┌─────────────┐               ┌─────────────┐
       │  KitImagem  │               │   KitItem   │
       ├─────────────┤               ├─────────────┤
       │ kitId       │               │ kitId       │
       │ url         │               │ nome        │
       │ ordem       │               │ quantidade  │
       └─────────────┘               └─────────────┘
```

---

## Enums

| Enum           | Valores                                        | Descrição              |
| -------------- | ---------------------------------------------- | ---------------------- |
| `Role`         | `USER`, `ADMIN`                                | Tipo de usuário        |
| `StatusCompra` | `PENDENTE`, `PAGO`, `CANCELADO`, `REEMBOLSADO` | Status do pagamento    |
| `StatusKit`    | `DISPONIVEL`, `ALUGADO`, `MANUTENCAO`          | Disponibilidade do kit |

---

## Tabelas

### `users` (Usuários)

| Campo       | Tipo       | Obrigatório | Descrição           |
| ----------- | ---------- | ----------- | ------------------- |
| `id`        | `cuid`     | ✅          | Identificador único |
| `nome`      | `String`   | ✅          | Nome completo       |
| `email`     | `String`   | ✅          | Email (único)       |
| `senha`     | `String`   | ✅          | Hash bcrypt         |
| `telefone`  | `String`   | ❌          | Telefone de contato |
| `avatar`    | `String`   | ❌          | URL da foto         |
| `role`      | `Role`     | ✅          | `USER` ou `ADMIN`   |
| `createdAt` | `DateTime` | ✅          | Data de criação     |
| `updatedAt` | `DateTime` | ✅          | Última atualização  |

**Relacionamentos:**

- `compras` → `Compra[]`
- `progressos` → `Progresso[]`

---

### `categorias` (Categorias de Kits)

| Campo       | Tipo       | Obrigatório | Descrição            |
| ----------- | ---------- | ----------- | -------------------- |
| `id`        | `cuid`     | ✅          | Identificador único  |
| `nome`      | `String`   | ✅          | Nome da categoria    |
| `slug`      | `String`   | ✅          | URL amigável (único) |
| `descricao` | `String`   | ❌          | Descrição            |
| `icone`     | `String`   | ❌          | Nome do ícone        |
| `createdAt` | `DateTime` | ✅          | Data de criação      |

**Relacionamentos:**

- `kits` → `Kit[]`

---

### `kits` (Kits de Peg e Monte)

| Campo         | Tipo            | Obrigatório | Descrição                            |
| ------------- | --------------- | ----------- | ------------------------------------ |
| `id`          | `cuid`          | ✅          | Identificador único                  |
| `nome`        | `String`        | ✅          | Nome do kit                          |
| `slug`        | `String`        | ✅          | URL amigável (único)                 |
| `descricao`   | `Text`          | ✅          | Descrição completa                   |
| `tema`        | `String`        | ❌          | Tema do kit (Safari, Princesas, etc) |
| `preco`       | `Decimal(10,2)` | ✅          | Preço de aluguel                     |
| `status`      | `StatusKit`     | ✅          | Disponibilidade                      |
| `destaque`    | `Boolean`       | ✅          | Exibir na home                       |
| `categoriaId` | `String`        | ❌          | FK para categoria                    |
| `createdAt`   | `DateTime`      | ✅          | Data de criação                      |
| `updatedAt`   | `DateTime`      | ✅          | Última atualização                   |

**Relacionamentos:**

- `categoria` → `Categoria`
- `imagens` → `KitImagem[]`
- `itens` → `KitItem[]`

---

### `kit_imagens` (Imagens dos Kits)

| Campo       | Tipo      | Obrigatório | Descrição           |
| ----------- | --------- | ----------- | ------------------- |
| `id`        | `cuid`    | ✅          | Identificador único |
| `url`       | `String`  | ✅          | URL da imagem       |
| `alt`       | `String`  | ❌          | Texto alternativo   |
| `ordem`     | `Int`     | ✅          | Ordem de exibição   |
| `principal` | `Boolean` | ✅          | Imagem de capa      |
| `kitId`     | `String`  | ✅          | FK para kit         |

**Cascade:** Deletar kit remove imagens.

---

### `kit_itens` (Itens dos Kits)

| Campo        | Tipo     | Obrigatório | Descrição           |
| ------------ | -------- | ----------- | ------------------- |
| `id`         | `cuid`   | ✅          | Identificador único |
| `nome`       | `String` | ✅          | Nome do item        |
| `quantidade` | `Int`    | ✅          | Quantidade incluída |
| `kitId`      | `String` | ✅          | FK para kit         |

**Cascade:** Deletar kit remove itens.

---

### `cursos` (Cursos Online)

| Campo            | Tipo            | Obrigatório | Descrição               |
| ---------------- | --------------- | ----------- | ----------------------- |
| `id`             | `cuid`          | ✅          | Identificador único     |
| `titulo`         | `String`        | ✅          | Título do curso         |
| `slug`           | `String`        | ✅          | URL amigável (único)    |
| `descricao`      | `Text`          | ✅          | Descrição completa      |
| `descricaoCurta` | `VarChar(255)`  | ❌          | Resumo para cards       |
| `preco`          | `Decimal(10,2)` | ✅          | Preço do curso          |
| `thumbnail`      | `String`        | ❌          | URL da imagem de capa   |
| `videoPreview`   | `String`        | ❌          | URL do vídeo de preview |
| `publicado`      | `Boolean`       | ✅          | Visível para usuários   |
| `destaque`       | `Boolean`       | ✅          | Exibir na home          |
| `duracao`        | `Int`           | ❌          | Duração total (minutos) |
| `createdAt`      | `DateTime`      | ✅          | Data de criação         |
| `updatedAt`      | `DateTime`      | ✅          | Última atualização      |

**Relacionamentos:**

- `modulos` → `Modulo[]`
- `compras` → `Compra[]`

---

### `modulos` (Módulos dos Cursos)

| Campo       | Tipo       | Obrigatório | Descrição           |
| ----------- | ---------- | ----------- | ------------------- |
| `id`        | `cuid`     | ✅          | Identificador único |
| `titulo`    | `String`   | ✅          | Título do módulo    |
| `descricao` | `String`   | ❌          | Descrição           |
| `ordem`     | `Int`      | ✅          | Ordem de exibição   |
| `cursoId`   | `String`   | ✅          | FK para curso       |
| `createdAt` | `DateTime` | ✅          | Data de criação     |

**Relacionamentos:**

- `curso` → `Curso`
- `aulas` → `Aula[]`

**Cascade:** Deletar curso remove módulos.

---

### `aulas` (Aulas dos Módulos)

| Campo       | Tipo       | Obrigatório | Descrição           |
| ----------- | ---------- | ----------- | ------------------- |
| `id`        | `cuid`     | ✅          | Identificador único |
| `titulo`    | `String`   | ✅          | Título da aula      |
| `descricao` | `Text`     | ❌          | Descrição           |
| `videoUrl`  | `String`   | ✅          | URL do vídeo        |
| `duracao`   | `Int`      | ❌          | Duração (minutos)   |
| `ordem`     | `Int`      | ✅          | Ordem de exibição   |
| `gratuita`  | `Boolean`  | ✅          | Aula de preview     |
| `moduloId`  | `String`   | ✅          | FK para módulo      |
| `createdAt` | `DateTime` | ✅          | Data de criação     |

**Relacionamentos:**

- `modulo` → `Modulo`
- `progressos` → `Progresso[]`

**Cascade:** Deletar módulo remove aulas.

---

### `compras` (Compras de Cursos)

| Campo             | Tipo            | Obrigatório | Descrição              |
| ----------------- | --------------- | ----------- | ---------------------- |
| `id`              | `cuid`          | ✅          | Identificador único    |
| `status`          | `StatusCompra`  | ✅          | Status do pagamento    |
| `valor`           | `Decimal(10,2)` | ✅          | Valor pago             |
| `metodoPagamento` | `String`        | ❌          | cartao/pix/boleto      |
| `stripeSessionId` | `String`        | ❌          | ID da sessão Stripe    |
| `stripePaymentId` | `String`        | ❌          | ID do pagamento Stripe |
| `usuarioId`       | `String`        | ✅          | FK para usuário        |
| `cursoId`         | `String`        | ✅          | FK para curso          |
| `createdAt`       | `DateTime`      | ✅          | Data da compra         |
| `updatedAt`       | `DateTime`      | ✅          | Última atualização     |

**Constraint:** `@@unique([usuarioId, cursoId])` - Usuário só compra um curso uma vez.

---

### `progressos` (Progresso do Aluno)

| Campo            | Tipo       | Obrigatório | Descrição           |
| ---------------- | ---------- | ----------- | ------------------- |
| `id`             | `cuid`     | ✅          | Identificador único |
| `concluida`      | `Boolean`  | ✅          | Aula concluída      |
| `tempoAssistido` | `Int`      | ✅          | Segundos assistidos |
| `usuarioId`      | `String`   | ✅          | FK para usuário     |
| `aulaId`         | `String`   | ✅          | FK para aula        |
| `updatedAt`      | `DateTime` | ✅          | Última atualização  |

**Constraint:** `@@unique([usuarioId, aulaId])` - Um progresso por aula/usuário.

**Cascade:** Deletar usuário ou aula remove progresso.

---

## Índices Automáticos

O Prisma cria índices automaticamente para:

- Campos `@id`
- Campos `@unique`
- Campos de relacionamento (FKs)

---

## Comandos Úteis

```bash
# Criar migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco (CUIDADO: apaga tudo)
npx prisma migrate reset

# Abrir Prisma Studio (visualizar dados)
npx prisma studio

# Gerar Prisma Client
npx prisma generate

# Rodar seed
npx prisma db seed
```
