export type MedicineSeed = {
  code: string;
  name: string;
  category: string;
  form: string;
  strength: string;
  route: string;
  strengthUnit: string;
  aware: string;
  safetyNote: string;
  ingredients: string;
};

const product = "The strength is the product. Enter the dose, frequency, duration, and quantity for this patient.";
const antibiotic = "Antibiotic. Record the indication and how long it should continue. The strength is the product, not the dose.";
const controlled = "Controlled medicine. Record the indication, quantity, and prescriber. The strength is the product, not the dose.";
const highAlert = "High-alert medicine. Confirm the indication and the checks this patient needs. The strength is the product, not the dose.";
const insulin = "High-alert. Enter the dose in units, not millilitres. The strength is the product, not the dose.";

type Spec = {
  name: string;
  category: string;
  form: string;
  route: string;
  unit: string;
  strengths: string[];
  aware?: string;
  safety?: string;
  ingredientNames?: string[];
  codes?: Record<string, string>;
};

function codeFor(name: string, form: string, strength: string) {
  const generic = name.replace(/[^a-zA-Z]+/g, "").slice(0, 12).toUpperCase();
  const dosageForm = form.replace(/[^a-zA-Z]+/g, "").slice(0, 4).toUpperCase();
  const amount = strength.replace(/[^a-zA-Z0-9]+/g, "").toUpperCase().slice(0, 18);
  return `${generic}-${dosageForm}-${amount}`.slice(0, 48);
}

function ingredientsFor(names: string[] | undefined, strength: string) {
  if (!names?.length) return "";
  const parts = strength.split("+").map((part) => part.trim());
  if (parts.length !== names.length) return names.join("; ");
  return names.map((name, index) => `${name} ${parts[index]}`).join("; ");
}

function expand(specs: Spec[]): MedicineSeed[] {
  const rows: MedicineSeed[] = [];
  for (const spec of specs) {
    for (const strength of spec.strengths) {
      rows.push({
        code: spec.codes?.[strength] ?? codeFor(spec.name, spec.form, strength),
        name: spec.name,
        category: spec.category,
        form: spec.form,
        strength,
        route: spec.route,
        strengthUnit: spec.unit,
        aware: spec.aware ?? "",
        safetyNote: spec.safety ?? product,
        ingredients: ingredientsFor(spec.ingredientNames, strength),
      });
    }
  }
  const seen = new Set<string>();
  for (const row of rows) {
    if (seen.has(row.code)) throw new Error(`Duplicate medicine code ${row.code}`);
    seen.add(row.code);
  }
  return rows;
}

const specs: Spec[] = [
  { name: "Paracetamol", category: "Analgesic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["125 mg", "500 mg"], safety: "Check for another paracetamol product on this prescription. The strength is the product, not the dose.", codes: { "500 mg": "PARA-500" } },
  { name: "Paracetamol", category: "Analgesic", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["125 mg/5 mL"], safety: "Check for another paracetamol product on this prescription. The strength is the product, not the dose." },
  { name: "Paracetamol", category: "Analgesic", form: "Injection", route: "Intravenous", unit: "mg/mL", strengths: ["150 mg/mL"], safety: "Check for another paracetamol product on this prescription. The strength is the product, not the dose." },
  { name: "Paracetamol", category: "Analgesic", form: "Suppository", route: "Rectal", unit: "mg", strengths: ["100 mg"], safety: "Check for another paracetamol product on this prescription. The strength is the product, not the dose." },
  { name: "Acetylsalicylic acid (aspirin)", category: "Analgesic", form: "Capsule", route: "Oral", unit: "mg", strengths: ["300 mg"] },
  { name: "Acetylsalicylic acid (aspirin)", category: "Analgesic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["300 mg"] },
  { name: "Ibuprofen", category: "Analgesic", form: "Capsule", route: "Oral", unit: "mg", strengths: ["200 mg", "400 mg"] },
  { name: "Ibuprofen", category: "Analgesic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["200 mg", "400 mg"], codes: { "400 mg": "IBU-400" } },
  { name: "Naproxen", category: "Analgesic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["250 mg", "500 mg"] },
  { name: "Ketorolac", category: "Analgesic", form: "Injection", route: "", unit: "mg/mL", strengths: ["30 mg/mL"], safety: "Typical routes: intramuscular or intravenous. The strength is the product, not the dose." },
  { name: "Tramadol", category: "Analgesic", form: "Capsule", route: "Oral", unit: "mg", strengths: ["50 mg", "100 mg"], safety: controlled },
  { name: "Tramadol", category: "Analgesic", form: "Injection", route: "", unit: "mg/mL", strengths: ["50 mg/mL", "100 mg/2 mL"], safety: "Controlled medicine. Typical routes: intramuscular or intravenous. The strength is the product, not the dose." },
  { name: "Morphine", category: "Analgesic", form: "Injection", route: "", unit: "mg/mL", strengths: ["10 mg/mL", "15 mg/mL"], safety: "Controlled medicine and high-alert. Typical routes: intravenous or subcutaneous. The strength is the product, not the dose." },
  { name: "Morphine", category: "Analgesic", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["10 mg/5 mL"], safety: controlled },
  { name: "Morphine", category: "Analgesic", form: "Modified-release tablet", route: "Oral", unit: "mg", strengths: ["10 mg", "30 mg", "60 mg"], safety: "Controlled medicine and high-alert. Modified-release: do not crush. The strength is the product, not the dose." },

  { name: "Amoxicillin", category: "Antibiotic", form: "Capsule", route: "Oral", unit: "mg", strengths: ["250 mg", "500 mg"], aware: "Access", safety: antibiotic, codes: { "500 mg": "AMOX-500" } },
  { name: "Amoxicillin", category: "Antibiotic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["250 mg", "500 mg"], aware: "Access", safety: antibiotic },
  { name: "Amoxicillin", category: "Antibiotic", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["125 mg/5 mL", "250 mg/5 mL"], aware: "Access", safety: antibiotic },
  { name: "Amoxicillin", category: "Antibiotic", form: "Injection", route: "", unit: "mg", strengths: ["250 mg", "500 mg", "1 g"], aware: "Access", safety: "Antibiotic. Typical routes: intravenous or intramuscular, as the product allows. The strength is the product, not the dose." },
  { name: "Amoxicillin + clavulanic acid", category: "Antibiotic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["250 mg + 125 mg", "500 mg + 125 mg", "875 mg + 125 mg"], aware: "Access", safety: antibiotic, ingredientNames: ["Amoxicillin", "Clavulanic acid"], codes: { "500 mg + 125 mg": "COAMOX-625" } },
  { name: "Amoxicillin + clavulanic acid", category: "Antibiotic", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["125 mg + 31.25 mg/5 mL", "250 mg + 62.5 mg/5 mL"], aware: "Access", safety: antibiotic, ingredientNames: ["Amoxicillin", "Clavulanic acid"] },
  { name: "Amoxicillin + clavulanic acid", category: "Antibiotic", form: "Injection", route: "Intravenous", unit: "mg", strengths: ["500 mg + 100 mg", "1 g + 200 mg"], aware: "Access", safety: antibiotic, ingredientNames: ["Amoxicillin", "Clavulanic acid"] },
  { name: "Ampicillin", category: "Antibiotic", form: "Capsule", route: "Oral", unit: "mg", strengths: ["250 mg", "500 mg"], aware: "Access", safety: antibiotic },
  { name: "Ampicillin", category: "Antibiotic", form: "Injection", route: "", unit: "mg", strengths: ["500 mg", "1 g"], aware: "Access", safety: "Antibiotic. Typical routes: intravenous or intramuscular, as the product allows. The strength is the product, not the dose." },
  { name: "Benzylpenicillin", category: "Antibiotic", form: "Injection", route: "", unit: "mg", strengths: ["600 mg (1 million units)", "3 g (5 million units)"], aware: "Access", safety: "Antibiotic. Typical routes: intravenous or intramuscular. The strength is the product, not the dose." },
  { name: "Cephalexin", category: "Antibiotic", form: "Capsule", route: "Oral", unit: "mg", strengths: ["250 mg", "500 mg"], aware: "Access", safety: antibiotic },
  { name: "Cephalexin", category: "Antibiotic", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["125 mg/5 mL", "250 mg/5 mL"], aware: "Access", safety: antibiotic },
  { name: "Clindamycin", category: "Antibiotic", form: "Capsule", route: "Oral", unit: "mg", strengths: ["150 mg", "300 mg"], aware: "Access", safety: antibiotic },
  { name: "Clindamycin", category: "Antibiotic", form: "Injection", route: "", unit: "mg/mL", strengths: ["150 mg/mL"], aware: "Access", safety: "Antibiotic. Typical routes: intravenous or intramuscular. The strength is the product, not the dose." },
  { name: "Cloxacillin", category: "Antibiotic", form: "Capsule", route: "Oral", unit: "mg", strengths: ["250 mg", "500 mg"], aware: "Access", safety: antibiotic },
  { name: "Cloxacillin", category: "Antibiotic", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["125 mg/5 mL"], aware: "Access", safety: antibiotic },
  { name: "Cloxacillin", category: "Antibiotic", form: "Injection", route: "", unit: "mg", strengths: ["500 mg"], aware: "Access", safety: "Antibiotic. Typical routes: intravenous or intramuscular, as the product allows. The strength is the product, not the dose." },
  { name: "Doxycycline", category: "Antibiotic", form: "Capsule", route: "Oral", unit: "mg", strengths: ["100 mg"], aware: "Access", safety: antibiotic },
  { name: "Flucloxacillin", category: "Antibiotic", form: "Capsule", route: "Oral", unit: "mg", strengths: ["250 mg", "500 mg"], aware: "Access", safety: antibiotic },
  { name: "Flucloxacillin", category: "Antibiotic", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["125 mg/5 mL"], aware: "Access", safety: antibiotic },
  { name: "Gentamicin", category: "Antibiotic", form: "Injection", route: "", unit: "mg/mL", strengths: ["40 mg/mL (2 mL)"], aware: "Access", safety: "Antibiotic. Typical routes: intramuscular or intravenous. Review kidney function and hearing. The strength is the product, not the dose." },
  { name: "Metronidazole", category: "Antibiotic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["200 mg", "400 mg"], aware: "Access", safety: antibiotic },
  { name: "Metronidazole", category: "Antibiotic", form: "Infusion", route: "Intravenous", unit: "mg", strengths: ["500 mg/100 mL"], aware: "Access", safety: antibiotic },
  { name: "Nitrofurantoin", category: "Antibiotic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["50 mg", "100 mg"], aware: "Access", safety: antibiotic },
  { name: "Sulfamethoxazole + trimethoprim (co-trimoxazole)", category: "Antibiotic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["100 mg + 20 mg", "400 mg + 80 mg", "800 mg + 160 mg"], aware: "Access", safety: antibiotic, ingredientNames: ["Sulfamethoxazole", "Trimethoprim"] },
  { name: "Sulfamethoxazole + trimethoprim (co-trimoxazole)", category: "Antibiotic", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["200 mg + 40 mg/5 mL"], aware: "Access", safety: antibiotic, ingredientNames: ["Sulfamethoxazole", "Trimethoprim"] },
  { name: "Sulfamethoxazole + trimethoprim (co-trimoxazole)", category: "Antibiotic", form: "Injection", route: "Intravenous", unit: "mg/mL", strengths: ["80 mg + 16 mg/mL"], aware: "Access", safety: antibiotic, ingredientNames: ["Sulfamethoxazole", "Trimethoprim"] },
  { name: "Azithromycin", category: "Antibiotic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["250 mg", "500 mg"], aware: "Watch", safety: antibiotic },
  { name: "Azithromycin", category: "Antibiotic", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["200 mg/5 mL"], aware: "Watch", safety: antibiotic },
  { name: "Cefixime", category: "Antibiotic", form: "Capsule", route: "Oral", unit: "mg", strengths: ["200 mg", "400 mg"], aware: "Watch", safety: antibiotic },
  { name: "Cefixime", category: "Antibiotic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["200 mg", "400 mg"], aware: "Watch", safety: antibiotic },
  { name: "Cefixime", category: "Antibiotic", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["100 mg/5 mL"], aware: "Watch", safety: antibiotic },
  { name: "Ceftriaxone", category: "Antibiotic", form: "Injection", route: "", unit: "mg", strengths: ["250 mg", "500 mg", "1 g"], aware: "Watch", safety: "Antibiotic. Typical routes: intravenous or intramuscular. The strength is the product, not the dose." },
  { name: "Cefuroxime", category: "Antibiotic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["250 mg", "500 mg"], aware: "Watch", safety: antibiotic },
  { name: "Cefuroxime", category: "Antibiotic", form: "Injection", route: "", unit: "mg", strengths: ["750 mg", "1.5 g"], aware: "Watch", safety: "Antibiotic. Typical routes: intravenous or intramuscular. The strength is the product, not the dose." },
  { name: "Ciprofloxacin", category: "Antibiotic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["250 mg", "500 mg"], aware: "Watch", safety: antibiotic, codes: { "500 mg": "CIPRO-500" } },
  { name: "Ciprofloxacin", category: "Antibiotic", form: "Infusion", route: "Intravenous", unit: "mg/mL", strengths: ["2 mg/mL in 50 mL", "2 mg/mL in 100 mL"], aware: "Watch", safety: antibiotic },

  { name: "Artemether + lumefantrine", category: "Antimalarial", form: "Tablet", route: "Oral", unit: "mg", strengths: ["20 mg + 120 mg", "40 mg + 240 mg", "80 mg + 480 mg"], ingredientNames: ["Artemether", "Lumefantrine"], codes: { "80 mg + 480 mg": "AL-80-480" } },
  { name: "Artesunate", category: "Antimalarial", form: "Injection", route: "", unit: "mg", strengths: ["60 mg"], safety: "Typical routes: intravenous or intramuscular. Reconstitute as the product label says. The strength is the product, not the dose.", codes: { "60 mg": "ART-60" } },
  { name: "Artesunate + amodiaquine", category: "Antimalarial", form: "Tablet", route: "Oral", unit: "mg", strengths: ["25 mg + 67.5 mg", "50 mg + 135 mg", "100 mg + 270 mg"], ingredientNames: ["Artesunate", "Amodiaquine"] },
  { name: "Dihydroartemisinin + piperaquine", category: "Antimalarial", form: "Tablet", route: "Oral", unit: "mg", strengths: ["20 mg + 160 mg", "40 mg + 320 mg"], ingredientNames: ["Dihydroartemisinin", "Piperaquine"] },

  { name: "Amlodipine", category: "Cardiovascular", form: "Tablet", route: "Oral", unit: "mg", strengths: ["5 mg", "10 mg"], codes: { "5 mg": "AML-5" } },
  { name: "Atenolol", category: "Cardiovascular", form: "Tablet", route: "Oral", unit: "mg", strengths: ["25 mg", "50 mg", "100 mg"] },
  { name: "Bisoprolol", category: "Cardiovascular", form: "Tablet", route: "Oral", unit: "mg", strengths: ["1.25 mg", "5 mg"] },
  { name: "Captopril", category: "Cardiovascular", form: "Tablet", route: "Oral", unit: "mg", strengths: ["12.5 mg", "25 mg", "50 mg"] },
  { name: "Enalapril", category: "Cardiovascular", form: "Tablet", route: "Oral", unit: "mg", strengths: ["5 mg", "10 mg"] },
  { name: "Lisinopril", category: "Cardiovascular", form: "Tablet", route: "Oral", unit: "mg", strengths: ["5 mg", "10 mg"] },
  { name: "Losartan", category: "Cardiovascular", form: "Tablet", route: "Oral", unit: "mg", strengths: ["25 mg", "50 mg"], codes: { "50 mg": "LOS-50" } },
  { name: "Losartan + hydrochlorothiazide", category: "Cardiovascular", form: "Tablet", route: "Oral", unit: "mg", strengths: ["50 mg + 12.5 mg", "100 mg + 12.5 mg", "100 mg + 25 mg"], ingredientNames: ["Losartan", "Hydrochlorothiazide"] },
  { name: "Hydrochlorothiazide", category: "Cardiovascular", form: "Tablet", route: "Oral", unit: "mg", strengths: ["12.5 mg", "25 mg"] },
  { name: "Nifedipine", category: "Cardiovascular", form: "Tablet", route: "Oral", unit: "mg", strengths: ["20 mg"], safety: "Record whether this product is immediate-release or modified-release. Do not crush a modified-release tablet. The strength is the product, not the dose." },
  { name: "Furosemide", category: "Cardiovascular", form: "Tablet", route: "Oral", unit: "mg", strengths: ["20 mg", "40 mg"] },
  { name: "Furosemide", category: "Cardiovascular", form: "Injection", route: "", unit: "mg/mL", strengths: ["10 mg/mL (2 mL)"], safety: "Typical routes: intravenous or intramuscular, as the product allows. The strength is the product, not the dose." },
  { name: "Spironolactone", category: "Cardiovascular", form: "Tablet", route: "Oral", unit: "mg", strengths: ["25 mg"] },
  { name: "Warfarin", category: "Cardiovascular", form: "Tablet", route: "Oral", unit: "mg", strengths: ["1 mg", "2 mg", "5 mg"], safety: "High-alert anticoagulant. Record the indication and the INR checks. The strength is the product, not the dose." },

  { name: "Metformin", category: "Antidiabetic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["500 mg", "1 g"], safety: "Record whether this tablet is immediate-release or extended-release. The strength is the product, not the dose.", codes: { "500 mg": "MET-500" } },
  { name: "Glibenclamide", category: "Antidiabetic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["5 mg"], safety: "Can lower blood sugar. The strength is the product, not the dose." },
  { name: "Gliclazide", category: "Antidiabetic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["60 mg", "80 mg"], safety: "Record whether this tablet is modified-release. Can lower blood sugar. The strength is the product, not the dose." },
  { name: "Glimepiride", category: "Antidiabetic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["1 mg", "2 mg", "3 mg", "4 mg"], safety: "Can lower blood sugar. The strength is the product, not the dose." },
  { name: "Dapagliflozin", category: "Antidiabetic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["5 mg", "10 mg"] },
  { name: "Sitagliptin", category: "Antidiabetic", form: "Tablet", route: "Oral", unit: "mg", strengths: ["50 mg", "100 mg"] },
  { name: "Insulin (soluble / regular)", category: "Antidiabetic", form: "Injection", route: "Subcutaneous", unit: "units/mL", strengths: ["100 units/mL"], safety: "High-alert. Enter the dose in units, not millilitres. Intravenous use only under an approved protocol." },
  { name: "Isophane insulin (NPH)", category: "Antidiabetic", form: "Injection", route: "Subcutaneous", unit: "units/mL", strengths: ["100 units/mL"], safety: insulin },
  { name: "Biphasic isophane insulin 30/70", category: "Antidiabetic", form: "Injection", route: "Subcutaneous", unit: "units/mL", strengths: ["100 units/mL (30% soluble + 70% isophane)"], safety: "High-alert. Enter the dose in units, not millilitres. Ingredients: soluble insulin 30% and isophane insulin 70%." },
  { name: "Insulin glargine", category: "Antidiabetic", form: "Injection", route: "Subcutaneous", unit: "units/mL", strengths: ["100 units/mL"], safety: insulin },
  { name: "Insulin aspart", category: "Antidiabetic", form: "Injection", route: "Subcutaneous", unit: "units/mL", strengths: ["100 units/mL"], safety: insulin },

  { name: "Metoclopramide", category: "Gastrointestinal", form: "Tablet", route: "Oral", unit: "mg", strengths: ["10 mg"] },
  { name: "Metoclopramide", category: "Gastrointestinal", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["5 mg/5 mL"] },
  { name: "Metoclopramide", category: "Gastrointestinal", form: "Injection", route: "", unit: "mg/mL", strengths: ["5 mg/mL"], safety: "Typical routes: intravenous or intramuscular. The strength is the product, not the dose." },
  { name: "Ondansetron", category: "Gastrointestinal", form: "Tablet", route: "Oral", unit: "mg", strengths: ["4 mg", "8 mg"] },
  { name: "Ondansetron", category: "Gastrointestinal", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["4 mg/5 mL"] },
  { name: "Ondansetron", category: "Gastrointestinal", form: "Injection", route: "", unit: "mg/mL", strengths: ["2 mg/mL"], safety: "Typical routes: intravenous or intramuscular. The strength is the product, not the dose." },
  { name: "Omeprazole", category: "Gastrointestinal", form: "Capsule", route: "Oral", unit: "mg", strengths: ["10 mg", "20 mg"], codes: { "20 mg": "OMEP-20" } },
  { name: "Omeprazole", category: "Gastrointestinal", form: "Injection", route: "Intravenous", unit: "mg", strengths: ["40 mg"] },
  { name: "Rabeprazole", category: "Gastrointestinal", form: "Tablet", route: "Oral", unit: "mg", strengths: ["20 mg"] },
  { name: "Aluminium hydroxide + magnesium hydroxide", category: "Gastrointestinal", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["500 mg + 500 mg/5 mL", "200 mg + 200 mg/5 mL"], ingredientNames: ["Aluminium hydroxide", "Magnesium hydroxide"] },
  { name: "Bisacodyl", category: "Gastrointestinal", form: "Tablet", route: "Oral", unit: "mg", strengths: ["5 mg"] },
  { name: "Bisacodyl", category: "Gastrointestinal", form: "Suppository", route: "Rectal", unit: "mg", strengths: ["5 mg", "10 mg"] },
  { name: "Lactulose", category: "Gastrointestinal", form: "Oral liquid", route: "Oral", unit: "%", strengths: ["68%"] },
  { name: "Oral rehydration salts (ORS)", category: "Gastrointestinal", form: "Powder", route: "Oral", unit: "sachet", strengths: ["Sachet for 200 mL", "Sachet for 500 mL", "Sachet for 1 L"], safety: "Dispense instructions must match this sachet. Low-osmolarity formula: glucose 13.5 g/L, sodium chloride 2.6 g/L, potassium chloride 1.5 g/L, trisodium citrate dihydrate 2.9 g/L.", codes: { "Sachet for 1 L": "ORS" } },

  { name: "Salbutamol", category: "Respiratory", form: "Inhaler", route: "Inhalation", unit: "micrograms/actuation", strengths: ["100 micrograms/actuation"], codes: { "100 micrograms/actuation": "SALB-100" } },
  { name: "Salbutamol", category: "Respiratory", form: "Nebuliser solution", route: "Inhalation", unit: "mg/mL", strengths: ["5 mg/mL"] },
  { name: "Salbutamol", category: "Respiratory", form: "Tablet", route: "Oral", unit: "mg", strengths: ["2 mg"] },
  { name: "Salbutamol", category: "Respiratory", form: "Injection", route: "", unit: "micrograms/mL", strengths: ["50 micrograms/mL"], safety: "Typical routes: intravenous or subcutaneous, only in an approved setting. The strength is the product, not the dose." },
  { name: "Budesonide", category: "Respiratory", form: "Inhaler", route: "Inhalation", unit: "micrograms/dose", strengths: ["100 micrograms/dose", "200 micrograms/dose"] },
  { name: "Ipratropium bromide", category: "Respiratory", form: "Inhaler", route: "Inhalation", unit: "micrograms/actuation", strengths: ["20 micrograms/actuation"] },
  { name: "Ipratropium bromide", category: "Respiratory", form: "Nebuliser solution", route: "Inhalation", unit: "%", strengths: ["0.02%"] },
  { name: "Salmeterol + fluticasone", category: "Respiratory", form: "Inhaler", route: "Inhalation", unit: "micrograms/dose", strengths: ["21 micrograms + 45 micrograms/dose", "50 micrograms + 100 micrograms/dose", "50 micrograms + 250 micrograms/dose"], ingredientNames: ["Salmeterol", "Fluticasone"] },
  { name: "Chlorphenamine", category: "Antihistamine", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["2 mg/5 mL"] },
  { name: "Chlorphenamine", category: "Antihistamine", form: "Injection", route: "", unit: "mg/mL", strengths: ["10 mg/mL"], safety: "Typical routes: intramuscular or intravenous. The strength is the product, not the dose." },
  { name: "Loratadine", category: "Antihistamine", form: "Tablet", route: "Oral", unit: "mg", strengths: ["10 mg"] },
  { name: "Loratadine", category: "Antihistamine", form: "Oral liquid", route: "Oral", unit: "mg/mL", strengths: ["1 mg/mL"] },
  { name: "Prednisolone", category: "Corticosteroid", form: "Tablet", route: "Oral", unit: "mg", strengths: ["5 mg", "25 mg"] },
  { name: "Prednisolone", category: "Corticosteroid", form: "Oral liquid", route: "Oral", unit: "mg/mL", strengths: ["5 mg/mL", "15 mg/5 mL"] },
  { name: "Dexamethasone", category: "Corticosteroid", form: "Tablet", route: "Oral", unit: "mg", strengths: ["0.5 mg", "1 mg", "2 mg", "4 mg"] },
  { name: "Dexamethasone", category: "Corticosteroid", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["2 mg/5 mL"] },
  { name: "Dexamethasone", category: "Corticosteroid", form: "Injection", route: "", unit: "mg/mL", strengths: ["4 mg/mL"], safety: "Typical routes: intravenous or intramuscular. The strength is the product, not the dose." },
  { name: "Hydrocortisone", category: "Corticosteroid", form: "Injection", route: "", unit: "mg", strengths: ["100 mg"], safety: "Typical routes: intravenous or intramuscular. The strength is the product, not the dose." },

  { name: "Carbamazepine", category: "Nervous system", form: "Tablet", route: "Oral", unit: "mg", strengths: ["100 mg", "200 mg", "400 mg"] },
  { name: "Levetiracetam", category: "Nervous system", form: "Tablet", route: "Oral", unit: "mg", strengths: ["250 mg", "500 mg", "750 mg", "1000 mg"] },
  { name: "Levetiracetam", category: "Nervous system", form: "Oral liquid", route: "Oral", unit: "mg/mL", strengths: ["100 mg/mL"] },
  { name: "Sodium valproate (valproic acid)", category: "Nervous system", form: "Tablet", route: "Oral", unit: "mg", strengths: ["200 mg", "500 mg"] },
  { name: "Sodium valproate (valproic acid)", category: "Nervous system", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["250 mg/5 mL"] },
  { name: "Diazepam", category: "Nervous system", form: "Tablet", route: "Oral", unit: "mg", strengths: ["2 mg", "5 mg", "10 mg"], safety: controlled },
  { name: "Diazepam", category: "Nervous system", form: "Injection", route: "Intravenous", unit: "mg/mL", strengths: ["5 mg/mL", "10 mg/2 mL"], safety: controlled },
  { name: "Diazepam", category: "Nervous system", form: "Oral liquid", route: "Oral", unit: "mg/5 mL", strengths: ["2 mg/5 mL"], safety: controlled },
  { name: "Lorazepam", category: "Nervous system", form: "Tablet", route: "Oral", unit: "mg", strengths: ["1 mg", "2 mg"], safety: controlled },
  { name: "Lorazepam", category: "Nervous system", form: "Injection", route: "Intravenous", unit: "mg/mL", strengths: ["2 mg/mL", "4 mg/mL"], safety: controlled },
  { name: "Clonazepam", category: "Nervous system", form: "Tablet", route: "Oral", unit: "micrograms", strengths: ["500 micrograms"], safety: controlled },
  { name: "Clonazepam", category: "Nervous system", form: "Oral liquid", route: "Oral", unit: "micrograms/5 mL", strengths: ["500 micrograms/5 mL"], safety: controlled },
  { name: "Clonazepam", category: "Nervous system", form: "Injection", route: "Intravenous", unit: "mg/mL", strengths: ["1 mg/mL"], safety: "Controlled medicine. Intravenous use is for a specialist protocol. The strength is the product, not the dose." },
  { name: "Amitriptyline", category: "Nervous system", form: "Tablet", route: "Oral", unit: "mg", strengths: ["10 mg", "25 mg", "50 mg", "100 mg"] },
  { name: "Fluoxetine", category: "Nervous system", form: "Tablet", route: "Oral", unit: "mg", strengths: ["20 mg"] },
  { name: "Fluoxetine", category: "Nervous system", form: "Capsule", route: "Oral", unit: "mg", strengths: ["20 mg"] },
  { name: "Olanzapine", category: "Nervous system", form: "Tablet", route: "Oral", unit: "mg", strengths: ["5 mg", "10 mg"] },
  { name: "Risperidone", category: "Nervous system", form: "Tablet", route: "Oral", unit: "mg", strengths: ["0.5 mg", "2 mg", "4 mg"] },

  { name: "Oxytocin", category: "Obstetric", form: "Injection", route: "", unit: "units/mL", strengths: ["10 units/mL"], safety: "High-alert. Enter the dose in units. Typical routes: intravenous infusion or intramuscular." },
  { name: "Misoprostol", category: "Obstetric", form: "Tablet", route: "", unit: "micrograms", strengths: ["200 micrograms"], safety: "Use only the route in the approved protocol: oral, buccal, sublingual, vaginal, or rectal. The strength is the product, not the dose." },
  { name: "Misoprostol", category: "Obstetric", form: "Pessary", route: "", unit: "micrograms", strengths: ["25 micrograms"], safety: "Use only the route in the approved protocol. The strength is the product, not the dose." },
  { name: "Magnesium sulfate", category: "Obstetric", form: "Injection", route: "", unit: "%", strengths: ["50% in 2 mL", "20% in 5 mL", "20% in 10 mL"], safety: "High-alert. Typical routes: intravenous or intramuscular. The strength is the product, not the dose." },
  { name: "Ergometrine", category: "Obstetric", form: "Injection", route: "", unit: "micrograms/mL", strengths: ["200 micrograms/mL"], safety: "High-alert. Typical routes: intramuscular or intravenous. The strength is the product, not the dose." },
  { name: "Ergometrine", category: "Obstetric", form: "Tablet", route: "Oral", unit: "micrograms", strengths: ["250 micrograms"], safety: highAlert },
  { name: "Epinephrine (adrenaline)", category: "Emergency", form: "Injection", route: "", unit: "mg/mL", strengths: ["1 mg/mL"], safety: "High-alert. Intramuscular for anaphylaxis. Intravenous only in a resuscitation protocol. The strength is the product, not the dose." },
  { name: "Atropine", category: "Emergency", form: "Injection", route: "", unit: "mg", strengths: ["600 micrograms/mL", "1 mg/mL", "2 mg/0.7 mL"], safety: "Typical routes: intravenous, intramuscular, or subcutaneous. The strength is the product, not the dose." },
  { name: "Tranexamic acid", category: "Emergency", form: "Injection", route: "Intravenous", unit: "mg/mL", strengths: ["100 mg/mL (10 mL)"] },

  { name: "Sodium chloride", category: "Intravenous fluid", form: "Infusion", route: "Intravenous", unit: "%", strengths: ["0.9%", "0.45%"], codes: { "0.9%": "NS-500" } },
  { name: "Glucose (dextrose)", category: "Intravenous fluid", form: "Infusion", route: "Intravenous", unit: "%", strengths: ["5%", "10%", "50%"], safety: "50% glucose is high-alert. Match the concentration to the stocked product. The strength is the product, not the dose." },
  { name: "Glucose + sodium chloride", category: "Intravenous fluid", form: "Infusion", route: "Intravenous", unit: "%", strengths: ["5% + 0.9%", "4.3% + 0.18%"], ingredientNames: ["Glucose", "Sodium chloride"] },
  { name: "Ringer's lactate", category: "Intravenous fluid", form: "Infusion", route: "Intravenous", unit: "mmol/L", strengths: ["Sodium 130, chloride 112, potassium 5.4, lactate 27, calcium 1.8 mmol/L"] },
  { name: "Potassium chloride", category: "Electrolyte", form: "Solution", route: "", unit: "%", strengths: ["7.5%", "15%"], safety: "High-alert concentrate. Give intravenously only after dilution under an approved protocol. The strength is the product, not the dose." },
  { name: "Potassium chloride", category: "Electrolyte", form: "Injection", route: "", unit: "mEq", strengths: ["20 mEq", "40 mEq"], safety: "High-alert concentrate. Give intravenously only after dilution under an approved protocol. The strength is the product, not the dose." },
  { name: "Potassium chloride", category: "Electrolyte", form: "Tablet", route: "Oral", unit: "mg", strengths: ["600 mg"], safety: highAlert },
  { name: "Darrow's solution", category: "Intravenous fluid", form: "Infusion", route: "Intravenous", unit: "solution", strengths: ["Full strength", "Half strength"], safety: "Store the electrolyte composition of the stocked product. The strength is the product, not the dose." },

  { name: "Lidocaine (lignocaine)", category: "Local anaesthetic", form: "Injection", route: "", unit: "%", strengths: ["1%", "2%"], safety: "Local infiltration. Do not use a spinal or regional presentation as if it were the same product. The strength is the product, not the dose." },
  { name: "Lidocaine (lignocaine)", category: "Local anaesthetic", form: "Cream", route: "Topical", unit: "%", strengths: ["2%", "4%"] },
  { name: "Bupivacaine", category: "Local anaesthetic", form: "Injection", route: "", unit: "%", strengths: ["0.25%", "0.5%"], safety: "High-alert. Local infiltration or regional use only in the matching presentation. The strength is the product, not the dose." },
  { name: "Bupivacaine", category: "Local anaesthetic", form: "Spinal injection", route: "", unit: "%", strengths: ["0.5% with glucose"], safety: "High-alert spinal presentation. Do not interchange with a local infiltration product. The strength is the product, not the dose." },
];

export const medicineCatalog: MedicineSeed[] = expand(specs);
