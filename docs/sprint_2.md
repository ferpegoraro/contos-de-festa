# Sprint 2 - Banco de Dados e Modelagem

**Período:** Semana 2  
**Foco:** Estrutura de dados com Docker e Prisma

## Tarefas

### Docker

- [ ] Criar `docker-compose.yml` com PostgreSQL 16
- [ ] Testar subindo o container (`docker compose up -d`)
- [ ] Verificar se o banco está rodando (`docker compose ps`)

### Prisma 6

- [ ] Instalar Prisma 6 no projeto (`npm install prisma@6 @prisma/client@6`)
- [ ] Inicializar Prisma (`npx prisma init`)
- [ ] Configurar `DATABASE_URL` no `.env`
- [ ] Criar o schema abaixo
- [ ] Rodar migration (`npx prisma migrate dev --name init`)
- [ ] Verificar tabelas no Prisma Studio (`npx prisma studio`)

### Integração com Fastify

- [ ] Criar arquivo `api/src/lib/prisma.ts` com a instância do Prisma Client
- [ ] Criar endpoint `GET /health` que testa conexão com o banco

## Schema do Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  icon        String?
  kits        Kit[]
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("categories")
}

model Kit {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String     @db.Text
  theme       String?
  price       Decimal    @db.Decimal(10, 2)
  featured    Boolean    @default(false)
  category    Category?  @relation(fields: [categoryId], references: [id])
  categoryId  String?    @map("category_id")
  images      KitImage[]
  items       KitItem[]
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  @@map("kits")
}

model KitImage {
  id        String  @id @default(cuid())
  url       String
  alt       String?
  order     Int     @default(0)
  isPrimary Boolean @default(false) @map("is_primary")
  kit       Kit     @relation(fields: [kitId], references: [id], onDelete: Cascade)
  kitId     String  @map("kit_id")

  @@map("kit_images")
}

model KitItem {
  id       String @id @default(cuid())
  name     String
  quantity Int    @default(1)
  kit      Kit    @relation(fields: [kitId], references: [id], onDelete: Cascade)
  kitId    String @map("kit_id")

  @@map("kit_items")
}
```

## Critérios de Conclusão

- [ ] Docker Compose rodando PostgreSQL
- [ ] Migration executada sem erros
- [ ] Prisma Studio mostrando as tabelas
- [ ] Endpoint `/health` retornando status do banco
