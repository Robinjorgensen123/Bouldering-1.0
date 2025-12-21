import { describe, it, expect } from "vitest";
import { convertToVScale, convertToFont } from "../utils/gradeConverter.js";

describe("Grade Converter Utility", () => {
  describe("convertToVScale (Font => V-Scale)", () => {
    it("should convert 7A to V6", () => {
      expect(convertToVScale("7A")).toBe("V6");
    });
    it("should convert lover grades lika 5A to V1", () => {
      expect(convertToVScale("5A")).toBe("V1");
    });
    it("should vonbert grades like 9C+ to V22", () => {
      expect(convertToVScale("9C+")).toBe("V22");
    });
    it("should handle lowercase input by converting to uppercase", () => {
      expect(convertToVScale("7A")).toBe("V6");
    });
    it("should return the original string if no mapping exists", () => {
      expect(convertToVScale("NotAGrade")).toBe("NotAGrade");
    });
  });

  describe("convertToFont (V-Scale => Font)", () => {
    it("should convert V6 to 7A", () => {
      expect(convertToFont("V6")).toBe("7A");
    });
    it("should convert V17 to 9A", () => {
      expect(convertToFont("V17")).toBe("9A");
    });
  });
});
