export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "text/plain", // .txt
];

export const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"];

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 10MB limit (Selected file: ${(file.size / (1024 * 1024)).toFixed(1)}MB)`,
    };
  }

  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
  const isExtensionValid = ALLOWED_EXTENSIONS.includes(extension);
  const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type);

  if (!isExtensionValid && !isMimeValid) {
    return {
      valid: false,
      error: "Only .pdf, .docx, and .txt files are allowed",
    };
  }

  return { valid: true };
}
