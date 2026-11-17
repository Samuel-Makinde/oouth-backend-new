import fs from "node:fs";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth";

type DepartmentRow = {
  slug: string;
  name: string;
  group: string;
  summary: string;
  body: string;
  patientBooking: boolean;
};

const drugs = [
  ["PARA-500", "Paracetamol", "Analgesic", "Tablet", "500mg"],
  ["AMOX-500", "Amoxicillin", "Antibiotic", "Capsule", "500mg"],
  ["IBU-400", "Ibuprofen", "Analgesic", "Tablet", "400mg"],
  ["MET-500", "Metformin", "Antidiabetic", "Tablet", "500mg"],
  ["AML-5", "Amlodipine", "Antihypertensive", "Tablet", "5mg"],
  ["ORS", "Oral Rehydration Salts", "Fluid", "Sachet", "20.5g"],
];

const diagnoses = [
  ["1A40", "Malaria", "Infectious"],
  ["8A80", "Tension headache", "Neurology"],
  ["CA23", "Asthma", "Respiratory"],
  ["5A11", "Type 2 diabetes", "Endocrine"],
  ["BA00", "Essential hypertension", "Cardiovascular"],
];

const imaging = [
  ["XR-CHEST", "Chest X-ray", "X-Ray", "Chest"],
  ["US-ABD", "Abdominal ultrasound", "Ultrasound", "Abdomen"],
  ["CT-BRAIN", "CT brain", "CT Scan", "Head"],
];

const labs = [
  ["FBC", "Full Blood Count", "Blood"],
  ["MP", "Malaria Parasite Test", "Blood"],
  ["RBS", "Blood Sugar Test", "Blood"],
  ["UEC", "Urea, Electrolyte and Creatinine", "Blood"],
];

function loadDepartments(): DepartmentRow[] {
  const bundled = path.resolve(process.cwd(), "prisma/departments.json");
  if (fs.existsSync(bundled)) return JSON.parse(fs.readFileSync(bundled, "utf8")) as DepartmentRow[];
  const sibling = path.resolve(process.cwd(), "../OOUTH-frontend/content/departments.ts");
  const source = fs.readFileSync(sibling, "utf8");
  const start = source.indexOf("export const departments");
  const end = source.indexOf("export function getDepartment");
  const body = source.slice(start, end).replace("export const departments: Department[] =", "const departments =");
  return new Function(`${body}; return departments;`)() as DepartmentRow[];
}

export async function ensurePreviewCatalog(prisma: PrismaClient, password: string) {
  const ready = await prisma.hospitalSettings.findUnique({ where: { id: "default" } });
  if (ready) return;

  const departments = loadDepartments();
  await prisma.hospitalSettings.create({
    data: {
      id: "default",
      consultationPerHourNaira: 30000,
      registrationFeeNaira: 20000,
      defaultDurationMinutes: 60,
      cancellationNoticeHours: 24,
      rescheduleNoticeHours: 24,
      joinMinutesBefore: 15,
      joinMinutesAfter: 30,
    },
  });

  for (const department of departments) {
    await prisma.department.create({ data: department });
  }

  const consultants = [
    { slug: "super_consultant", firstName: "Super", lastName: "Consultant", specialty: "First consultant", departmentSlug: "medicine", onlineBookingEnabled: true, email: "super_consultant@preview.local", staffId: "OOUTH-S-SUPER" },
    { slug: "demo-consultant-a", firstName: "Adaeze", lastName: "Okonkwo", specialty: "General medicine", departmentSlug: "medicine", onlineBookingEnabled: false, email: "demo-consultant-a@preview.local", staffId: "OOUTH-S-A" },
    { slug: "demo-consultant-b", firstName: "Tunde", lastName: "Bakare", specialty: "General surgery", departmentSlug: "surgery", onlineBookingEnabled: false, email: "demo-consultant-b@preview.local", staffId: "OOUTH-S-B" },
  ];
  const passwordHash = await hashPassword(password);
  for (const consultant of consultants) {
    await prisma.user.create({
      data: {
        role: "consultant",
        firstName: consultant.firstName,
        lastName: consultant.lastName,
        specialty: consultant.specialty,
        departmentSlug: consultant.departmentSlug,
        onlineBookingEnabled: consultant.onlineBookingEnabled,
        email: consultant.email,
        staffId: consultant.staffId,
        phone: "",
        passwordHash,
        designation: "Consultant",
        consultantSlug: consultant.slug,
      },
    });
    await prisma.availability.create({
      data: { consultantSlug: consultant.slug, days: [1, 2, 3, 4, 5], startTime: "08:00", endTime: "16:00", durationMinutes: 60, breaks: [], blockedDates: [], physicalEnabled: true, virtualEnabled: true, provisional: true },
    });
  }

  const staff = [
    { email: "admin@preview.local", firstName: "Preview", lastName: "Administrator", role: "administrator", staffId: "OOUTH-S-ADMIN", designation: "Hospital administrator", departmentSlug: "administration" },
    { email: "desk@preview.local", firstName: "Front", lastName: "Desk", role: "desk_officer", staffId: "OOUTH-S-DESK", designation: "Desk officer", departmentSlug: "medicine" },
    { email: "desk2@preview.local", firstName: "Desk", lastName: "Officer 2", role: "desk_officer", staffId: "OOUTH-S-DESK-2", designation: "Desk officer 2", departmentSlug: "pharmacy" },
    { email: "desk3@preview.local", firstName: "Desk", lastName: "Officer 3", role: "desk_officer", staffId: "OOUTH-S-DESK-3", designation: "Desk officer 3", departmentSlug: "laboratory" },
    { email: "nurse@preview.local", firstName: "Ward", lastName: "Nurse", role: "nurse", staffId: "OOUTH-S-NURSE", designation: "Nurse", departmentSlug: "nursing" },
    { email: "pharmacy@preview.local", firstName: "Pharmacy", lastName: "Officer", role: "pharmacist", staffId: "OOUTH-S-PHARM", designation: "Pharmacist", departmentSlug: "pharmacy" },
    { email: "diagnostics@preview.local", firstName: "Laboratory", lastName: "Officer", role: "laboratory_officer", staffId: "OOUTH-S-LAB", designation: "Laboratory officer", departmentSlug: "laboratory" },
  ];
  for (const person of staff) {
    await prisma.user.create({ data: { ...person, phone: "", passwordHash } });
  }

  await prisma.ward.create({ data: { id: "ward_medical_a", name: "Medical Ward A" } });
  for (const label of ["A1", "A2", "A3", "A4", "A5", "A6"]) {
    await prisma.bed.create({ data: { id: `bed_${label.toLowerCase()}`, wardId: "ward_medical_a", label } });
  }
  await prisma.inventoryItem.createMany({
    data: [
      { name: "Loratadine", category: "Antihistamine", quantity: 40, unit: "tablets", reorderLevel: 10 },
      { name: "Paracetamol", category: "Analgesic", quantity: 100, unit: "tablets", reorderLevel: 20 },
    ],
  });
  for (const [code, name, category, form, strength] of drugs) {
    await prisma.catalogMedication.create({ data: { code, name, category, form, strength } });
  }
  for (const [code, name, category] of diagnoses) {
    await prisma.catalogDiagnosis.create({ data: { code, name, system: "ICD-11 demonstration", category } });
  }
  for (const [code, name, modality, bodyRegion] of imaging) {
    await prisma.catalogImaging.create({ data: { code, name, modality, bodyRegion } });
  }
  for (const [code, name, sample] of labs) {
    await prisma.catalogLaboratory.create({ data: { code, name, sample } });
  }
  console.log("Prepared an empty hospital database with departments, fees, and preview staff.");
}
