import { describe, expect, it } from "vitest";
import { diagnosisCatalog } from "./bootstrap/diagnosis-catalog";
import { imagingCatalog } from "./bootstrap/imaging-catalog";
import { laboratoryCatalog } from "./bootstrap/laboratory-catalog";

describe("diagnosis and imaging catalogues", () => {
  it("keeps diagnosis labels searchable without storing a certainty in the name", () => {
    const codes = new Set(diagnosisCatalog.map((item) => item.code));
    expect(codes.size).toBe(diagnosisCatalog.length);
    const typhoid = diagnosisCatalog.find((item) => item.name === "Enteric fever / typhoid fever");
    expect(typhoid?.synonyms.toLowerCase()).toContain("typhoid");
    expect(typhoid?.name.toLowerCase()).not.toContain("suspected");
    expect(diagnosisCatalog.find((item) => item.name === "Fever, unspecified")?.conceptType).toBe("symptom");
  });

  it("keeps each radiology examination separate from the protocol", () => {
    const codes = new Set(imagingCatalog.map((item) => item.code));
    expect(codes.size).toBe(imagingCatalog.length);
    const chest = imagingCatalog.find((item) => item.code === "XR-CHEST");
    expect(chest).toMatchObject({ name: "Chest X-ray", synonyms: "CXR" });
    expect(chest?.selectionNote.toLowerCase()).toContain("radiology confirms");
    expect(imagingCatalog.find((item) => item.synonyms.includes("CTPA"))?.name).toContain("CT pulmonary angiography");
  });

  it("keeps the laboratory guide searchable and the corporate price on the same code", () => {
    const codes = new Set(laboratoryCatalog.map((item) => item.code));
    expect(codes.size).toBe(laboratoryCatalog.length);
    expect(laboratoryCatalog.length).toBeGreaterThan(200);
    expect(laboratoryCatalog.find((item) => item.code === "FBC")).toMatchObject({ corporatePriceNaira: 10000, sample: "Blood" });
    expect(laboratoryCatalog.find((item) => item.code === "PCV")?.corporatePriceNaira).toBe(3000);
    expect(laboratoryCatalog.find((item) => item.code === "LFT")?.corporatePriceNaira).toBe(12000);
    expect(laboratoryCatalog.find((item) => item.code === "UEC")?.corporatePriceNaira).toBe(11000);
    const fbc = laboratoryCatalog.find((item) => item.code === "FBC");
    expect(`${fbc?.name} ${fbc?.synonyms}`.toLowerCase()).toContain("fbc");
    expect(fbc?.selectionNote.toLowerCase()).toContain("laboratory confirms");
    expect(laboratoryCatalog.some((item) => /edta|citrate|loinc/i.test(item.selectionNote))).toBe(false);
    expect(laboratoryCatalog.find((item) => item.name === "Lipid profile")?.selectionNote.toLowerCase()).toContain("not expanded");
  });
});
