"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, FirestoreError } from 'firebase/firestore';
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/Alert";

interface Car {
  id: string;
  title: string;
  description: string;
  carType: string;
  company: string;
  dealer: string;
  tags: string[];
  images: string[];
  userId: string;
  createdAt: string;
}

export default function CarsListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserCars = useCallback(async () => {
    if (!user) return;

    try {
      const carsRef = collection(db, 'cars');
      
      try {
        const userCarsQuery = query(
          carsRef, 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(userCarsQuery);
        const carsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Car[];

        setCars(carsData);
      } catch (error) {
        // Type guard for FirestoreError
        if (error instanceof FirestoreError && error.code === 'failed-precondition') {
          console.warn('Index not ready, falling back to unordered query');
          const fallbackQuery = query(
            carsRef, 
            where('userId', '==', user.uid)
          );
          
          const fallbackSnapshot = await getDocs(fallbackQuery);
          const fallbackData = fallbackSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Car[];

          fallbackData.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });

          setCars(fallbackData);

          if (process.env.NODE_ENV === 'development') {
            setError('Admin Note: Please create the required index in Firebase Console. The data is currently being sorted in-memory as a fallback.');
          }
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError('Failed to load cars. Please try again.');
    } finally {
      setLoadingCars(false);
    }
  }, [user]); // Include user in dependencies

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
      return;
    }

    if (user) {
      fetchUserCars();
    }
  }, [user, authLoading, router, fetchUserCars]); // Include fetchUserCars in dependencies

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCars(cars);
    } else {
      setFilteredCars(filterCars(cars, searchQuery));
    }
  }, [searchQuery, cars]);

  const filterCars = (cars: Car[], query: string) => {
    const queryLower = query.toLowerCase();
    return cars.filter((car) => {
      const tags = car.tags || [];
      const fullText = `${car.title} ${car.description} ${car.carType} ${car.company} ${car.dealer} ${tags.join(' ')}`.toLowerCase();
      return fullText.includes(queryLower);
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">My Cars</h1>
        <div className='flex space-x-2'>
          <Link href="/login">
            <Button className='border border-black bg-white text-black hover:bg-black hover:text-white'>Logout</Button>
          </Link>
          <Link href="/cars/new">
            <Button className='hover:border border-black hover:bg-white hover:text-black'>Add New Car</Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search cars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loadingCars ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Link
              key={car.id}
              href={`/cars/${car.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="relative w-92 h-92 overflow-hidden rounded-lg bg-gray-100">
                {car.images?.length > 0 ? (
                  <div className="flex overflow-hidden animate-marquee">
                    {car.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={car.title}
                        className="w-92 h-92 object-cover flex-shrink-0"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">{car.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {car.company} - {car.carType}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {car.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No cars added yet</p>
          <Link href="/cars/new">
            <Button>Add Your First Car</Button>
          </Link>
        </div>
      )}
    </div>
  );
}