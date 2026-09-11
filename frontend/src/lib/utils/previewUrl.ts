// export function getDocumentPreviewUrl(
//   url: string,
//   mimeType: string = "",
// ): string {
//   if (!url) return "";

//   if (
//     mimeType.includes("word") ||
//     mimeType.includes("officedocument") ||
//     url.endsWith(".docx")
//   ) {
//     return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
//   }

//   if (url.includes("/upload/")) {
//     return url.replace("/upload/", "/upload/fl_inline/");
//   }

//   return url;
// }
// export function getDocumentPreviewUrl(url: string): string {
//   if (!url) return "";

//   // Cloudinary /raw/ URLs throw 400 when using /fl_inline/.
//   // Route through Google Docs Viewer for in-browser preview without downloading.
//   return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
// }

export function getDocumentPreviewUrl(
  url: string,
  mimeType: string = "",
): string {
  if (!url) return "";

  let fileUrl = url;

  // Cloudinary raw uploads lack extensions by default.
  // Appending the extension allows Google Drive to detect the file type instead of triggering download.
  if (mimeType.includes("pdf") && !fileUrl.toLowerCase().endsWith(".pdf")) {
    fileUrl = `${fileUrl}.pdf`;
  } else if (
    (mimeType.includes("word") || mimeType.includes("officedocument")) &&
    !fileUrl.toLowerCase().endsWith(".docx")
  ) {
    fileUrl = `${fileUrl}.docx`;
  }

  // Google Drive Viewer endpoint (viewerng) provides full in-browser preview
  return `https://drive.google.com/viewerng/viewer?url=${encodeURIComponent(fileUrl)}`;
}
