const fontToVScaleMap: Record<string, string> = {
  "4": "V0",
  "5": "V1",
  "5+": "V2",
  "6A": "V3",
  "6A+": "V3",
  "6B": "V4",
  "6B+": "V4",
  "6C": "V5",
  "6C+": "V6",
  "7A": "V6",
  "7A+": "V7",
  "7B": "V8",
  "7B+": "V8",
  "7C": "V9",
  "7C+": "V10",
  "8A": "V11",
  "8A+": "V12",
  "8B": "V13",
  "8B+": "V14",
  "8C": "V15",
  "8C+": "V16",
  "9A": "V17",
};
const vScaleToFontMap: Record<string, string> = {
  V0: "4",
  V1: "5",
  V2: "5+",
  V3: "6A",
  V4: "6B",
  V5: "6C",
  V6: "7A",
  V7: "7A+",
  V8: "7B",
  V9: "7C",
  V10: "7C+",
  V11: "8A",
  V12: "8A+",
  V13: "8B",
  V14: "8B+",
  V15: "8C",
  V16: "8C+",
  V17: "9A",
};

const normalizeGrade = (grade: string) => grade.toUpperCase().trim();

const validFontGrades = new Set(
  Object.keys(fontToVScaleMap).map((grade) => normalizeGrade(grade)),
);

const validVScaleGrades = new Set(
  Object.keys(vScaleToFontMap).map((grade) => normalizeGrade(grade)),
);

export const convertToVScale = (fontGrade: string | undefined): string => {
  if (!fontGrade) return "";
  const normalized = normalizeGrade(fontGrade);
  return fontToVScaleMap[normalized] || fontGrade;
};

export const convertToFont = (vGrade: string | undefined): string => {
  if (!vGrade) return "";
  const normalized = normalizeGrade(vGrade);
  return vScaleToFontMap[normalized] || vGrade;
};

export const isValidFontGrade = (grade: string | undefined): boolean => {
  if (!grade) return false;
  return validFontGrades.has(normalizeGrade(grade));
};

export const isValidVScaleGrade = (grade: string | undefined): boolean => {
  if (!grade) return false;
  return validVScaleGrades.has(normalizeGrade(grade));
};

export const isValidGradeForSystem = (
  grade: string | undefined,
  gradingSystem: "font" | "v-scale",
): boolean => {
  if (gradingSystem === "v-scale") {
    return isValidVScaleGrade(grade);
  }

  return isValidFontGrade(grade);
};
