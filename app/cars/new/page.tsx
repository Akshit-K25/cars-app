"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CarForm from '@/components/cars/CarForm';
import { CarFormData } from '@/types/car';

export default function NewCarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (data: CarFormData) => {
    try {
      // Here you'll implement your car creation logic
      console.log('Submitting car data:', data);
      
      // After successful creation
      router.push('/cars');
    } catch (error) {
      console.error('Error creating car:', error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Car</h1>
      <CarForm onSubmit={handleSubmit} />
    </div>
  );
}