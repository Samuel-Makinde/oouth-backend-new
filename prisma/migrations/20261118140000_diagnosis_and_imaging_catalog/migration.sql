ALTER TABLE "CatalogDiagnosis" ADD COLUMN "conceptType" TEXT NOT NULL DEFAULT 'disease';
ALTER TABLE "CatalogDiagnosis" ADD COLUMN "synonyms" TEXT NOT NULL DEFAULT '';
ALTER TABLE "CatalogImaging" ADD COLUMN "synonyms" TEXT NOT NULL DEFAULT '';
ALTER TABLE "CatalogImaging" ADD COLUMN "selectionNote" TEXT NOT NULL DEFAULT '';
