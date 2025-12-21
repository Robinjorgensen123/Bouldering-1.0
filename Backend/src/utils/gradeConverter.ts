const fontToVScaleMap: Record<string, string> = {
  "4": "V0",
  "5A": "V1",
  "5B": "V1",
  "5C": "V2",
  "6A": "V3",
  "6A+": "V3",
  "6B": "V4",
  "6B+": "V4",
  "6C": "V5",
  "6C+": "V5",
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
  "9A+": "V18",
  "9B": "V19",
  "9B+": "V20",
  "9C": "V21",
  "9C+": "V22",
};
const vScaleToFontMap: Record<string, string> = {};
for (const [font, v] of Object.entries(fontToVScaleMap)) {
  vScaleToFontMap[v] = font;
}

export const convertToVScale = (fontGrade: string): string => {
  return fontToVScaleMap[fontGrade.toUpperCase()] || fontGrade;
};

export const convertToFont = (vGrade: string): string => {
  return vScaleToFontMap[vGrade.toUpperCase()] || vGrade;
};
