"use client";

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, inMemoryPersistence, setPersistence, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Use in-memory persistence
setPersistence(auth, inMemoryPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Save user data to Firestore or session
    const token = await user.getIdToken();
    localStorage.setItem('authToken', token);
    
    return user;
  } catch (error) {
    console.error("Google Sign-in Error:", error);
    throw error;
  }
};

export { auth, db, storage, signInWithGoogle };