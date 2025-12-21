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
  "8B+": "V13",
  "9A": "V15",
  "8C+": "V16",
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
  V13: "8B+",
  V14: "8B+",
  V15: "9A",
  V16: "8C+",
  V17: "9A",
};

export const convertToVScale = (fontGrade: string): string => {
  return fontToVScaleMap[fontGrade.toUpperCase()] || fontGrade;
};

export const convertToFont = (vGrade: string): string => {
  return vScaleToFontMap[vGrade.toUpperCase()] || vGrade;
};
