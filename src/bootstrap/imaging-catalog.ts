export type ImagingSeed = {
  code: string;
  name: string;
  modality: string;
  bodyRegion: string;
  synonyms: string;
  selectionNote: string;
};

const radiology = "Radiology confirms the views, contrast, and protocol. Enter the side and the views you are requesting. Do not copy a protocol into the order.";

const aliases: Record<string, string> = {
  "Chest X-ray": "XR-CHEST",
  "Ultrasound abdomen - complete": "US-ABD",
  "CT brain / head": "CT-BRAIN",
};

type Exam = {
  name: string;
  region: string;
  synonyms?: string;
  note?: string;
};

function codeFor(modality: string, name: string) {
  if (aliases[name]) return aliases[name];
  const prefix = modality.replace(/[^a-zA-Z]+/g, "").slice(0, 4).toUpperCase();
  const slug = name.replace(/\([^)]*\)/g, " ").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toUpperCase().slice(0, 36);
  return `${prefix}-${slug}`;
}

function expand(modality: string, exams: Exam[]): ImagingSeed[] {
  return exams.map((exam) => ({
    code: codeFor(modality, exam.name),
    name: exam.name,
    modality,
    bodyRegion: exam.region,
    synonyms: exam.synonyms ?? "",
    selectionNote: exam.note ? `${exam.note} ${radiology}` : radiology,
  }));
}

const xray = expand("X-ray", [
  { name: "Chest X-ray", region: "Chest", synonyms: "CXR", note: "Indicate portable status and the clinical question." },
  { name: "Ribs X-ray", region: "Chest", note: "Record the side and the site of pain or trauma." },
  { name: "Sternum X-ray", region: "Chest" },
  { name: "Abdomen X-ray", region: "Abdomen", synonyms: "AXR", note: "Specify the clinical question. Do not use KUB as the only description." },
  { name: "Cervical spine X-ray", region: "Spine" },
  { name: "Thoracic spine X-ray", region: "Spine" },
  { name: "Lumbar spine X-ray", region: "Spine" },
  { name: "Whole spine / scoliosis series", region: "Spine" },
  { name: "Sacrum and coccyx X-ray", region: "Pelvis" },
  { name: "Pelvis X-ray", region: "Pelvis" },
  { name: "Hip X-ray", region: "Hip", note: "Record the side." },
  { name: "Femur X-ray", region: "Femur", note: "Record the side." },
  { name: "Knee X-ray", region: "Knee", note: "Record the side and whether weight-bearing views are requested." },
  { name: "Tibia and fibula X-ray", region: "Leg", note: "Record the side." },
  { name: "Ankle X-ray", region: "Ankle", note: "Record the side." },
  { name: "Foot X-ray", region: "Foot", note: "Record the side." },
  { name: "Toes X-ray", region: "Foot", note: "Select the toe and the side." },
  { name: "Calcaneus / heel X-ray", region: "Foot", note: "Record the side." },
  { name: "Shoulder X-ray", region: "Shoulder", note: "Record the side." },
  { name: "Clavicle X-ray", region: "Shoulder", note: "Record the side." },
  { name: "Scapula X-ray", region: "Shoulder", note: "Record the side." },
  { name: "Humerus X-ray", region: "Arm", note: "Record the side." },
  { name: "Elbow X-ray", region: "Elbow", note: "Record the side." },
  { name: "Forearm X-ray", region: "Forearm", note: "Record the side." },
  { name: "Wrist X-ray", region: "Wrist", note: "Record the side. Request a scaphoid series when a scaphoid injury is suspected." },
  { name: "Hand X-ray", region: "Hand", note: "Record the side." },
  { name: "Finger / thumb X-ray", region: "Hand", note: "Select the digit and the side." },
  { name: "Bilateral hands / wrists X-ray", region: "Hand" },
  { name: "Skull X-ray", region: "Head" },
  { name: "Facial bones X-ray", region: "Face" },
  { name: "Nasal bones X-ray", region: "Face" },
  { name: "Orbits X-ray", region: "Orbits" },
  { name: "Paranasal sinuses X-ray", region: "Sinuses" },
  { name: "Mandible X-ray", region: "Face" },
  { name: "Temporomandibular joints X-ray", region: "Face" },
  { name: "Bone age X-ray", region: "Hand", note: "Left hand and wrist. Record the age and the clinical indication." },
  { name: "Long-leg alignment / scanogram", region: "Lower limb" },
]);

const ultrasound = expand("Ultrasound", [
  { name: "Ultrasound abdomen - complete", region: "Abdomen", synonyms: "abdominal ultrasound" },
  { name: "Ultrasound upper abdomen", region: "Abdomen" },
  { name: "Hepatobiliary ultrasound", region: "Liver", synonyms: "RUQ ultrasound" },
  { name: "Liver ultrasound", region: "Liver" },
  { name: "Gallbladder ultrasound", region: "Gallbladder" },
  { name: "Pancreatic ultrasound", region: "Pancreas" },
  { name: "Spleen ultrasound", region: "Spleen" },
  { name: "Renal ultrasound", region: "Kidney", synonyms: "KUB ultrasound" },
  { name: "Urinary tract / KUB ultrasound", region: "Urinary tract", synonyms: "KUB" },
  { name: "Bladder ultrasound", region: "Bladder" },
  { name: "Prostate ultrasound", region: "Prostate" },
  { name: "Pelvic ultrasound - transabdominal", region: "Pelvis" },
  { name: "Pelvic ultrasound - transvaginal", region: "Pelvis", note: "This is a separate examination from the transabdominal pelvic scan." },
  { name: "Early pregnancy / viability scan", region: "Pregnancy" },
  { name: "Obstetric dating scan", region: "Pregnancy" },
  { name: "Obstetric growth scan", region: "Pregnancy" },
  { name: "Obstetric anomaly scan", region: "Pregnancy" },
  { name: "Obstetric fetal wellbeing scan", region: "Pregnancy" },
  { name: "Obstetric Doppler", region: "Pregnancy" },
  { name: "Cervical length ultrasound", region: "Pregnancy" },
  { name: "Multiple pregnancy scan", region: "Pregnancy" },
  { name: "Scrotal ultrasound", region: "Scrotum", note: "Record the side." },
  { name: "Testicular Doppler", region: "Scrotum", note: "Record the side. Do not delay urgent care for routine scheduling." },
  { name: "Breast ultrasound", region: "Breast", note: "Record the side and the location of a palpable finding." },
  { name: "Thyroid ultrasound", region: "Neck" },
  { name: "Neck soft-tissue ultrasound", region: "Neck" },
  { name: "Salivary gland ultrasound", region: "Neck" },
  { name: "Lymph node ultrasound", region: "Lymph node" },
  { name: "Soft-tissue ultrasound", region: "Soft tissue" },
  { name: "Musculoskeletal ultrasound", region: "Musculoskeletal", note: "Record the joint or tendon and the side." },
  { name: "Joint ultrasound", region: "Joint", note: "Record the joint and the side." },
  { name: "Venous Doppler - lower limb", region: "Leg", synonyms: "DVT scan, leg Doppler", note: "Record the side." },
  { name: "Venous Doppler - upper limb", region: "Arm", note: "Record the side." },
  { name: "Arterial Doppler - lower limb", region: "Leg", note: "Record the side." },
  { name: "Arterial Doppler - upper limb", region: "Arm", note: "Record the side." },
  { name: "Carotid Doppler", region: "Neck" },
  { name: "Aorta / iliac Doppler", region: "Aorta" },
  { name: "Renal Doppler", region: "Kidney" },
  { name: "Portal venous Doppler", region: "Liver" },
  { name: "Transfontanelle cranial ultrasound", region: "Head" },
  { name: "Neonatal hip ultrasound", region: "Hip" },
  { name: "Echocardiography - transthoracic", region: "Heart", synonyms: "echo, TTE" },
]);

const ct = expand("CT", [
  { name: "CT brain / head", region: "Head", synonyms: "CT head, CT brain", note: "State the clinical question. Contrast is not assumed." },
  { name: "CT facial bones", region: "Face" },
  { name: "CT orbits", region: "Orbits" },
  { name: "CT paranasal sinuses", region: "Sinuses" },
  { name: "CT temporal bones", region: "Ear", note: "Record the side." },
  { name: "CT angiography head", region: "Head", synonyms: "CTA head" },
  { name: "CT angiography neck", region: "Neck", synonyms: "CTA neck" },
  { name: "CT cervical spine", region: "Spine" },
  { name: "CT thoracic spine", region: "Spine" },
  { name: "CT lumbar spine", region: "Spine" },
  { name: "CT chest", region: "Chest" },
  { name: "High-resolution CT chest (HRCT)", region: "Chest", synonyms: "HRCT" },
  { name: "CT pulmonary angiography (CTPA)", region: "Chest", synonyms: "CTPA" },
  { name: "CT aortogram", region: "Aorta" },
  { name: "CT abdomen", region: "Abdomen" },
  { name: "CT pelvis", region: "Pelvis" },
  { name: "CT abdomen and pelvis", region: "Abdomen" },
  { name: "CT KUB / stone protocol", region: "Urinary tract", synonyms: "CT KUB, CT stone" },
  { name: "CT urogram", region: "Urinary tract", synonyms: "CTU" },
  { name: "CT enterography", region: "Bowel" },
  { name: "CT colonography", region: "Bowel" },
  { name: "CT liver / multiphase liver", region: "Liver" },
  { name: "CT pancreas", region: "Pancreas" },
  { name: "CT adrenal glands", region: "Adrenal" },
  { name: "CT renal mass protocol", region: "Kidney" },
  { name: "CT neck soft tissue", region: "Neck" },
  { name: "CT angiography aorta and runoff", region: "Aorta", synonyms: "CTA runoff" },
  { name: "CT angiography peripheral limb", region: "Limb", note: "Record the side." },
  { name: "CT-guided biopsy / drainage planning", region: "Procedure", note: "This is a procedure request. The radiologist must accept it." },
  { name: "CT whole body trauma", region: "Whole body", note: "Use only on an approved trauma pathway." },
]);

const mri = expand("MRI", [
  { name: "MRI brain", region: "Head", note: "Radiology finalises the sequences." },
  { name: "MRI brain and internal auditory canals", region: "Head", synonyms: "MRI IAC" },
  { name: "MRI brain angiography (MRA)", region: "Head", synonyms: "MRA brain" },
  { name: "MRI venography (MRV) brain", region: "Head", synonyms: "MRV" },
  { name: "MRI orbits", region: "Orbits", note: "Record the side." },
  { name: "MRI face / neck", region: "Face" },
  { name: "MRI cervical spine", region: "Spine" },
  { name: "MRI thoracic spine", region: "Spine" },
  { name: "MRI lumbar spine", region: "Spine" },
  { name: "MRI whole spine", region: "Spine" },
  { name: "MRI shoulder", region: "Shoulder", note: "Record the side." },
  { name: "MRI elbow", region: "Elbow", note: "Record the side." },
  { name: "MRI wrist / hand", region: "Wrist", note: "Record the side." },
  { name: "MRI pelvis", region: "Pelvis" },
  { name: "MRI hip", region: "Hip", note: "Record the side." },
  { name: "MRI knee", region: "Knee", note: "Record the side." },
  { name: "MRI ankle / foot", region: "Ankle", note: "Record the side." },
  { name: "MRI sacroiliac joints", region: "Pelvis" },
  { name: "MR cholangiopancreatography (MRCP)", region: "Biliary", synonyms: "MRCP" },
  { name: "MRI liver", region: "Liver" },
  { name: "MRI prostate", region: "Prostate" },
  { name: "MRI rectum", region: "Pelvis" },
  { name: "MRI breast", region: "Breast" },
  { name: "MRI cardiac", region: "Heart" },
  { name: "MRI angiography (MRA) aorta / peripheral vessels", region: "Vessels", synonyms: "MRA" },
  { name: "MRI enterography", region: "Bowel" },
]);

const breast = expand("Breast imaging", [
  { name: "Screening mammography", region: "Breast", synonyms: "mammogram" },
  { name: "Diagnostic mammography", region: "Breast", note: "Record the side and the finding." },
  { name: "Mammography with tomosynthesis", region: "Breast" },
  { name: "Targeted breast ultrasound", region: "Breast", note: "Record the side and the location." },
  { name: "Breast ultrasound - axilla", region: "Breast", note: "Record the side." },
  { name: "Breast implant imaging", region: "Breast" },
  { name: "Image-guided breast biopsy", region: "Breast", note: "This is a procedure. Record the side and the target." },
]);

const fluoro = expand("Fluoroscopy", [
  { name: "Barium swallow / oesophagram", region: "Oesophagus", synonyms: "barium swallow" },
  { name: "Barium meal / upper GI series", region: "Stomach", synonyms: "barium meal" },
  { name: "Small bowel follow-through", region: "Bowel" },
  { name: "Barium enema", region: "Bowel" },
  { name: "Water-soluble contrast enema", region: "Bowel" },
  { name: "Hysterosalpingography (HSG)", region: "Pelvis", synonyms: "HSG" },
  { name: "Intravenous urogram (IVU)", region: "Urinary tract", synonyms: "IVU" },
  { name: "Micturating cystourethrogram (MCU / VCUG)", region: "Bladder", synonyms: "MCU, VCUG" },
  { name: "Retrograde urethrogram (RGU)", region: "Urethra", synonyms: "RGU" },
  { name: "Cystogram", region: "Bladder" },
  { name: "Fistulogram / sinogram", region: "Soft tissue" },
  { name: "Sialography", region: "Neck", note: "Record the side and the gland." },
  { name: "Arthrography", region: "Joint", note: "Record the joint and the side." },
  { name: "Fluoroscopic tube / device check", region: "Device" },
]);

const interventional = expand("Interventional", [
  { name: "Ultrasound-guided fine-needle aspiration (FNA/FNAC)", region: "Procedure", synonyms: "FNA, FNAC", note: "Record the target and the side. This is a procedure, not an ordinary scan." },
  { name: "Ultrasound-guided core biopsy", region: "Procedure", note: "Record the target and the side." },
  { name: "CT-guided biopsy", region: "Procedure", note: "The radiologist must approve the target." },
  { name: "Ultrasound-guided fluid aspiration", region: "Procedure", note: "Record the site and the side." },
  { name: "Ultrasound-guided drainage", region: "Procedure" },
  { name: "Image-guided pleural drainage", region: "Chest", note: "Record the side." },
  { name: "Image-guided paracentesis", region: "Abdomen" },
  { name: "Image-guided nephrostomy", region: "Kidney", note: "Record the side." },
  { name: "Image-guided biliary drainage", region: "Biliary" },
  { name: "Percutaneous abscess drainage", region: "Procedure" },
  { name: "Joint aspiration / injection", region: "Joint", note: "Record the joint and the side." },
  { name: "Image-guided steroid injection", region: "Joint", note: "The drug and dose belong on the prescription, not in this scan." },
  { name: "Vascular angiography", region: "Vessels" },
  { name: "Angioplasty / stenting referral", region: "Vessels" },
  { name: "Inferior vena cava filter procedure", region: "Vessels", synonyms: "IVC filter" },
  { name: "Central venous access - image guided", region: "Vein", synonyms: "PICC" },
  { name: "Image-guided marker / localisation", region: "Procedure" },
]);

const nuclear = expand("Nuclear medicine", [
  { name: "DEXA / DXA bone mineral density", region: "Bone", synonyms: "DEXA, DXA, bone density" },
  { name: "Whole-body bone scan", region: "Bone" },
  { name: "Thyroid scintigraphy / uptake scan", region: "Neck" },
  { name: "Renal scintigraphy", region: "Kidney", synonyms: "DMSA, DTPA, MAG3" },
  { name: "Hepatobiliary scintigraphy", region: "Liver", synonyms: "HIDA" },
  { name: "Myocardial perfusion imaging", region: "Heart" },
  { name: "Ventilation-perfusion (V/Q) scan", region: "Chest", synonyms: "V/Q, VQ scan" },
  { name: "PET-CT", region: "Whole body", synonyms: "PET" },
  { name: "Parathyroid scan", region: "Neck" },
  { name: "Gastric emptying study", region: "Stomach" },
]);

const cardiac = expand("Cardiac and diagnostics", [
  { name: "12-lead ECG", region: "Heart", synonyms: "ECG, EKG" },
  { name: "Holter monitoring", region: "Heart" },
  { name: "Ambulatory blood pressure monitoring", region: "Heart", synonyms: "ABPM" },
  { name: "Exercise treadmill test", region: "Heart" },
  { name: "Transthoracic echocardiogram (TTE)", region: "Heart", synonyms: "TTE, echo" },
  { name: "Transoesophageal echocardiogram (TEE)", region: "Heart", synonyms: "TEE, TOE" },
  { name: "Stress echocardiography", region: "Heart" },
  { name: "Spirometry / pulmonary function test", region: "Lung", synonyms: "spirometry, PFT" },
  { name: "Audiometry", region: "Ear" },
]);

function unique(rows: ImagingSeed[]) {
  const seen = new Set<string>();
  for (const row of rows) {
    if (seen.has(row.code)) throw new Error(`Duplicate imaging code ${row.code}`);
    seen.add(row.code);
  }
  return rows;
}

export const imagingCatalog: ImagingSeed[] = unique([
  ...xray,
  ...ultrasound,
  ...ct,
  ...mri,
  ...breast,
  ...fluoro,
  ...interventional,
  ...nuclear,
  ...cardiac,
]);
