import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ApiDocsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Car Management API Documentation</h1>

      {/* Authentication Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
        <Card>
          <CardContent>
            <p className="mb-4">All API endpoints require authentication using a JWT token. Include the token in the Authorization header:</p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>Authorization: Bearer &lt;jwt_token&gt;</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* Error Responses Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Error Responses</h2>
        <Card>
          <CardContent>
            <p className="mb-4">All endpoints may return these error responses:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><code className="bg-gray-100 px-2 py-1 rounded">401 Unauthorized</code>: Invalid or missing authentication token</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">403 Forbidden</code>: User doesn&apos;t have permission to perform the action</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">500 Internal Server Error</code>: Server-side error</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Endpoints Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-8">Endpoints</h2>

        {/* Create User */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">1. Create User</h3>
          <Card>
            <CardContent>
              <p className="mb-2">Create a new user account.</p>
              <p className="mb-2"><strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded">POST /api/users</code></p>
              <div className="mb-4">
                <p className="font-medium mb-2">Request Body:</p>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify({
                    name: "string",
                    email: "string",
                    password: "string"
                  }, null, 2)}
                </pre>
              </div>
              <div className="mb-4">
                <p className="font-medium mb-2">Response (201 Created):</p>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify({
                    id: "string",
                    name: "string",
                    email: "string",
                    createdAt: "string (ISO date)"
                  }, null, 2)}
                </pre>
              </div>
              <div>
                <p className="font-medium mb-2">Possible Errors:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">400 Bad Request</code>: Invalid input data</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">409 Conflict</code>: Email already exists</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Car */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">2. Create Car</h3>
          <Card>
            <CardContent>
              <p className="mb-2">Create a new car listing.</p>
              <p className="mb-2"><strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded">POST /api/cars</code></p>
              <div className="mb-4">
                <p className="font-medium mb-2">Request Body:</p>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify({
                    title: "string",
                    description: "string",
                    carType: "string",
                    company: "string",
                    dealer: "string",
                    tags: ["string"],
                    images: ["string (URL)"]
                  }, null, 2)}
                </pre>
              </div>
              <div>
                <p className="font-medium mb-2">Possible Errors:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">400 Bad Request</code>: Invalid input data</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List Cars */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">3. List Cars</h3>
          <Card>
            <CardContent>
              <p className="mb-2">Get a list of all cars for the authenticated user.</p>
              <p className="mb-2"><strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded">GET /api/cars</code></p>
              <div className="mb-4">
                <p className="font-medium mb-2">Query Parameters:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><code>search</code> (optional): Search term for filtering cars</li>
                  <li><code>limit</code> (optional): Number of cars to return (default: 20)</li>
                  <li><code>offset</code> (optional): Number of cars to skip (default: 0)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional endpoints can be added following the same pattern... */}
      </section>

      {/* Rate Limiting Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Rate Limiting</h2>
        <Card>
          <CardContent>
            <p className="mb-4">All API endpoints are rate-limited to 100 requests per minute per user. When exceeded, the API will return:</p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify({
                error: "Too many requests",
                retryAfter: 60
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* Pagination Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Pagination</h2>
        <Card>
          <CardContent>
            <p className="mb-4">List endpoints support pagination using <code>limit</code> and <code>offset</code> parameters. The response includes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><code>total</code>: Total number of items</li>
              <li>Array of items for the current page</li>
            </ul>
            <p className="mb-2">Example:</p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              GET /api/cars?limit=20&offset=40
            </pre>
            <p className="mt-2">This would return cars 41-60 from the full list.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ApiDocsPage;