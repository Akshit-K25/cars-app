import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const DebugState = () => {
  const { user, loading } = useAuth();
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black bg-opacity-80 text-white rounded-lg text-sm font-mono">
      <div>Loading: {loading.toString()}</div>
      <div>User: {user ? 'Authenticated' : 'Not Authenticated'}</div>
      {user && (
        <div>
          <div>UID: {user.uid}</div>
          <div>Email: {user.email}</div>
        </div>
      )}
    </div>
  );
};

export default DebugState;