"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';

interface Car {
  title: string;
  description: string;
  images?: string[];
  tags?: string[];
  userId: string;  // Adding userId for security checks
}

export default function CarDetailsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const carId = typeof params?.id === 'string' ? params.id : null;
  
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user && carId) {
      fetchCarDetails();
    } else if (!carId) {
      setError('Invalid car ID');
      setIsLoading(false);
    }
  }, [user, loading, carId]);

  const fetchCarDetails = async () => {
    if (!carId) return;

    try {
      const carRef = doc(db, 'cars', carId);
      const carDoc = await getDoc(carRef);
      
      if (!carDoc.exists()) {
        setError('Car not found');
        setCar(null);
        return;
      }

      const carData = carDoc.data() as Car;
      
      // Security check: ensure user owns this car
      if (carData.userId !== user?.uid) {
        setError('You do not have permission to view this car');
        setCar(null);
        return;
      }

      setCar(carData);
      setTitle(carData.title);
      setDescription(carData.description);
      setError(null);
    } catch (error) {
      console.error('Error fetching car details:', error);
      setError('Failed to load car details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!carId) return;
    
    if (!title.trim() || !description.trim()) {
      setError('Title and Description cannot be empty!');
      return;
    }

    try {
      const carRef = doc(db, 'cars', carId);
      await updateDoc(carRef, {
        title: title.trim(),
        description: description.trim(),
        updatedAt: new Date().toISOString(),
      });
      
      setIsEditing(false);
      setError(null);
      
      // Refresh car details
      await fetchCarDetails();
    } catch (error) {
      console.error('Error updating car:', error);
      setError('Failed to update car details');
    }
  };

  const handleDelete = async () => {
    if (!carId) return;

    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        const carRef = doc(db, 'cars', carId);
        await deleteDoc(carRef);
        router.push('/cars');
      } catch (error) {
        console.error('Error deleting car:', error);
        setError('Failed to delete car');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(car?.title || '');
    setDescription(car?.description || '');
    setError(null);
  };

  if (loading || isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Car not found</h2>
          <Button onClick={() => router.push('/cars')}>Back to Cars</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Car Details</h1>
        <div className="space-x-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => router.push('/cars')}>
                Back
              </Button>
              <Button variant="outline" onClick={handleEdit}>
                Edit
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </>
          )}
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="relative w-[640px] h-[640px]">
          {car.images?.length ? (
            <img
              src={car.images[0]}
              alt={`${car.title} - Image`}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div>
            {!isEditing ? (
              <h1 className="text-2xl font-bold">{car.title}</h1>
            ) : (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold w-full p-2 border border-gray-300 rounded"
                placeholder="Enter car title"
              />
            )}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Description</h2>
            {!isEditing ? (
              <p className="whitespace-pre-wrap">{car.description}</p>
            ) : (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded min-h-[150px]"
                placeholder="Enter car description"
              />
            )}
          </div>

          {car.tags && car.tags.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {car.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}