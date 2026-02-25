# Sprint 2 - Banco de Dados e Modelagem

**Período:** Semana 2  
**Foco:** Estrutura de dados e Prisma

> **Prioridade:** Controle de estoque e venda de kits primeiro. Cursos serão implementados depois, mas já estão no schema.

## Tarefas

- [ ] Configurar Docker Compose para PostgreSQL
- [ ] Instalar Prisma ORM no projeto
- [ ] Criar schema do Prisma (ver código abaixo)
- [ ] Rodar migrations iniciais (`prisma migrate dev`)
- [ ] Criar seed com dados de exemplo
- [ ] Integrar Prisma Client no Fastify como plugin
- [ ] Testar conexão com banco via endpoint `/health`

## Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    container_name: contos-de-festas-db
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: contos_de_festas
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Subir o banco
docker compose up -d

# Verificar se está rodando
docker compose ps

# Parar o banco
docker compose down
```

## Schema Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ENUMS
// ============================================

enum Role {
  USER
  ADMIN
}

enum KitStatus {
  AVAILABLE
  RENTED
  MAINTENANCE
}

enum OrderStatus {
  PENDING
  PAID
  CANCELLED
  REFUNDED
}

// ============================================
// USERS
// ============================================

model User {
  id        String     @id @default(cuid())
  name      String
  email     String     @unique
  password  String
  phone     String?
  avatar    String?
  role      Role       @default(USER)
  rentals   Rental[]
  orders    Order[]
  progress  Progress[]
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  @@map("users")
}

// ============================================
// KITS (Controle de Estoque) - PRIORIDADE
// ============================================

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
  status      KitStatus  @default(AVAILABLE)
  featured    Boolean    @default(false)
  category    Category?  @relation(fields: [categoryId], references: [id])
  categoryId  String?    @map("category_id")
  images      KitImage[]
  items       KitItem[]
  rentals     Rental[]
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

model Rental {
  id            String      @id @default(cuid())
  status        OrderStatus @default(PENDING)
  totalPrice    Decimal     @db.Decimal(10, 2) @map("total_price")
  eventDate     DateTime    @map("event_date")
  returnDate    DateTime?   @map("return_date")
  notes         String?     @db.Text
  paymentMethod String?     @map("payment_method")
  user          User?       @relation(fields: [userId], references: [id])
  userId        String?     @map("user_id")
  kit           Kit         @relation(fields: [kitId], references: [id])
  kitId         String      @map("kit_id")
  customerName  String      @map("customer_name")
  customerPhone String      @map("customer_phone")
  customerEmail String?     @map("customer_email")
  createdAt     DateTime    @default(now()) @map("created_at")
  updatedAt     DateTime    @updatedAt @map("updated_at")

  @@map("rentals")
}

// ============================================
// COURSES (Implementar depois)
// ============================================

model Course {
  id               String   @id @default(cuid())
  title            String
  slug             String   @unique
  description      String   @db.Text
  shortDescription String?  @db.VarChar(255) @map("short_description")
  price            Decimal  @db.Decimal(10, 2)
  thumbnail        String?
  previewVideo     String?  @map("preview_video")
  published        Boolean  @default(false)
  featured         Boolean  @default(false)
  duration         Int?
  modules          Module[]
  orders           Order[]
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@map("courses")
}

model Module {
  id          String   @id @default(cuid())
  title       String
  description String?
  order       Int      @default(0)
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  courseId    String   @map("course_id")
  lessons     Lesson[]
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("modules")
}

model Lesson {
  id          String     @id @default(cuid())
  title       String
  description String?    @db.Text
  videoUrl    String     @map("video_url")
  duration    Int?
  order       Int        @default(0)
  isFree      Boolean    @default(false) @map("is_free")
  module      Module     @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  moduleId    String     @map("module_id")
  progress    Progress[]
  createdAt   DateTime   @default(now()) @map("created_at")

  @@map("lessons")
}

model Order {
  id              String      @id @default(cuid())
  status          OrderStatus @default(PENDING)
  amount          Decimal     @db.Decimal(10, 2)
  paymentMethod   String?     @map("payment_method")
  stripeSessionId String?     @unique @map("stripe_session_id")
  stripePaymentId String?     @map("stripe_payment_id")
  user            User        @relation(fields: [userId], references: [id])
  userId          String      @map("user_id")
  course          Course      @relation(fields: [courseId], references: [id])
  courseId        String      @map("course_id")
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")

  @@unique([userId, courseId])
  @@map("orders")
}

model Progress {
  id          String   @id @default(cuid())
  completed   Boolean  @default(false)
  watchedTime Int      @default(0) @map("watched_time")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String   @map("user_id")
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  lessonId    String   @map("lesson_id")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@unique([userId, lessonId])
  @@map("progress")
}
```

## Migrations

```bash
# Criar primeira migration
npx prisma migrate dev --name init

# Isso vai criar as tabelas:
# - users
# - categories
# - kits, kit_images, kit_items
# - rentals
# - courses, modules, lessons
# - orders
# - progress
```

## Seed (prisma/seed.ts)

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  // Create admin user
  await prisma.user.upsert({
    where: { email: "admin@contosdefestas.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@contosdefestas.com",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  // Create categories
  await prisma.category.createMany({
    data: [
      { name: "Aniversário", slug: "aniversario", icon: "cake" },
      { name: "Casamento", slug: "casamento", icon: "heart" },
      { name: "Chá de Bebê", slug: "cha-de-bebe", icon: "baby" },
      { name: "Festa Infantil", slug: "festa-infantil", icon: "balloon" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Plugin Prisma (api/src/lib/prisma.ts)

```typescript
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "dev" ? ["query"] : [],
});
```

## Critérios de Conclusão

- [ ] Docker Compose rodando PostgreSQL
- [ ] `npx prisma migrate dev` sem erros
- [ ] `npx prisma db seed` populando dados
- [ ] `npx prisma studio` mostrando tabelas
- [ ] Endpoint `/health` retornando status do banco

---

## Resumo do que foi feito

_(Preencher após conclusão do sprint)_
