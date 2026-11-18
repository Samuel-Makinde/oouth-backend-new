import type { PrismaClient } from "@prisma/client";
import { diagnosisCatalog } from "./diagnosis-catalog";
import { imagingCatalog } from "./imaging-catalog";
import { laboratoryCatalog } from "./laboratory-catalog";
import { medicineCatalog } from "./medicine-catalog";

export async function ensureCorporateCatalog(prisma: PrismaClient) {
  for (const item of laboratoryCatalog) {
    const codes = [item.code, ...item.aliases];
    let existing: { code: string; corporatePriceNaira: number } | null = null;
    for (const code of codes) {
      existing = await prisma.catalogLaboratory.findUnique({ where: { code }, select: { code: true, corporatePriceNaira: true } });
      if (existing) break;
    }
    const corporatePriceNaira = item.corporatePriceNaira > 0 ? item.corporatePriceNaira : existing?.corporatePriceNaira ?? 0;
    const data = {
      name: item.name,
      sample: item.sample,
      section: item.section,
      corporatePriceNaira,
      priceNote: item.priceNote,
      synonyms: item.synonyms,
      selectionNote: item.selectionNote,
    };
    if (existing) {
      await prisma.catalogLaboratory.update({ where: { code: existing.code }, data });
    } else {
      await prisma.catalogLaboratory.create({ data: { code: item.code, ...data } });
    }
  }

  for (const drug of medicineCatalog) {
    const data = {
      name: drug.name,
      category: drug.category,
      form: drug.form,
      strength: drug.strength,
      route: drug.route,
      strengthUnit: drug.strengthUnit,
      aware: drug.aware,
      safetyNote: drug.safetyNote,
      ingredients: drug.ingredients,
    };
    const existing = await prisma.catalogMedication.findUnique({ where: { code: drug.code }, select: { code: true } });
    if (existing) await prisma.catalogMedication.update({ where: { code: drug.code }, data });
    else await prisma.catalogMedication.create({ data: { code: drug.code, ...data } });
  }

  for (const diagnosis of diagnosisCatalog) {
    const data = {
      name: diagnosis.name,
      system: diagnosis.system,
      category: diagnosis.category,
      conceptType: diagnosis.conceptType,
      synonyms: diagnosis.synonyms,
    };
    const existing = await prisma.catalogDiagnosis.findUnique({ where: { code: diagnosis.code }, select: { code: true } });
    if (existing) await prisma.catalogDiagnosis.update({ where: { code: diagnosis.code }, data });
    else await prisma.catalogDiagnosis.create({ data: { code: diagnosis.code, ...data } });
  }

  for (const study of imagingCatalog) {
    const data = {
      name: study.name,
      modality: study.modality,
      bodyRegion: study.bodyRegion,
      synonyms: study.synonyms,
      selectionNote: study.selectionNote,
    };
    const existing = await prisma.catalogImaging.findUnique({ where: { code: study.code }, select: { code: true } });
    if (existing) await prisma.catalogImaging.update({ where: { code: study.code }, data });
    else await prisma.catalogImaging.create({ data: { code: study.code, ...data } });
  }
}
