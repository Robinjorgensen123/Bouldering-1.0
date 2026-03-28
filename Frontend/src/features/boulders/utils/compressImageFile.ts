import imageCompression from "browser-image-compression";

export async function compressImageFile(
  file: File,
  options: { maxSizeMB?: number; maxWidthOrHeight?: number } = {},
): Promise<File> {
  if (file.type === "image/jpeg" || file.type === "image/png") {
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: options.maxSizeMB ?? 2,
        maxWidthOrHeight: options.maxWidthOrHeight ?? 1600,
        useWebWorker: true,
      });
      return compressed;
    } catch (err) {
      throw new Error("Image compression failed: " + err);
    }
  }
  return file;
}
