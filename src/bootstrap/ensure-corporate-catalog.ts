import type { PrismaClient } from "@prisma/client";
import { medicineCatalog } from "./medicine-catalog";

type LabSeed = {
  code: string;
  name: string;
  sample: string;
  section: "haematology" | "chemical-pathology" | "microbiology";
  corporatePriceNaira: number;
  priceNote?: string;
  aliases?: string[];
};

const labs: LabSeed[] = [
  { code: "PCV", name: "PCV", sample: "Blood", section: "haematology", corporatePriceNaira: 3000 },
  { code: "FBC", name: "FBC", sample: "Blood", section: "haematology", corporatePriceNaira: 10000 },
  { code: "ESR", name: "ESR", sample: "Blood", section: "haematology", corporatePriceNaira: 4000 },
  { code: "RETICS", name: "Retics Count", sample: "Blood", section: "haematology", corporatePriceNaira: 5000 },
  { code: "HB-EP", name: "Hb Electrophoresis (Gazelle)", sample: "Blood", section: "haematology", corporatePriceNaira: 8000 },
  { code: "PT-INR", name: "PT/INR", sample: "Blood", section: "haematology", corporatePriceNaira: 10000 },
  { code: "PTTK", name: "PTTK", sample: "Blood", section: "haematology", corporatePriceNaira: 10000 },
  { code: "PT-PTTK", name: "PT/PTTK", sample: "Blood", section: "haematology", corporatePriceNaira: 20000 },
  { code: "BLEED", name: "Bleeding Time", sample: "Blood", section: "haematology", corporatePriceNaira: 3500 },
  { code: "BMA", name: "Bone Marrow Aspiration (BMA)", sample: "Aspirate", section: "haematology", corporatePriceNaira: 20000 },
  { code: "BG", name: "Blood Group", sample: "Blood", section: "haematology", corporatePriceNaira: 3500 },
  { code: "DCT", name: "Direct Coomb's Test (DCT)", sample: "Blood", section: "haematology", corporatePriceNaira: 10000 },
  { code: "ICT", name: "Indirect Coomb's Test (ICT)", sample: "Blood", section: "haematology", corporatePriceNaira: 10000 },
  { code: "XMATCH", name: "Grouping & X-Matching/Unit", sample: "Blood", section: "haematology", corporatePriceNaira: 25000 },
  { code: "AB-TITRE", name: "Antibody Titration", sample: "Blood", section: "haematology", corporatePriceNaira: 20000 },
  { code: "AB-SCREEN", name: "Antibody Screening", sample: "Blood", section: "haematology", corporatePriceNaira: 15000 },
  { code: "UEC", name: "Electrolyte, Urea and Creatinine", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 11000 },
  { code: "LFT", name: "Liver Function Test", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 12000 },
  { code: "LIPID", name: "Lipid Profile", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 11000 },
  { code: "TSH-FT", name: "TSH, FT3, FT4", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 9000, priceNote: "each" },
  { code: "TFT", name: "Thyroid Function Test", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 25000 },
  { code: "REPRO", name: "Reproductive Hormones", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 9000, priceNote: "each" },
  { code: "HBA1C", name: "Glycated Hemoglobin (HbA1c)", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 11000 },
  { code: "PHOS", name: "Inorganic Phosphate", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 2500 },
  { code: "URIC", name: "Uric Acid", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 3000 },
  { code: "CALCIUM", name: "Total Calcium", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 2500 },
  { code: "CRCL", name: "Creatinine Clearance", sample: "Urine", section: "chemical-pathology", corporatePriceNaira: 3000 },
  { code: "FBS", name: "Glucose (FBS)", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 1000 },
  { code: "URINE", name: "Urinalysis", sample: "Urine", section: "chemical-pathology", corporatePriceNaira: 1000 },
  { code: "PREG", name: "Pregnancy Test", sample: "Urine", section: "chemical-pathology", corporatePriceNaira: 1000 },
  { code: "UPROT-24", name: "24 hour Urinary Protein", sample: "Urine", section: "chemical-pathology", corporatePriceNaira: 2500 },
  { code: "ALT-AST-ALP", name: "ALT/AST/ALP", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 2000, priceNote: "each" },
  { code: "BILI", name: "Serum Bilirubin", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 2000 },
  { code: "UREA-CREAT", name: "Urea and Creatinine", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 2500, priceNote: "each" },
  { code: "ELECT", name: "Electrolytes only", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 5000 },
  { code: "OGTT", name: "OGTT", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 4000 },
  { code: "CSF-GP", name: "CSF Glucose/Protein", sample: "CSF", section: "chemical-pathology", corporatePriceNaira: 3000 },
  { code: "ALB-PROT", name: "Plasma Albumin/Protein", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 2500, priceNote: "each" },
  { code: "UMALB", name: "Urinary Microalbumin", sample: "Urine", section: "chemical-pathology", corporatePriceNaira: 7000 },
  { code: "PSA", name: "Prostate Specific Antigen (PSA)", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 12500 },
  { code: "UREA", name: "Urea", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 2500 },
  { code: "CREAT", name: "Creatinine", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 2500 },
  { code: "CHOL", name: "Cholesterol", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 3000 },
  { code: "TRIG", name: "Triglyceride", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 3000 },
  { code: "FBG-2HPP", name: "FBG & 2HPP", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 3000 },
  { code: "CRP", name: "C-reactive protein", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 11000 },
  { code: "ALB", name: "Plasma Albumin", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 2500 },
  { code: "COVID", name: "COVID-19", sample: "Swab", section: "chemical-pathology", corporatePriceNaira: 25000 },
  { code: "DDIMER", name: "D-Dimer", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 11000 },
  { code: "NTPROBNP", name: "NT-ProBNP", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 15000 },
  { code: "CKMB", name: "CK-MB", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 11000 },
  { code: "TROP", name: "Cardiac Troponin I", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 11000 },
  { code: "VITD", name: "Vitamin D", sample: "Blood", section: "chemical-pathology", corporatePriceNaira: 25000 },
  { code: "UPCR", name: "Urine protein creatinine ratio", sample: "Urine", section: "chemical-pathology", corporatePriceNaira: 5000 },
  { code: "MP", name: "Malaria Parasite", sample: "Blood", section: "microbiology", corporatePriceNaira: 5000 },
  { code: "WIDAL", name: "Widal", sample: "Blood", section: "microbiology", corporatePriceNaira: 8000 },
  { code: "SKIN-MF", name: "Skin snip for microfilaria", sample: "Tissue", section: "microbiology", corporatePriceNaira: 7000 },
  { code: "BLOOD-MF", name: "Blood for microfilaria", sample: "Blood", section: "microbiology", corporatePriceNaira: 7000 },
  { code: "OCCULT", name: "Stool for occult blood", sample: "Stool", section: "microbiology", corporatePriceNaira: 6000 },
  { code: "HEPB", name: "Hepatitis B", sample: "Blood", section: "microbiology", corporatePriceNaira: 5500, aliases: ["HBSAG"] },
  { code: "HEPC", name: "Hepatitis C", sample: "Blood", section: "microbiology", corporatePriceNaira: 5500 },
  { code: "RETRO", name: "Retroviral screening", sample: "Blood", section: "microbiology", corporatePriceNaira: 5500 },
  { code: "HEPB-PROF", name: "Hepatitis B profile", sample: "Blood", section: "microbiology", corporatePriceNaira: 10000 },
  { code: "VDRL", name: "VDRL screening", sample: "Blood", section: "microbiology", corporatePriceNaira: 6000 },
  { code: "SFA", name: "Seminal fluid analysis", sample: "Semen", section: "microbiology", corporatePriceNaira: 8000 },
  { code: "URINE-MICRO", name: "Urine microscopy", sample: "Urine", section: "microbiology", corporatePriceNaira: 5500 },
  { code: "CHLAM", name: "Chlamydia test", sample: "Swab", section: "microbiology", corporatePriceNaira: 6000 },
  { code: "STOOL-MICRO", name: "Stool microscopy", sample: "Stool", section: "microbiology", corporatePriceNaira: 6000 },
  { code: "MANTOUX", name: "Mantoux test", sample: "Tissue", section: "microbiology", corporatePriceNaira: 7000 },
  { code: "HPYLORI-STOOL", name: "Helicobacter pylori stool", sample: "Stool", section: "microbiology", corporatePriceNaira: 7000 },
  { code: "HPYLORI-BLOOD", name: "Helicobacter pylori blood", sample: "Blood", section: "microbiology", corporatePriceNaira: 7000 },
  { code: "BLD-CULT", name: "Blood culture", sample: "Blood", section: "microbiology", corporatePriceNaira: 25000 },
  { code: "URINE-MCS", name: "Urine M/C/S", sample: "Urine", section: "microbiology", corporatePriceNaira: 15000 },
  { code: "ASP-MCS", name: "Aspirate M/C/S", sample: "Aspirate", section: "microbiology", corporatePriceNaira: 15000 },
  { code: "STOOL-MCS", name: "Stool M/C/S", sample: "Stool", section: "microbiology", corporatePriceNaira: 15000 },
  { code: "CSF-MCS", name: "CSF M/C/S", sample: "CSF", section: "microbiology", corporatePriceNaira: 15000 },
  { code: "SPUTUM-MCS", name: "Sputum M/C/S", sample: "Sputum", section: "microbiology", corporatePriceNaira: 15000 },
  { code: "BIOPSY-MCS", name: "Biopsy M/C/S", sample: "Tissue", section: "microbiology", corporatePriceNaira: 15000 },
  { code: "SWAB-MCS", name: "Swab M/C/S", sample: "Swab", section: "microbiology", corporatePriceNaira: 15000 },
  { code: "PUS-MCS", name: "Pus M/C/S", sample: "Aspirate", section: "microbiology", corporatePriceNaira: 15000 },
  { code: "SFA-MCS", name: "SFA + M/C/S", sample: "Semen", section: "microbiology", corporatePriceNaira: 15000 },
];

export async function ensureCorporateCatalog(prisma: PrismaClient) {
  for (const item of labs) {
    const codes = [item.code, ...(item.aliases ?? [])];
    let existing: { code: string } | null = null;
    for (const code of codes) {
      existing = await prisma.catalogLaboratory.findUnique({ where: { code }, select: { code: true } });
      if (existing) break;
    }
    const data = {
      name: item.name,
      sample: item.sample,
      section: item.section,
      corporatePriceNaira: item.corporatePriceNaira,
      priceNote: item.priceNote ?? "",
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
}
