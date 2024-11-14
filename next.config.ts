import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // allow images from Cloudinary
  },
  env: {
    CLOUDINARY_CLOUD_NAME: 'deljet9q1', // Replace with your Cloudinary cloud name
    CLOUDINARY_UPLOAD_PRESET: 'ml_default',    // Replace with your upload preset
  },
};

export default nextConfig;