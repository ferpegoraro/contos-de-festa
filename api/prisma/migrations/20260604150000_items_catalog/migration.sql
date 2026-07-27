-- Catálogo de itens: items vira tabela própria; kit_type_items referencia item_id.

-- catálogo
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "items_name_key" ON "items"("name");

-- seed: um item por nome distinto já usado nos tipos
INSERT INTO "items" ("id", "name", "created_at", "updated_at")
SELECT gen_random_uuid(), s."name", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "name" FROM "kit_type_items") s;

-- liga kit_type_items ao catálogo
ALTER TABLE "kit_type_items" ADD COLUMN "item_id" TEXT;

UPDATE "kit_type_items" kti
SET "item_id" = (SELECT i."id" FROM "items" i WHERE i."name" = kti."name");

-- remove duplicatas de (kit_type_id, item_id) mantendo uma linha
DELETE FROM "kit_type_items" a
USING "kit_type_items" b
WHERE a."ctid" < b."ctid"
  AND a."kit_type_id" = b."kit_type_id"
  AND a."item_id" = b."item_id";

ALTER TABLE "kit_type_items" ALTER COLUMN "item_id" SET NOT NULL;
ALTER TABLE "kit_type_items" DROP COLUMN "name";

ALTER TABLE "kit_type_items" ADD CONSTRAINT "kit_type_items_item_id_fkey"
  FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE UNIQUE INDEX "kit_type_items_kit_type_id_item_id_key"
  ON "kit_type_items"("kit_type_id", "item_id");
CREATE INDEX "kit_type_items_item_id_idx" ON "kit_type_items"("item_id");
