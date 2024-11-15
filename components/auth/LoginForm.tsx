"use client";

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, AuthError, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/Alert";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user token and store it
      const token = await user.getIdToken();
      localStorage.setItem('authToken', token);
      
      // Also store user info
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));

      // Use Next.js router for navigation
      router.push('/cars');
    } catch (err) {
      const error = err as AuthError;
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found for this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/invalid-email':
          setError('Invalid email format');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithGoogle();
      if (result) {
        const token = await result.getIdToken();
        localStorage.setItem('authToken', token);
        
        // Store user info
        localStorage.setItem('user', JSON.stringify({
          uid: result.uid,
          email: result.email,
          displayName: result.displayName
        }));

        router.push('/cars');
      }
    } catch (error) {
      setError('Failed to log in with Google. Please try again.');
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simplified authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/cars');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500">Enter your email and password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={handleChangeEmail}
            placeholder="Enter your email"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={handleChangePassword}
            placeholder="Enter your password"
            disabled={loading}
            required
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <Button
          type="button"
          className="w-full bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? 'Logging In with Google...' : 'Login with Google'}
        </Button>

        <p className="text-sm text-center text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;