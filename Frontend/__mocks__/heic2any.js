// __mocks__/heic2any.js
export default async function heic2any() {
  // Return a dummy JPEG blob
  return new Blob(["dummy"], { type: "image/jpeg" });
}
