import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { ApiError } from "../utils/ApiError.js";

const PDF_MIME_TYPE = "application/pdf"; // ["application/pdf", "application/octet-stream"];
const OCTET_STREAM_MIME_TYPE = "application/octet-stream";
const TXT_MIME_TYPE = "text/plain";
const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export async function extractTextFromDocument(
  buffer: Buffer,
  mimeType: string,
) {
  switch (mimeType) {
    case TXT_MIME_TYPE:
      return buffer.toString("utf-8");

    case PDF_MIME_TYPE:
    case OCTET_STREAM_MIME_TYPE: {
      const parser = new PDFParse({
        data: buffer,
      });

      const result = await parser.getText();
      await parser.destroy();

      return result.text;
    }
    case DOCX_MIME_TYPE: {
      const result = await mammoth.extractRawText({
        buffer,
      });

      return result.value;
    }
    default:
      throw ApiError.serverError(`Unsupported document type: ${mimeType}`);
  }
}
