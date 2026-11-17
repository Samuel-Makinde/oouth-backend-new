import { describe, expect, it } from "vitest";
import { medicineCatalog } from "./bootstrap/medicine-catalog";

describe("medicine catalog", () => {
  it("stores each strength and form separately and does not store a dose", () => {
    const codes = new Set(medicineCatalog.map((item) => item.code));
    expect(codes.size).toBe(medicineCatalog.length);
    const example = medicineCatalog.find((item) => item.name === "Paracetamol" && item.form === "Oral liquid");
    expect(example).toMatchObject({ strength: "125 mg/5 mL", strengthUnit: "mg/5 mL", route: "Oral" });
    expect(example).not.toHaveProperty("dose");
    expect(medicineCatalog.some((item) => item.aware === "Access")).toBe(true);
    expect(medicineCatalog.some((item) => item.aware === "Watch")).toBe(true);
  });
});
