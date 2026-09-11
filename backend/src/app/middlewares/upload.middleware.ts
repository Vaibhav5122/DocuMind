import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const allowedMimeTypes = [
  "application/pdf",
  "application/octet-stream", //for postman
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  console.log("-> Incoming File Details:", {
    originalname: file.originalname,
    mimetype: file.mimetype, // <-- Look at this in your terminal!
  });

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      ApiError.badRequest("Only PDF, DOCX and TXT files are allowed"),
    );
  }
  callback(null, true);
};

console.log("Middleware");

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
});
