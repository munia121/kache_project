import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';
import config from './index';
import AppError from '../errors/AppError';

// Configure Cloudinary SDK with environment credentials
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

/**
 * Uploads an image buffer directly to Cloudinary using upload_stream
 * to prevent storing temporary files on local disk storage.
 *
 * @param buffer - In-memory image file buffer
 * @param folder - Cloudinary folder path (defaults to 'kache/products')
 * @returns Promise resolving to the secure URL of the uploaded image
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = 'kache/products'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (
      !config.cloudinary_cloud_name ||
      !config.cloudinary_api_key ||
      !config.cloudinary_api_secret
    ) {
      return reject(
        new AppError(
          500,
          'Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.'
        )
      );
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) {
          return reject(
            new AppError(
              500,
              `Cloudinary upload failed: ${error.message || 'Unknown error'}`
            )
          );
        }
        if (!result || !result.secure_url) {
          return reject(
            new AppError(
              500,
              'Cloudinary upload failed: No secure URL returned from Cloudinary'
            )
          );
        }
        resolve(result.secure_url);
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    readableStream.on('error', (err) => {
      reject(new AppError(500, `Stream read error during image upload: ${err.message}`));
    });

    uploadStream.on('error', (err) => {
      reject(new AppError(500, `Cloudinary upload stream error: ${err.message}`));
    });

    readableStream.pipe(uploadStream);
  });
};

export default cloudinary;
