export const getPreviewImageSrc = (imagesUrl?: string) => {
  if (!imagesUrl) return "";

  if (/^https?:\/\//i.test(imagesUrl)) {
    return imagesUrl;
  }
  const envBase = import.meta.env.VITE_API_BASE_URL;
  const baseUrl = envBase
    ? envBase.replace(/\/api$/, "")
    : "http://localhost:5000";
  return `${baseUrl}${imagesUrl}`;
};
