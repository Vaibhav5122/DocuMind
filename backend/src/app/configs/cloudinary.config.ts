import { v2 as cloudinary } from "cloudinary";
import { envZod } from "../../common/envSanitization.js";

cloudinary.config({
  cloud_name: envZod.CLOUDINARY_CLOUD_NAME,
  api_key: envZod.CLOUDINARY_API_KEY,
  api_secret: envZod.CLOUDINARY_API_SECRET,
});

export default cloudinary;
