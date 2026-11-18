export type LaboratorySeed = {
  code: string;
  name: string;
  sample: string;
  section: string;
  corporatePriceNaira: number;
  priceNote: string;
  synonyms: string;
  selectionNote: string;
  aliases: string[];
};

const guidance = "The container in the catalogue is guidance only. The laboratory confirms the tube, method, and reference interval.";

type Item = {
  name: string;
  sample: string;
  synonyms?: string;
  code?: string;
  price?: number;
  priceNote?: string;
  aliases?: string[];
  note?: string;
};

function codeFor(section: string, name: string, explicit?: string) {
  if (explicit) return explicit;
  const prefix = section.replace(/[^a-zA-Z]+/g, "").slice(0, 4).toUpperCase();
  const slug = name.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toUpperCase().slice(0, 48);
  return `${prefix}-${slug}`;
}

function expand(section: string, items: Item[]): LaboratorySeed[] {
  return items.map((item) => ({
    code: codeFor(section, item.name, item.code),
    name: item.name,
    sample: item.sample,
    section,
    corporatePriceNaira: item.price ?? 0,
    priceNote: item.priceNote ?? "",
    synonyms: item.synonyms ?? "",
    selectionNote: item.note ? `${item.note} ${guidance}` : guidance,
    aliases: item.aliases ?? [],
  }));
}

const haematology = expand("haematology", [
  { name: "Full blood count (FBC/CBC) with differential", sample: "Blood", synonyms: "FBC, CBC, full blood count", code: "FBC", price: 10000, note: "This is one order. It is not split into its component counts." },
  { name: "Full blood count (FBC/CBC) without differential", sample: "Blood", synonyms: "FBC without differential" },
  { name: "Haemoglobin (Hb) estimation", sample: "Blood", synonyms: "Hb, haemoglobin" },
  { name: "Packed cell volume / Haematocrit (PCV/HCT)", sample: "Blood", synonyms: "PCV, HCT, haematocrit", code: "PCV", price: 3000 },
  { name: "Erythrocyte sedimentation rate (ESR)", sample: "Blood", synonyms: "ESR", code: "ESR", price: 4000 },
  { name: "Peripheral blood film (PBF)", sample: "Blood", synonyms: "PBF, blood film" },
  { name: "Reticulocyte count", sample: "Blood", synonyms: "retics", code: "RETICS", price: 5000 },
  { name: "Absolute eosinophil count", sample: "Blood", synonyms: "AEC" },
  { name: "Platelet count", sample: "Blood", synonyms: "platelets" },
  { name: "Malaria parasite quantification on blood film", sample: "Blood", synonyms: "parasite density" },
  { name: "Sickle cell screening test", sample: "Blood", synonyms: "sickle screen", note: "A screening result is not a genotype confirmation." },
  { name: "Haemoglobin genotype / haemoglobinopathy profile", sample: "Blood", synonyms: "Hb electrophoresis, genotype", code: "HB-EP", price: 8000 },
  { name: "G6PD quantitative / qualitative assay", sample: "Blood", synonyms: "G6PD" },
  { name: "Bone marrow aspirate examination", sample: "Aspirate", synonyms: "BMA", code: "BMA", price: 20000 },
  { name: "Bone marrow trephine biopsy", sample: "Tissue", synonyms: "trephine" },
  { name: "PT / Prothrombin time and INR", sample: "Blood", synonyms: "PT, INR, prothrombin time", code: "PT-INR", price: 10000 },
  { name: "APTT / aPTT", sample: "Blood", synonyms: "APTT, PTTK", code: "PTTK", price: 10000 },
  { name: "D-dimer", sample: "Blood", synonyms: "D dimer", code: "DDIMER", price: 11000 },
  { name: "Fibrinogen", sample: "Blood" },
  { name: "Thrombin time", sample: "Blood" },
  { name: "Coagulation factor assay", sample: "Blood", synonyms: "factor VIII, factor IX" },
  { name: "Iron studies: ferritin", sample: "Blood", synonyms: "ferritin" },
  { name: "Iron studies: serum iron", sample: "Blood", synonyms: "serum iron" },
  { name: "Iron studies: transferrin / TIBC", sample: "Blood", synonyms: "TIBC, transferrin" },
  { name: "Bleeding time", sample: "Blood", code: "BLEED", price: 3500 },
]);

const chemistry = expand("chemical-pathology", [
  { name: "Blood glucose - random (RBG)", sample: "Blood", synonyms: "RBG, RBS, random glucose", code: "RBS" },
  { name: "Blood glucose - fasting (FBS/FPG)", sample: "Blood", synonyms: "FBS, FPG, fasting glucose", code: "FBS", price: 1000 },
  { name: "Blood glucose - 2-hour post-prandial", sample: "Blood", synonyms: "2HPP" },
  { name: "Blood glucose - fasting and 2-hour post-prandial", sample: "Blood", synonyms: "FBG, 2HPP", code: "FBG-2HPP", price: 3000, note: "This combined order is not expanded into separate tests." },
  { name: "Oral glucose tolerance test (OGTT)", sample: "Blood", synonyms: "OGTT, GTT", code: "OGTT", price: 4000 },
  { name: "HbA1c", sample: "Blood", synonyms: "glycated haemoglobin, A1c", code: "HBA1C", price: 11000 },
  { name: "Urea", sample: "Blood", synonyms: "blood urea", code: "UREA", price: 2500 },
  { name: "Blood urea nitrogen (BUN)", sample: "Blood", synonyms: "BUN", note: "Do not treat BUN units as the same as urea units." },
  { name: "Creatinine", sample: "Blood", code: "CREAT", price: 2500 },
  { name: "Urea and creatinine", sample: "Blood", synonyms: "urea, creatinine", code: "UREA-CREAT", price: 2500, priceNote: "each", note: "This is one order priced for each analyte. It is not expanded automatically." },
  { name: "Estimated glomerular filtration rate (eGFR)", sample: "Blood", synonyms: "eGFR, GFR" },
  { name: "Creatinine clearance", sample: "Urine", synonyms: "CrCl", code: "CRCL", price: 3000 },
  { name: "Electrolytes: sodium, potassium, chloride, bicarbonate", sample: "Blood", synonyms: "U and E, electrolytes, sodium, potassium", code: "ELECT", price: 5000, note: "This is one electrolyte order. It is not expanded into separate tests." },
  { name: "Renal function panel", sample: "Blood", synonyms: "UEC, RFT, renal profile", code: "UEC", price: 11000, note: "One panel. Components are defined by the laboratory and are not added automatically." },
  { name: "Calcium - total", sample: "Blood", synonyms: "calcium", code: "CALCIUM", price: 2500 },
  { name: "Calcium - ionized", sample: "Blood", synonyms: "ionised calcium" },
  { name: "Magnesium", sample: "Blood" },
  { name: "Phosphate / inorganic phosphorus", sample: "Blood", synonyms: "phosphate", code: "PHOS", price: 2500 },
  { name: "Uric acid", sample: "Blood", code: "URIC", price: 3000 },
  { name: "Liver function panel", sample: "Blood", synonyms: "LFT, liver profile", code: "LFT", price: 12000, note: "One panel. The laboratory defines which components it includes." },
  { name: "ALT (alanine aminotransferase)", sample: "Blood", synonyms: "ALT, SGPT", price: 2000, priceNote: "each" },
  { name: "AST (aspartate aminotransferase)", sample: "Blood", synonyms: "AST, SGOT", price: 2000, priceNote: "each" },
  { name: "Alkaline phosphatase (ALP)", sample: "Blood", synonyms: "ALP", price: 2000, priceNote: "each" },
  { name: "ALT, AST and ALP", sample: "Blood", synonyms: "ALT/AST/ALP", code: "ALT-AST-ALP", price: 2000, priceNote: "each", note: "One order priced for each enzyme. It is not expanded automatically." },
  { name: "Gamma-glutamyl transferase (GGT)", sample: "Blood", synonyms: "GGT" },
  { name: "Bilirubin - total", sample: "Blood", synonyms: "bilirubin", code: "BILI", price: 2000 },
  { name: "Bilirubin - direct / conjugated", sample: "Blood", synonyms: "direct bilirubin" },
  { name: "Albumin", sample: "Blood", synonyms: "plasma albumin", code: "ALB", price: 2500 },
  { name: "Total protein", sample: "Blood", synonyms: "protein" },
  { name: "Plasma albumin and total protein", sample: "Blood", synonyms: "albumin/protein", code: "ALB-PROT", price: 2500, priceNote: "each" },
  { name: "Lipid profile", sample: "Blood", synonyms: "lipids", code: "LIPID", price: 11000, note: "One panel. It is not expanded into cholesterol, HDL, LDL, and triglycerides." },
  { name: "Total cholesterol", sample: "Blood", synonyms: "cholesterol", code: "CHOL", price: 3000 },
  { name: "HDL cholesterol", sample: "Blood", synonyms: "HDL" },
  { name: "LDL cholesterol", sample: "Blood", synonyms: "LDL" },
  { name: "Triglycerides", sample: "Blood", synonyms: "triglyceride", code: "TRIG", price: 3000 },
  { name: "C-reactive protein (CRP)", sample: "Blood", synonyms: "CRP", code: "CRP", price: 11000 },
  { name: "High-sensitivity CRP (hs-CRP)", sample: "Blood", synonyms: "hs-CRP, hsCRP" },
  { name: "Procalcitonin", sample: "Blood", synonyms: "PCT" },
  { name: "Lactate", sample: "Blood" },
  { name: "Amylase", sample: "Blood" },
  { name: "Lipase", sample: "Blood" },
  { name: "Creatine kinase (CK/CPK)", sample: "Blood", synonyms: "CK, CPK" },
  { name: "CK-MB", sample: "Blood", synonyms: "CKMB", code: "CKMB", price: 11000 },
  { name: "Lactate dehydrogenase (LDH)", sample: "Blood", synonyms: "LDH" },
  { name: "Troponin I", sample: "Blood", synonyms: "trop I", code: "TROP", price: 11000 },
  { name: "Troponin T", sample: "Blood", synonyms: "trop T" },
  { name: "BNP / NT-proBNP", sample: "Blood", synonyms: "BNP, NT-proBNP", code: "NTPROBNP", price: 15000 },
  { name: "Serum osmolality", sample: "Blood", synonyms: "osmolality" },
  { name: "Urine osmolality", sample: "Urine" },
  { name: "Blood gas analysis (ABG)", sample: "Blood", synonyms: "ABG, arterial blood gas", code: "ABG" },
  { name: "Blood gas analysis (VBG)", sample: "Blood", synonyms: "VBG, venous blood gas", code: "VBG" },
  { name: "Carboxyhaemoglobin", sample: "Blood", synonyms: "COHb" },
]);

const endocrine = expand("endocrinology", [
  { name: "Thyroid-stimulating hormone (TSH)", sample: "Blood", synonyms: "TSH" },
  { name: "Free T4 (FT4)", sample: "Blood", synonyms: "FT4, free thyroxine" },
  { name: "Free T3 (FT3)", sample: "Blood", synonyms: "FT3" },
  { name: "TSH, FT3 and FT4", sample: "Blood", synonyms: "TFT components", code: "TSH-FT", price: 9000, priceNote: "each", note: "One order priced for each hormone. It is not expanded automatically." },
  { name: "Thyroid function panel", sample: "Blood", synonyms: "TFT, thyroid function test", code: "TFT", price: 25000, note: "One panel. It is not expanded into TSH, FT4, and FT3." },
  { name: "Total T4", sample: "Blood" },
  { name: "Total T3", sample: "Blood" },
  { name: "Thyroid antibodies (anti-TPO)", sample: "Blood", synonyms: "anti-TPO, TPO" },
  { name: "Thyroglobulin antibody", sample: "Blood" },
  { name: "Thyroglobulin", sample: "Blood" },
  { name: "Cortisol - morning", sample: "Blood", synonyms: "morning cortisol" },
  { name: "Cortisol - evening", sample: "Blood" },
  { name: "ACTH", sample: "Blood" },
  { name: "Prolactin", sample: "Blood" },
  { name: "FSH", sample: "Blood" },
  { name: "LH", sample: "Blood" },
  { name: "Estradiol (E2)", sample: "Blood", synonyms: "E2, oestradiol" },
  { name: "Progesterone", sample: "Blood" },
  { name: "Total testosterone", sample: "Blood", synonyms: "testosterone" },
  { name: "Free testosterone", sample: "Blood" },
  { name: "Sex hormone-binding globulin (SHBG)", sample: "Blood", synonyms: "SHBG" },
  { name: "DHEA-S", sample: "Blood", synonyms: "DHEAS" },
  { name: "Reproductive hormones", sample: "Blood", synonyms: "FSH, LH, reproductive", code: "REPRO", price: 9000, priceNote: "each", note: "One order priced for each hormone. It is not expanded automatically." },
  { name: "Beta-hCG - serum quantitative", sample: "Blood", synonyms: "serum hCG, beta hCG" },
  { name: "Pregnancy test - urine hCG", sample: "Urine", synonyms: "urine pregnancy test, PT", code: "PREG", price: 1000 },
  { name: "Insulin", sample: "Blood" },
  { name: "C-peptide", sample: "Blood" },
  { name: "Parathyroid hormone (PTH)", sample: "Blood", synonyms: "PTH" },
  { name: "Vitamin D - 25 OH", sample: "Blood", synonyms: "vitamin D", code: "VITD", price: 25000 },
  { name: "Vitamin B12", sample: "Blood", synonyms: "B12, cobalamin" },
  { name: "Folate", sample: "Blood", synonyms: "folic acid" },
]);

const fluids = expand("body-fluids", [
  { name: "Urinalysis - dipstick", sample: "Urine", synonyms: "urinalysis, dipstick", code: "URINE", price: 1000 },
  { name: "Urine microscopy", sample: "Urine", code: "URINE-MICRO", price: 5500 },
  { name: "Urine microscopy, culture and sensitivity (M/C/S)", sample: "Urine", synonyms: "urine MCS, urine culture", code: "URINE-MCS", price: 15000 },
  { name: "Urine albumin-to-creatinine ratio (ACR)", sample: "Urine", synonyms: "ACR, uACR" },
  { name: "Urine protein-to-creatinine ratio (PCR)", sample: "Urine", synonyms: "PCR, UPCR", code: "UPCR", price: 5000 },
  { name: "Urine microalbumin", sample: "Urine", synonyms: "microalbumin", code: "UMALB", price: 7000 },
  { name: "24 hour urinary protein", sample: "Urine", code: "UPROT-24", price: 2500 },
  { name: "Urine ketones", sample: "Urine" },
  { name: "Urine toxicology screen", sample: "Urine" },
  { name: "Stool microscopy for ova, cysts and parasites (OCP)", sample: "Stool", synonyms: "stool OCP, stool microscopy", code: "STOOL-MICRO", price: 6000 },
  { name: "Stool microscopy, culture and sensitivity (M/C/S)", sample: "Stool", synonyms: "stool MCS", code: "STOOL-MCS", price: 15000 },
  { name: "Stool occult blood (FOB)", sample: "Stool", synonyms: "occult blood, FOB", code: "OCCULT", price: 6000 },
  { name: "Faecal immunochemical test (FIT)", sample: "Stool", synonyms: "FIT" },
  { name: "H. pylori stool antigen", sample: "Stool", synonyms: "helicobacter stool", code: "HPYLORI-STOOL", price: 7000 },
  { name: "H. pylori blood test", sample: "Blood", synonyms: "helicobacter blood", code: "HPYLORI-BLOOD", price: 7000 },
  { name: "H. pylori urea breath test", sample: "Breath", synonyms: "UBT" },
  { name: "Faecal calprotectin", sample: "Stool", synonyms: "calprotectin" },
  { name: "C. difficile toxin / antigen", sample: "Stool", synonyms: "C diff" },
  { name: "CSF analysis: cell count and differential", sample: "CSF", synonyms: "CSF cell count" },
  { name: "CSF protein and glucose", sample: "CSF", synonyms: "CSF chemistry", code: "CSF-GP", price: 3000 },
  { name: "CSF microscopy, culture and sensitivity", sample: "CSF", synonyms: "CSF MCS", code: "CSF-MCS", price: 15000 },
  { name: "Pleural fluid analysis", sample: "Fluid", synonyms: "pleural fluid" },
  { name: "Ascitic fluid analysis", sample: "Fluid", synonyms: "ascitic fluid" },
  { name: "Synovial fluid analysis", sample: "Fluid", synonyms: "joint fluid" },
  { name: "Pericardial fluid analysis", sample: "Fluid" },
  { name: "Semen analysis", sample: "Semen", synonyms: "SFA", code: "SFA", price: 8000 },
  { name: "Semen analysis with culture", sample: "Semen", synonyms: "SFA MCS", code: "SFA-MCS", price: 15000 },
]);

const microbiology = expand("microbiology", [
  { name: "Blood culture - adult set", sample: "Blood", synonyms: "blood culture", code: "BLD-CULT", price: 25000 },
  { name: "Blood culture - paediatric", sample: "Blood", synonyms: "paediatric blood culture" },
  { name: "Sputum microscopy, culture and sensitivity", sample: "Sputum", synonyms: "sputum MCS", code: "SPUTUM-MCS", price: 15000 },
  { name: "Wound swab culture and sensitivity", sample: "Swab", synonyms: "wound swab, swab MCS", code: "SWAB-MCS", price: 15000 },
  { name: "Pus / abscess culture and sensitivity", sample: "Aspirate", synonyms: "pus MCS", code: "PUS-MCS", price: 15000 },
  { name: "Biopsy microscopy, culture and sensitivity", sample: "Tissue", synonyms: "biopsy MCS", code: "BIOPSY-MCS", price: 15000 },
  { name: "Throat swab culture", sample: "Swab" },
  { name: "Nasal swab culture", sample: "Swab" },
  { name: "High vaginal swab (HVS) M/C/S", sample: "Swab", synonyms: "HVS" },
  { name: "Endocervical swab culture", sample: "Swab", synonyms: "ECS" },
  { name: "Urethral swab culture", sample: "Swab" },
  { name: "Ear swab culture", sample: "Swab" },
  { name: "Eye swab culture", sample: "Swab" },
  { name: "Aspirate / body fluid culture", sample: "Aspirate", synonyms: "aspirate MCS", code: "ASP-MCS", price: 15000 },
  { name: "Anaerobic culture", sample: "Aspirate" },
  { name: "Fungal microscopy and culture", sample: "Tissue", synonyms: "fungal culture" },
  { name: "AFB smear microscopy", sample: "Sputum", synonyms: "AFB, ZN stain" },
  { name: "Mycobacterial culture", sample: "Sputum", synonyms: "TB culture" },
  { name: "Antimicrobial susceptibility testing (AST)", sample: "Isolate", synonyms: "AST, sensitivity" },
  { name: "Mantoux test", sample: "Tissue", synonyms: "tuberculin", code: "MANTOUX", price: 7000 },
]);

const parasitology = expand("parasitology", [
  { name: "Malaria rapid diagnostic test (RDT)", sample: "Blood", synonyms: "malaria RDT, mRDT" },
  { name: "Malaria thick and thin blood film", sample: "Blood", synonyms: "malaria parasite, MP", code: "MP", price: 5000 },
  { name: "Blood film for microfilaria", sample: "Blood", synonyms: "microfilaria", code: "BLOOD-MF", price: 7000 },
  { name: "Skin snip for microfilaria", sample: "Tissue", synonyms: "skin snip", code: "SKIN-MF", price: 7000 },
  { name: "Stool concentration / parasite microscopy", sample: "Stool" },
  { name: "Urine microscopy for Schistosoma haematobium", sample: "Urine", synonyms: "schistosomiasis urine" },
  { name: "Kato-Katz stool examination", sample: "Stool", synonyms: "Kato Katz" },
  { name: "HIV 1 and 2 screening test", sample: "Blood", synonyms: "HIV, retroviral", code: "RETRO", price: 5500 },
  { name: "HIV confirmatory / supplemental assay", sample: "Blood", synonyms: "HIV confirmation" },
  { name: "HIV viral load (HIV RNA)", sample: "Blood", synonyms: "HIV viral load" },
  { name: "CD4 count", sample: "Blood", synonyms: "CD4" },
  { name: "Hepatitis B surface antigen (HBsAg)", sample: "Blood", synonyms: "HBsAg, hepatitis B", code: "HBSAG", price: 5500, aliases: ["HEPB"] },
  { name: "Hepatitis B core antibody (anti-HBc)", sample: "Blood", synonyms: "anti-HBc" },
  { name: "Hepatitis B surface antibody (anti-HBs)", sample: "Blood", synonyms: "anti-HBs" },
  { name: "Hepatitis B e-antigen (HBeAg)", sample: "Blood", synonyms: "HBeAg" },
  { name: "Hepatitis B profile", sample: "Blood", synonyms: "HBV profile", code: "HEPB-PROF", price: 10000, note: "One profile. It is not expanded into separate hepatitis B tests." },
  { name: "HBV DNA viral load", sample: "Blood", synonyms: "HBV viral load" },
  { name: "Hepatitis C antibody (anti-HCV)", sample: "Blood", synonyms: "HCV, hepatitis C", code: "HEPC", price: 5500 },
  { name: "HCV RNA PCR", sample: "Blood", synonyms: "HCV PCR" },
  { name: "Syphilis screening (RPR / VDRL)", sample: "Blood", synonyms: "VDRL, RPR", code: "VDRL", price: 6000 },
  { name: "Syphilis treponemal test (TPHA / TPPA)", sample: "Blood", synonyms: "TPHA, TPPA" },
  { name: "Widal test", sample: "Blood", synonyms: "Widal", code: "WIDAL", price: 8000 },
  { name: "Gonorrhoea and chlamydia NAAT", sample: "Swab", synonyms: "chlamydia, gonorrhoea, NAAT", code: "CHLAM", price: 6000 },
  { name: "HPV DNA test", sample: "Swab", synonyms: "HPV" },
  { name: "COVID-19 antigen test", sample: "Swab", synonyms: "COVID antigen" },
  { name: "SARS-CoV-2 PCR / NAAT", sample: "Swab", synonyms: "COVID PCR, COVID-19", code: "COVID", price: 25000 },
  { name: "Dengue NS1 antigen", sample: "Blood", synonyms: "dengue NS1" },
  { name: "Dengue IgM", sample: "Blood" },
  { name: "Dengue IgG", sample: "Blood" },
  { name: "Lassa fever molecular test", sample: "Blood", note: "Public-health referral only. Do not collect this as a routine walk-in test." },
  { name: "Ebola / viral haemorrhagic fever molecular test", sample: "Blood", note: "Public-health referral only. Do not collect this as a routine walk-in test." },
  { name: "Yellow fever testing", sample: "Blood" },
  { name: "Chikungunya testing", sample: "Blood" },
  { name: "Lymphatic filariasis testing", sample: "Blood" },
]);

const serology = expand("serology", [
  { name: "Rheumatoid factor (RF)", sample: "Blood", synonyms: "RF" },
  { name: "Anti-CCP antibody", sample: "Blood", synonyms: "anti-CCP" },
  { name: "Antinuclear antibody (ANA)", sample: "Blood", synonyms: "ANA" },
  { name: "Anti-dsDNA antibody", sample: "Blood", synonyms: "dsDNA" },
  { name: "Extractable nuclear antigen (ENA) profile", sample: "Blood", synonyms: "ENA", note: "One profile. The laboratory lists the components. They are not added automatically." },
  { name: "ANCA (PR3 / MPO)", sample: "Blood", synonyms: "ANCA" },
  { name: "Antistreptolysin O titre (ASO/ASOT)", sample: "Blood", synonyms: "ASO, ASOT" },
  { name: "Complement C3", sample: "Blood", synonyms: "C3" },
  { name: "Complement C4", sample: "Blood", synonyms: "C4" },
  { name: "Immunoglobulins IgG, IgA and IgM", sample: "Blood", synonyms: "immunoglobulins" },
  { name: "Total IgE", sample: "Blood", synonyms: "IgE" },
  { name: "Specific IgE allergen panel", sample: "Blood", synonyms: "RAST", note: "One panel. The allergen list is defined by the laboratory." },
  { name: "Anticardiolipin antibody", sample: "Blood" },
  { name: "Lupus anticoagulant screen", sample: "Blood", synonyms: "lupus anticoagulant" },
  { name: "HLA typing", sample: "Blood", synonyms: "HLA" },
]);

const bloodBank = expand("blood-bank", [
  { name: "ABO blood grouping", sample: "Blood", synonyms: "blood group ABO" },
  { name: "Rhesus D (RhD) typing", sample: "Blood", synonyms: "Rh, rhesus" },
  { name: "ABO and RhD grouping", sample: "Blood", synonyms: "blood group, grouping", code: "BG", price: 3500 },
  { name: "Antibody screen", sample: "Blood", synonyms: "antibody screening", code: "AB-SCREEN", price: 15000 },
  { name: "Antibody identification panel", sample: "Blood" },
  { name: "Antibody titration", sample: "Blood", code: "AB-TITRE", price: 20000 },
  { name: "Crossmatch / compatibility testing", sample: "Blood", synonyms: "crossmatch, x-match", code: "XMATCH", price: 25000 },
  { name: "Direct antiglobulin test (DAT / direct Coombs)", sample: "Blood", synonyms: "DCT, DAT, Coombs", code: "DCT", price: 10000 },
  { name: "Indirect antiglobulin test (IAT / indirect Coombs)", sample: "Blood", synonyms: "ICT, IAT", code: "ICT", price: 10000 },
  { name: "Transfusion reaction work-up", sample: "Blood" },
  { name: "Sickle cell screen for transfusion planning", sample: "Blood" },
]);

const histopathology = expand("histopathology", [
  { name: "Histopathology - surgical biopsy", sample: "Tissue", synonyms: "biopsy histology" },
  { name: "Histopathology - surgical resection", sample: "Tissue", synonyms: "resection histology" },
  { name: "Fine needle aspiration cytology (FNAC)", sample: "Aspirate", synonyms: "FNAC, FNA cytology" },
  { name: "Exfoliative cytology", sample: "Fluid" },
  { name: "Cervical cytology / Pap smear", sample: "Swab", synonyms: "Pap smear, cervical cytology" },
  { name: "Pleural / ascitic fluid cytology", sample: "Fluid", synonyms: "fluid cytology" },
  { name: "Immunohistochemistry (IHC) panel", sample: "Tissue", synonyms: "IHC", note: "One panel. Requested markers are not added as separate tests." },
  { name: "Breast cancer IHC panel (ER, PR, HER2, Ki-67)", sample: "Tissue", synonyms: "ER PR HER2" },
  { name: "Flow cytometry / immunophenotyping", sample: "Blood", synonyms: "flow cytometry" },
  { name: "Prostate-specific antigen (PSA)", sample: "Blood", synonyms: "PSA", code: "PSA", price: 12500 },
  { name: "Alpha-fetoprotein (AFP)", sample: "Blood", synonyms: "AFP" },
  { name: "CEA", sample: "Blood", synonyms: "carcinoembryonic antigen" },
  { name: "CA-125", sample: "Blood", synonyms: "CA125" },
  { name: "CA 19-9", sample: "Blood", synonyms: "CA19-9" },
  { name: "CA 15-3", sample: "Blood", synonyms: "CA15-3" },
]);

const molecular = expand("molecular", [
  { name: "TB nucleic acid amplification test (Xpert MTB/RIF Ultra)", sample: "Sputum", synonyms: "GeneXpert, Xpert, TB NAAT" },
  { name: "TB line probe assay (LPA)", sample: "Sputum", synonyms: "LPA" },
  { name: "TB drug susceptibility testing", sample: "Sputum", synonyms: "TB DST" },
  { name: "Bacterial pathogen PCR panel", sample: "Swab", note: "One panel. Targets are not added automatically." },
  { name: "Respiratory pathogen molecular panel", sample: "Swab", note: "One panel. Targets are not added automatically." },
  { name: "Gastrointestinal pathogen PCR panel", sample: "Stool", note: "One panel. Targets are not added automatically." },
  { name: "HPV genotyping", sample: "Swab" },
  { name: "CMV PCR / viral load", sample: "Blood", synonyms: "CMV" },
  { name: "EBV PCR", sample: "Blood", synonyms: "EBV" },
  { name: "BCR-ABL1 molecular test", sample: "Blood", synonyms: "BCR-ABL" },
  { name: "BRCA1 / BRCA2 genetic test", sample: "Blood", synonyms: "BRCA", note: "Needs counselling and consent. It is not ordered from a diagnosis alone." },
  { name: "Inherited disease / carrier screening panel", sample: "Blood", note: "One panel. The exact genes are defined by the laboratory." },
  { name: "Karyotype / chromosome analysis", sample: "Blood", synonyms: "karyotype" },
  { name: "Germline / somatic mutation panel", sample: "Blood", note: "One panel. Genes are not added automatically." },
  { name: "Lassa / epidemic pathogen sequencing", sample: "Blood", note: "Public-health laboratory only." },
]);

const toxicology = expand("toxicology", [
  { name: "Blood alcohol level", sample: "Blood", synonyms: "ethanol, alcohol" },
  { name: "Paracetamol (acetaminophen) level", sample: "Blood", synonyms: "paracetamol level" },
  { name: "Salicylate level", sample: "Blood", synonyms: "aspirin level" },
  { name: "Lithium level", sample: "Blood" },
  { name: "Digoxin level", sample: "Blood" },
  { name: "Valproate level", sample: "Blood" },
  { name: "Carbamazepine level", sample: "Blood" },
  { name: "Phenytoin level", sample: "Blood" },
  { name: "Phenobarbital level", sample: "Blood" },
  { name: "Heavy metal screen", sample: "Blood", synonyms: "lead, mercury" },
  { name: "Organophosphate / pesticide toxicology", sample: "Blood" },
]);

const panels = expand("panels", [
  { name: "Coagulation profile", sample: "Blood", synonyms: "PT PTTK, clotting profile", code: "PT-PTTK", price: 20000, note: "One profile for PT/INR and APTT. Fibrinogen and D-dimer stay separate." },
  { name: "Iron profile", sample: "Blood", synonyms: "iron studies", note: "One profile. Ferritin, iron, and transferrin are not added automatically." },
  { name: "Antenatal booking profile", sample: "Blood", synonyms: "booking bloods", note: "One profile. The laboratory defines the booking tests. They are not added automatically." },
  { name: "Pre-operative profile", sample: "Blood", synonyms: "pre-op bloods", note: "One profile. Tests are not added automatically." },
  { name: "Sepsis work-up", sample: "Blood", synonyms: "sepsis screen", note: "One shortcut. Blood culture and other tests are not added unless the doctor selects them." },
  { name: "Diabetes monitoring profile", sample: "Blood", synonyms: "diabetes profile", note: "One profile. HbA1c, glucose, and other tests are not added automatically." },
]);

function unique(rows: LaboratorySeed[]) {
  const seen = new Set<string>();
  for (const row of rows) {
    if (seen.has(row.code)) throw new Error(`Duplicate laboratory code ${row.code}`);
    seen.add(row.code);
  }
  return rows;
}

export const laboratoryCatalog: LaboratorySeed[] = unique([
  ...haematology,
  ...chemistry,
  ...endocrine,
  ...fluids,
  ...microbiology,
  ...parasitology,
  ...serology,
  ...bloodBank,
  ...histopathology,
  ...molecular,
  ...toxicology,
  ...panels,
]);
