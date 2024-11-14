import React, { useState } from 'react';
import axios from 'axios';

interface CloudinaryImageUploaderProps {
  onImageUpload: (imageUrls: string[]) => void;  // Accepts an array of image URLs
}

const CloudinaryImageUploader: React.FC<CloudinaryImageUploaderProps> = ({ onImageUpload }) => {
  const [files, setFiles] = useState<File[]>([]);  // Store all selected files
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);  // Store previews of selected images
  const [isLoading, setIsLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    
    // Check if the number of selected files is 10 or fewer
    if (selectedFiles.length + files.length <= 10) {
      const updatedFiles = [...files, ...selectedFiles];
      setFiles(updatedFiles);

      // Generate previews for the selected files
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    } else {
      alert('You can only upload a maximum of 10 images.');
    }
  };

  // Handle image upload to Cloudinary
  const handleUpload = async () => {
    if (files.length > 0) {
      setIsLoading(true);
      const uploadedImageUrls: string[] = [];
      
      try {
        // Upload each file to Cloudinary
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'my-preset');  // Replace with your Cloudinary preset

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/deljet9q1/image/upload`,  // Replace with your Cloudinary cloud name
            formData
          );

          // Add the uploaded image URL to the array
          uploadedImageUrls.push(response.data.secure_url);
        }

        // Send the uploaded image URLs to the parent component
        onImageUpload(uploadedImageUrls);
      } catch (error) {
        console.error('Error uploading images:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={isLoading}
        className="mb-4"
        multiple  // Allow multiple files
      />
      <button
        onClick={handleUpload}
        disabled={files.length === 0 || isLoading}
        className="bg-white text-black border border-black hover:bg-black hover:text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Uploading...' : 'Upload Images'}
      </button>

      {/* Image Previews */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {imagePreviews.map((preview, index) => (
          <img
            key={index}
            src={preview}
            alt={`Preview ${index + 1}`}
            className="w-32 h-32 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
};

export default CloudinaryImageUploader;