import multer from 'multer';
import { Request } from 'express';
import AppError from '../errors/AppError';

// Allowed image MIME types: JPEG, PNG, WebP
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

// Maximum allowed image size: 5MB
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Maximum number of images allowed per product upload request
export const MAX_PRODUCT_IMAGES_COUNT = 5;

// Configure Multer to store uploaded files in memory buffers
const storage = multer.memoryStorage();

// File filter callback validating MIME types
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        400,
        `Invalid file type: ${file.mimetype}. Only JPEG, PNG, and WebP images are allowed.`
      )
    );
  }
};

// Reusable Multer instance
export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_FILE_SIZE,
    files: MAX_PRODUCT_IMAGES_COUNT,
  },
  fileFilter,
});

/**
 * Middleware handler for product image uploads.
 * Accepts up to 5 images under the form-data key 'images'.
 */
export const uploadProductImages = upload.array('images', MAX_PRODUCT_IMAGES_COUNT);

export default upload;
