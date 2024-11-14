// app/api/cars/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.currentUser;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tags = JSON.parse(formData.get('tags') as string);
    const images = formData.getAll('images') as File[];

    // Upload images
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const storageRef = ref(storage, `cars/${session.uid}/${Date.now()}-${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        return getDownloadURL(snapshot.ref);
      })
    );

    // Create car document
    const carData = {
      userId: session.uid,
      title,
      description,
      images: imageUrls,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'cars'), carData);

    return NextResponse.json({ id: docRef.id, ...carData });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.currentUser;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let carsQuery = query(
      collection(db, 'cars'),
      where('userId', '==', session.uid),
      orderBy('createdAt', 'desc')
    );

    if (search) {
      // Note: This is a simple implementation. For production, consider using a proper search service
      carsQuery = query(
        collection(db, 'cars'),
        where('userId', '==', session.uid),
        where('title', '>=', search),
        where('title', '<=', search + '\uf8ff')
      );
    }

    const snapshot = await getDocs(carsQuery);
    const cars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}