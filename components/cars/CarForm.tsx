import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import CloudinaryImageUploader from '@/components/CloudinaryImageUploader';
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { CarFormData } from '@/types/car';

interface CarFormProps {
  onSubmit?: (data: CarFormData) => Promise<void>;
}

const initialFormData: CarFormData = {
  title: '',
  description: '',
  carType: '',
  company: '',
  dealer: '',
  tags: [],
  images: []
};

const CarForm: React.FC<CarFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CarFormData>(initialFormData);
  const [currentTag, setCurrentTag] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleImageUpload = (uploadedUrls: string[]) => {
    setImageUrls(uploadedUrls);
    setFormData(prev => ({
      ...prev,
      images: uploadedUrls
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(e.target.value);
  };

  const handleAddTag = () => {
    if (currentTag.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to add a car');
      }

      const carData = {
        ...formData,
        images: imageUrls,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      };

      if (onSubmit) {
        await onSubmit(carData);
      } else {
        await addDoc(collection(db, 'cars'), carData);
        router.push('/cars');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while saving the car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter car title"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter car description"
          required
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Car Type</label>
          <Input
            name="carType"
            value={formData.carType}
            onChange={handleChange}
            placeholder="e.g., SUV, Sedan"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <Input
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g., Toyota, Honda"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dealer</label>
          <Input
            name="dealer"
            value={formData.dealer}
            onChange={handleChange}
            placeholder="Enter dealer name"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <div className="flex space-x-2">
          <Input
            value={currentTag}
            onChange={handleTagChange}
            placeholder="Enter tag"
            disabled={loading}
          />
          <Button type="button" onClick={handleAddTag} disabled={loading}>
            Add
          </Button>
        </div>
        <div className="mt-2">
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    aria-label="Remove tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Images</label>
        <CloudinaryImageUploader onImageUpload={handleImageUpload} />
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Image ${index + 1}`}
              className="w-full aspect-square object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Car'
        )}
      </Button>
    </form>
  );
};

export default CarForm;