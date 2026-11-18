export type DiagnosisSeed = {
  code: string;
  name: string;
  system: string;
  category: string;
  conceptType: "symptom" | "disease" | "reason";
  synonyms: string;
};

const system = "OOUTH starter list";

const aliases: Record<string, string> = {
  "Malaria, uncomplicated": "1A40",
  "Tension-type headache": "8A80",
  Asthma: "CA23",
  "Type 2 diabetes mellitus": "5A11",
  "Essential (primary) hypertension": "BA00",
};

const extraSynonyms: Record<string, string> = {
  "Urinary tract infection": "UTI",
  "Pelvic inflammatory disease": "PID",
  "Benign prostatic hyperplasia": "BPH",
  "Deep vein thrombosis": "DVT",
  "Pulmonary embolism": "PE",
  "Pulmonary tuberculosis": "TB",
  "Extrapulmonary tuberculosis": "TB",
  "Chronic kidney disease": "CKD",
  "Acute kidney injury": "AKI",
  "Diabetic ketoacidosis": "DKA",
  "Irritable bowel syndrome": "IBS",
  "Inflammatory bowel disease": "IBD",
  "Gastro-oesophageal reflux disease (GERD)": "GERD, acid reflux",
  "Human immunodeficiency virus infection": "HIV",
};

type Group = {
  category: string;
  conceptType: DiagnosisSeed["conceptType"];
  names: string[];
};

const groups: Group[] = [
  {
    category: "Symptoms and findings",
    conceptType: "symptom",
    names: [
      "Fever, unspecified", "Chills / rigors", "Generalised weakness", "Fatigue / tiredness", "Unintentional weight loss",
      "Poor appetite / loss of appetite", "Headache", "Dizziness / light-headedness", "Syncope / fainting", "Chest pain, unspecified",
      "Palpitations", "Shortness of breath / dyspnoea", "Cough", "Haemoptysis", "Sore throat", "Nasal congestion",
      "Abdominal pain, unspecified", "Right upper quadrant abdominal pain", "Right lower quadrant abdominal pain", "Nausea", "Vomiting",
      "Diarrhoea", "Constipation", "Bloating / abdominal distension", "Heartburn / dyspepsia", "Jaundice",
      "Difficulty or pain on urination (dysuria)", "Frequent urination", "Blood in urine (haematuria)", "Reduced urine output",
      "Swelling / peripheral oedema", "Back pain", "Joint pain / arthralgia", "Muscle pain / myalgia", "Rash, unspecified",
      "Itching / pruritus", "Faintness / altered level of consciousness", "Seizure, unspecified", "Numbness / tingling / paraesthesia",
      "Limb weakness", "Abnormal vaginal bleeding", "Vaginal discharge", "Breast lump", "Unexplained anaemia (finding)",
      "Elevated blood pressure reading", "Abnormal blood glucose reading",
    ],
  },
  {
    category: "Infectious diseases",
    conceptType: "disease",
    names: [
      "Malaria, uncomplicated", "Malaria, severe / complicated", "Suspected malaria (diagnosis not yet confirmed)", "Enteric fever / typhoid fever",
      "Cholera", "Acute infectious gastroenteritis", "Bacterial dysentery / shigellosis", "Amoebiasis", "Giardiasis", "Intestinal helminth infection",
      "Schistosomiasis", "Onchocerciasis", "Lymphatic filariasis", "Pulmonary tuberculosis", "Extrapulmonary tuberculosis", "HIV infection",
      "HIV disease with clinical complications", "Acute hepatitis A", "Acute hepatitis B", "Chronic hepatitis B", "Hepatitis C infection",
      "Bacterial meningitis", "Viral meningitis", "Encephalitis", "Sepsis", "Cellulitis", "Skin / soft-tissue abscess", "Impetigo",
      "Wound infection", "Tetanus", "Measles", "Chickenpox / varicella", "Herpes zoster (shingles)", "Mumps", "Rubella", "Influenza",
      "COVID-19", "Dengue fever", "Yellow fever", "Lassa fever", "Rabies", "Urinary tract infection", "Acute pyelonephritis",
      "Sexually transmitted infection, unspecified", "Gonococcal infection", "Chlamydial infection", "Syphilis", "Genital herpes",
      "Pelvic inflammatory disease", "Vaginal candidiasis", "Bacterial vaginosis", "Scabies", "Pediculosis (lice infestation)",
    ],
  },
  {
    category: "Respiratory",
    conceptType: "disease",
    names: [
      "Acute upper respiratory tract infection", "Acute nasopharyngitis (common cold)", "Acute pharyngitis", "Acute tonsillitis", "Acute sinusitis",
      "Acute bronchitis", "Pneumonia, unspecified organism", "Bacterial pneumonia", "Aspiration pneumonia", "Bronchiolitis", "Asthma",
      "Acute asthma exacerbation", "Chronic obstructive pulmonary disease (COPD)", "Acute exacerbation of COPD", "Bronchiectasis",
      "Pleural effusion", "Pneumothorax", "Interstitial lung disease", "Obstructive sleep apnoea", "Acute respiratory failure",
    ],
  },
  {
    category: "Cardiovascular",
    conceptType: "disease",
    names: [
      "Essential (primary) hypertension", "Hypertensive urgency", "Hypertensive emergency", "Hypertensive heart disease", "Heart failure",
      "Acute decompensated heart failure", "Ischaemic heart disease", "Stable angina", "Acute coronary syndrome", "Acute myocardial infarction",
      "Cardiomyopathy", "Rheumatic heart disease", "Atrial fibrillation", "Supraventricular tachycardia", "Bradycardia", "Other cardiac arrhythmia",
      "Valvular heart disease", "Congenital heart disease", "Deep vein thrombosis", "Pulmonary embolism", "Peripheral arterial disease",
      "Varicose veins", "Pericardial effusion", "Cardiac arrest",
    ],
  },
  {
    category: "Endocrine and nutrition",
    conceptType: "disease",
    names: [
      "Type 1 diabetes mellitus", "Type 2 diabetes mellitus", "Diabetes mellitus in pregnancy / gestational diabetes", "Diabetes with hyperglycaemia",
      "Hypoglycaemia", "Diabetic ketoacidosis", "Diabetic neuropathy", "Diabetic nephropathy", "Diabetic retinopathy", "Obesity", "Overweight",
      "Dyslipidaemia", "Hypothyroidism", "Hyperthyroidism / thyrotoxicosis", "Goitre", "Thyroid nodule", "Adrenal insufficiency", "Cushing syndrome",
      "Vitamin D deficiency", "Vitamin B12 deficiency", "Iron deficiency", "Severe acute malnutrition", "Moderate acute malnutrition",
      "Protein-energy malnutrition", "Dehydration", "Electrolyte imbalance", "Hyponatraemia", "Hyperkalaemia", "Hypokalaemia",
      "Hyperuricaemia / gout-related hyperuricaemia",
    ],
  },
  {
    category: "Gastrointestinal",
    conceptType: "disease",
    names: [
      "Gastro-oesophageal reflux disease (GERD)", "Gastritis", "Peptic ulcer disease", "Functional dyspepsia", "Acute gastroenteritis",
      "Irritable bowel syndrome", "Inflammatory bowel disease", "Acute appendicitis", "Cholelithiasis (gallstones)", "Acute cholecystitis",
      "Acute pancreatitis", "Chronic pancreatitis", "Viral hepatitis", "Chronic liver disease", "Liver cirrhosis", "Ascites", "Hepatic encephalopathy",
      "Haemorrhoids", "Anal fissure", "Inguinal hernia", "Umbilical hernia", "Incisional hernia", "Intestinal obstruction",
      "Upper gastrointestinal bleeding", "Lower gastrointestinal bleeding", "Peptic ulcer with bleeding", "Hepatomegaly", "Splenomegaly",
    ],
  },
  {
    category: "Renal and urology",
    conceptType: "disease",
    names: [
      "Acute kidney injury", "Chronic kidney disease", "End-stage kidney disease", "Nephrotic syndrome", "Glomerulonephritis",
      "Renal / ureteric calculus (urinary stone)", "Benign prostatic hyperplasia", "Acute prostatitis", "Chronic prostatitis", "Epididymo-orchitis",
      "Hydrocele", "Varicocele", "Urinary retention", "Urinary incontinence", "Overactive bladder", "Recurrent urinary tract infection",
      "Urethritis", "Phimosis", "Paraphimosis", "Erectile dysfunction", "Male infertility",
    ],
  },
  {
    category: "Blood",
    conceptType: "disease",
    names: [
      "Anaemia, unspecified", "Iron deficiency anaemia", "Megaloblastic anaemia", "Haemolytic anaemia", "Aplastic anaemia",
      "Sickle cell disease without crisis", "Sickle cell disease with painful crisis", "Sickle cell disease with acute chest syndrome",
      "Thalassaemia", "Thrombocytopenia", "Pancytopenia", "Coagulation disorder", "Haemophilia", "Leukaemia", "Lymphoma", "Multiple myeloma",
    ],
  },
  {
    category: "Neurology",
    conceptType: "disease",
    names: [
      "Migraine", "Tension-type headache", "Epilepsy", "Status epilepticus", "Febrile seizure", "Ischaemic stroke", "Haemorrhagic stroke",
      "Transient ischaemic attack (TIA)", "Peripheral neuropathy", "Diabetic polyneuropathy", "Bell palsy", "Parkinson disease", "Dementia",
      "Delirium", "Multiple sclerosis", "Vertigo", "Sciatica / lumbar radiculopathy", "Cervical radiculopathy", "Spinal cord compression",
      "Guillain-Barré syndrome",
    ],
  },
  {
    category: "Musculoskeletal",
    conceptType: "disease",
    names: [
      "Osteoarthritis", "Rheumatoid arthritis", "Gout", "Septic arthritis", "Osteoporosis", "Low back pain", "Cervical pain / neck pain",
      "Shoulder pain", "Knee pain", "Tendinitis / tendinopathy", "Bursitis", "Muscle strain", "Joint sprain", "Joint dislocation", "Osteomyelitis",
      "Systemic lupus erythematosus", "Ankylosing spondylitis", "Plantar fasciitis",
    ],
  },
  {
    category: "Skin",
    conceptType: "disease",
    names: [
      "Atopic dermatitis / eczema", "Contact dermatitis", "Seborrhoeic dermatitis", "Psoriasis", "Acne vulgaris", "Urticaria / hives",
      "Fungal skin infection (tinea)", "Tinea corporis", "Tinea capitis", "Candidiasis of skin", "Boil / furuncle", "Carbuncle",
      "Vitiligo", "Alopecia", "Pressure ulcer", "Diabetic foot ulcer", "Burn injury", "Wound / laceration",
    ],
  },
  {
    category: "Eye",
    conceptType: "disease",
    names: [
      "Conjunctivitis", "Allergic conjunctivitis", "Cataract", "Glaucoma", "Refractive error", "Myopia", "Hypermetropia", "Astigmatism",
      "Presbyopia", "Uveitis", "Keratitis", "Dry eye syndrome", "Foreign body in eye", "Eye injury / trauma", "Visual impairment",
    ],
  },
  {
    category: "Ear, nose and throat",
    conceptType: "disease",
    names: [
      "Otitis externa", "Acute otitis media", "Chronic otitis media", "Hearing loss", "Impacted ear wax", "Tinnitus", "Allergic rhinitis",
      "Epistaxis (nosebleed)", "Nasal polyp", "Tonsillitis", "Peritonsillar abscess", "Laryngitis", "Hoarseness",
      "Foreign body in ear / nose / throat", "Vertigo of peripheral origin",
    ],
  },
  {
    category: "Obstetrics",
    conceptType: "disease",
    names: [
      "Pregnancy, supervision of normal pregnancy", "Antenatal care visit", "High-risk pregnancy", "Hyperemesis gravidarum", "Anaemia in pregnancy",
      "Gestational diabetes mellitus", "Gestational hypertension", "Pre-eclampsia", "Eclampsia", "Ectopic pregnancy", "Threatened miscarriage",
      "Spontaneous abortion / miscarriage", "Incomplete miscarriage", "Molar pregnancy", "Placenta praevia", "Placental abruption", "Preterm labour",
      "Premature rupture of membranes", "Obstructed labour", "Prolonged labour", "Postpartum haemorrhage", "Puerperal sepsis",
      "Retained products of conception", "Postpartum hypertension", "Postpartum depression", "Puerperal / postpartum complication",
    ],
  },
  {
    category: "Gynaecology",
    conceptType: "disease",
    names: [
      "Uterine fibroids (leiomyoma)", "Ovarian cyst", "Polycystic ovary syndrome (PCOS)", "Endometriosis", "Adenomyosis",
      "Vaginitis", "Vulvovaginal candidiasis", "Cervicitis", "Cervical dysplasia", "Cervical cancer", "Endometrial hyperplasia",
      "Endometrial cancer", "Amenorrhoea", "Dysmenorrhoea", "Menorrhagia / heavy menstrual bleeding", "Abnormal uterine bleeding",
      "Female infertility", "Menopausal symptoms", "Bartholin gland cyst / abscess", "Breast abscess", "Mastitis",
    ],
  },
  {
    category: "Child health",
    conceptType: "disease",
    names: [
      "Neonatal jaundice", "Neonatal sepsis", "Birth asphyxia", "Neonatal respiratory distress", "Prematurity", "Low birth weight",
      "Neonatal hypoglycaemia", "Neonatal feeding problem", "Congenital anomaly, unspecified", "Growth faltering", "Acute malnutrition in child",
      "Childhood pneumonia", "Childhood asthma", "Acute diarrhoeal disease in child", "Dehydration in child", "Acute otitis media in child",
      "Measles in child", "Chickenpox in child", "Meningitis in child",
      "Sickle cell disease in child", "Malaria in child", "Worm infestation in child", "Developmental delay", "Cerebral palsy",
      "Attention-deficit / hyperactivity disorder (ADHD)", "Autism spectrum disorder",
    ],
  },
  {
    category: "Mental health",
    conceptType: "disease",
    names: [
      "Depressive disorder", "Anxiety disorder", "Panic disorder", "Post-traumatic stress disorder (PTSD)", "Bipolar affective disorder",
      "Schizophrenia", "Acute psychosis", "Alcohol use disorder", "Opioid use disorder", "Other substance use disorder", "Insomnia disorder",
      "Eating disorder", "Dementia with behavioural symptoms", "Adjustment disorder",
    ],
  },
  {
    category: "Injury and emergency",
    conceptType: "disease",
    names: [
      "Acute abdomen", "Appendicitis", "Peritonitis", "Open wound", "Fracture, unspecified", "Closed fracture", "Open fracture", "Dislocation",
      "Sprain / strain", "Head injury", "Concussion", "Intracranial haemorrhage", "Electrical injury", "Road traffic injury", "Fall injury",
      "Animal bite", "Dog bite", "Snakebite", "Poisoning / toxic exposure", "Foreign body ingestion", "Foreign body in wound",
      "Acute urinary retention", "Acute haemorrhage", "Shock, unspecified", "Sepsis with organ dysfunction",
    ],
  },
  {
    category: "Oral and dental",
    conceptType: "disease",
    names: [
      "Dental caries", "Pulpitis", "Dental abscess", "Gingivitis", "Periodontitis", "Pericoronitis", "Tooth fracture", "Toothache",
      "Oral candidiasis", "Temporomandibular joint disorder",
    ],
  },
  {
    category: "Preventive care",
    conceptType: "reason",
    names: [
      "General medical examination / health check", "Pre-employment medical examination", "Follow-up examination after treatment",
      "Medication review", "Immunisation / vaccination encounter", "Family planning counselling", "Contraceptive management",
      "Antenatal screening", "Postnatal check", "Child welfare / growth monitoring visit", "Nutrition counselling",
      "Counselling for lifestyle modification", "Screening for hypertension", "Screening for diabetes", "Screening for HIV",
      "Screening for cervical cancer", "Screening for breast cancer", "Medical certificate / administrative examination",
    ],
  },
];

function codeFor(name: string) {
  const slug = name.replace(/\([^)]*\)/g, " ").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toUpperCase().slice(0, 42);
  return aliases[name] ?? `DX-${slug}`;
}

function synonymsFor(name: string) {
  const found = new Set<string>();
  for (const match of name.matchAll(/\(([^)]+)\)/g)) found.add(match[1].trim());
  for (const part of name.split("/")) {
    const text = part.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
    if (text && text.toLowerCase() !== name.toLowerCase()) found.add(text);
  }
  for (const extra of (extraSynonyms[name] ?? "").split(",")) {
    if (extra.trim()) found.add(extra.trim());
  }
  return [...found].join(", ");
}

function expand(items: Group[]): DiagnosisSeed[] {
  const rows: DiagnosisSeed[] = [];
  for (const group of items) {
    for (const name of group.names) {
      rows.push({
        code: codeFor(name),
        name,
        system,
        category: group.category,
        conceptType: group.conceptType,
        synonyms: synonymsFor(name),
      });
    }
  }
  const seen = new Set<string>();
  for (const row of rows) {
    if (seen.has(row.code)) throw new Error(`Duplicate diagnosis code ${row.code}`);
    seen.add(row.code);
  }
  return rows;
}

export const diagnosisCatalog: DiagnosisSeed[] = expand(groups);
