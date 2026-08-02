import { v2 as cloudinary } from "cloudinary";
import 'dotenv/config';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploads an in-memory file buffer (from multer's memoryStorage) to
// Cloudinary and resolves with the public URL + public_id. Wraps
// Cloudinary's stream-based upload API in a Promise so controllers can
// just `await` it like any other async call.
export const uploadBufferToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve({ url: result.secure_url, public_id: result.public_id });
            }
        );
        uploadStream.end(buffer);
    });
};

// Best-effort delete — if it fails (e.g. old record with no public_id)
// we just log it instead of blocking the remove/update request.
export const deleteFromCloudinary = async (public_id) => {
    if (!public_id) return;
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.log("Cloudinary delete error:", error);
    }
};

export default cloudinary;
