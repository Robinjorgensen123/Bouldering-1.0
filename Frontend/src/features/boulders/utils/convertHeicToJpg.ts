import heic2any from "heic2any";

export const convertHeicToJpg = async (file: File): Promise<File> => {
  if (file.type == "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
    const convertedBlob = (await heic2any({
      blob: file,
      toType: "image/jpeg",
    })) as Blob;
    return new File([convertedBlob], file.name.replace(/\.heic$/i, ".jpg"), {
      type: "image/jpeg",
    });
  }
  return file;
};
