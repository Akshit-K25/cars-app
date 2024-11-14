// app/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Car Management System',
  description: 'Manage your car inventory with ease',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Manage Your Car Inventory with Ease
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A comprehensive solution for dealers and car enthusiasts to manage their vehicle inventory. 
              Upload images, track details, and organize your collection all in one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <Button size="lg" className="rounded-md px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-md px-8"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              Powerful Features
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your cars
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Image Management
                </div>
                <div className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p>Upload and manage up to 10 high-quality images for each car in your inventory.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Detailed Information
                </div>
                <div className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p>Track comprehensive details including car type, company, dealer information, and custom tags.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Search & Filter
                </div>
                <div className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p>Powerful search functionality to quickly find cars based on any attribute or tag.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join thousands of dealers and car enthusiasts who are already using our platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <Button size="lg" className="rounded-md px-8">
                  Create an Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}