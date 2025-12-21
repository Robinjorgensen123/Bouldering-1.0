const fontToVScaleMap: Record<string, string> = {
  "4": "v0",
  "5a": "v1",
  "5b": "v1",
  "5c": "v2",
  "6a": "v3",
  "6a+": "v3",
  "6b": "v4",
  "6b+": "v4",
  "6c": "v5",
  "6c+": "v5",
  "7a": "v6",
  "7a+": "v7",
  "7b": "v8",
  "7b+": "v8",
  "7c": "v9",
  "7c+": "v10",
  "8a": "v11",
  "8a+": "v12",
  "8b": "v13",
  "8b+": "v14",
  "8c": "v15",
  "8c+": "v16",
  "9a": "v17",
  "9a+": "v18",
  "9b": "v19",
  "9b+": "v20",
  "9c": "v21",
  "9c+": "v22",
};
const vScaleToFontMap: Record<string, string> = {};
for (const [font, v] of Object.entries(fontToVScaleMap)) {
  vScaleToFontMap[v] = font;
}

export const covertToVScale = (fontGrade: string): string => {
  return fontToVScaleMap[fontGrade.toUpperCase()] || fontGrade;
};

export const convertToFont = (vGrade: string): string => {
  return vScaleToFontMap[vGrade.toLowerCase()] || vGrade;
};
