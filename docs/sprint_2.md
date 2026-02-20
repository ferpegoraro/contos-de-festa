# Sprint 2 - Banco de Dados e Modelagem

**Período:** Semana 2  
**Foco:** Estrutura de dados e Prisma

## Tarefas

- [ ] Instalar e configurar PostgreSQL (local ou Docker)
- [ ] Instalar Prisma ORM no projeto
- [ ] Criar schema do Prisma (ver código abaixo)
- [ ] Rodar migrations iniciais (`prisma migrate dev`)
- [ ] Criar seed com dados de exemplo
- [ ] Integrar Prisma Client no Fastify como plugin
- [ ] Testar conexão com banco via endpoint `/health`

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

enum Role {
  USER
  ADMIN
}

enum StatusCompra {
  PENDENTE
  PAGO
  CANCELADO
  REEMBOLSADO
}

enum StatusKit {
  DISPONIVEL
  ALUGADO
  MANUTENCAO
}

model User {
  id         String      @id @default(cuid())
  nome       String
  email      String      @unique
  senha      String
  telefone   String?
  avatar     String?
  role       Role        @default(USER)
  compras    Compra[]
  progressos Progresso[]
  createdAt  DateTime    @default(now()) @map("created_at")
  updatedAt  DateTime    @updatedAt @map("updated_at")
  @@map("users")
}

model Categoria {
  id        String   @id @default(cuid())
  nome      String
  slug      String   @unique
  descricao String?
  icone     String?
  kits      Kit[]
  createdAt DateTime @default(now()) @map("created_at")
  @@map("categorias")
}

model Kit {
  id          String     @id @default(cuid())
  nome        String
  slug        String     @unique
  descricao   String     @db.Text
  tema        String?
  preco       Decimal    @db.Decimal(10, 2)
  status      StatusKit  @default(DISPONIVEL)
  destaque    Boolean    @default(false)
  categoria   Categoria? @relation(fields: [categoriaId], references: [id])
  categoriaId String?    @map("categoria_id")
  imagens     KitImagem[]
  itens       KitItem[]
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")
  @@map("kits")
}

model KitImagem {
  id        String  @id @default(cuid())
  url       String
  alt       String?
  ordem     Int     @default(0)
  principal Boolean @default(false)
  kit       Kit     @relation(fields: [kitId], references: [id], onDelete: Cascade)
  kitId     String  @map("kit_id")
  @@map("kit_imagens")
}

model KitItem {
  id         String @id @default(cuid())
  nome       String
  quantidade Int    @default(1)
  kit        Kit    @relation(fields: [kitId], references: [id], onDelete: Cascade)
  kitId      String @map("kit_id")
  @@map("kit_itens")
}

model Curso {
  id             String   @id @default(cuid())
  titulo         String
  slug           String   @unique
  descricao      String   @db.Text
  descricaoCurta String?  @db.VarChar(255) @map("descricao_curta")
  preco          Decimal  @db.Decimal(10, 2)
  thumbnail      String?
  videoPreview   String?  @map("video_preview")
  publicado      Boolean  @default(false)
  destaque       Boolean  @default(false)
  duracao        Int?
  modulos        Modulo[]
  compras        Compra[]
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")
  @@map("cursos")
}

model Modulo {
  id        String   @id @default(cuid())
  titulo    String
  descricao String?
  ordem     Int      @default(0)
  curso     Curso    @relation(fields: [cursoId], references: [id], onDelete: Cascade)
  cursoId   String   @map("curso_id")
  aulas     Aula[]
  createdAt DateTime @default(now()) @map("created_at")
  @@map("modulos")
}

model Aula {
  id         String      @id @default(cuid())
  titulo     String
  descricao  String?     @db.Text
  videoUrl   String      @map("video_url")
  duracao    Int?
  ordem      Int         @default(0)
  gratuita   Boolean     @default(false)
  modulo     Modulo      @relation(fields: [moduloId], references: [id], onDelete: Cascade)
  moduloId   String      @map("modulo_id")
  progressos Progresso[]
  createdAt  DateTime    @default(now()) @map("created_at")
  @@map("aulas")
}

model Compra {
  id              String       @id @default(cuid())
  status          StatusCompra @default(PENDENTE)
  valor           Decimal      @db.Decimal(10, 2)
  metodoPagamento String?      @map("metodo_pagamento")
  stripeSessionId String?      @unique @map("stripe_session_id")
  stripePaymentId String?      @map("stripe_payment_id")
  usuario         User         @relation(fields: [usuarioId], references: [id])
  usuarioId       String       @map("usuario_id")
  curso           Curso        @relation(fields: [cursoId], references: [id])
  cursoId         String       @map("curso_id")
  createdAt       DateTime     @default(now()) @map("created_at")
  updatedAt       DateTime     @updatedAt @map("updated_at")
  @@unique([usuarioId, cursoId])
  @@map("compras")
}

model Progresso {
  id             String   @id @default(cuid())
  concluida      Boolean  @default(false)
  tempoAssistido Int      @default(0) @map("tempo_assistido")
  usuario        User     @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  usuarioId      String   @map("usuario_id")
  aula           Aula     @relation(fields: [aulaId], references: [id], onDelete: Cascade)
  aulaId         String   @map("aula_id")
  updatedAt      DateTime @updatedAt @map("updated_at")
  @@unique([usuarioId, aulaId])
  @@map("progressos")
}
```

## Migrations

```bash
# Criar primeira migration
npx prisma migrate dev --name init

# Isso vai criar as tabelas:
# - users
# - categorias
# - kits, kit_imagens, kit_itens
# - cursos, modulos, aulas
# - compras
# - progressos
```

## Seed (prisma/seed.ts)

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@contosdefestas.com" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@contosdefestas.com",
      senha: senhaHash,
      role: "ADMIN",
    },
  });

  await prisma.categoria.createMany({
    data: [
      { nome: "Aniversário", slug: "aniversario", icone: "cake" },
      { nome: "Casamento", slug: "casamento", icone: "heart" },
      { nome: "Chá de Bebê", slug: "cha-de-bebe", icone: "baby" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed executado!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Plugin Prisma (server/plugins/prisma.ts)

```typescript
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient();
  await prisma.$connect();
  fastify.decorate("prisma", prisma);
  fastify.addHook("onClose", async () => prisma.$disconnect());
};

export default fp(prismaPlugin);
```

## Critérios de Conclusão

- [ ] PostgreSQL rodando (Docker ou local)
- [ ] `npx prisma migrate dev` sem erros
- [ ] `npx prisma db seed` populando dados
- [ ] `npx prisma studio` mostrando tabelas
- [ ] Endpoint `/health` retornando status do banco
