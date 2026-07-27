-- Preço e itens inclusos passam ao Tipo de Kit; kit ganha price_override opcional.

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

-- kits: price -> price_override (nullable); kits existentes passam a herdar do tipo
ALTER TABLE "kits" RENAME COLUMN "price" TO "price_override";
ALTER TABLE "kits" ALTER COLUMN "price_override" DROP NOT NULL;
UPDATE "kits" SET "price_override" = NULL;

-- itens por kit morrem
DROP TABLE "kit_items";
