import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME || "dpgags9kx",
        api_key: process.env.CLOUDINARY_API_KEY || "your_default_api_key",
        api_secret: process.env.CLOUDINARY_SECRET_KEY || "your_default_api_secret",
    });
    console.log("Cloudinary is configured");
};

export default connectCloudinary;
