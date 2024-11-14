// components/ui/alert.tsx
import React from 'react';

interface AlertProps {
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ variant = 'default', children }) => {
  const alertStyles =
    variant === 'destructive'
      ? 'bg-red-100 text-red-700 border border-red-400'
      : 'bg-blue-100 text-blue-700 border border-blue-400';

  return (
    <div className={`p-4 rounded-md ${alertStyles}`} role="alert">
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => {
  return <p className="text-sm">{children}</p>;
};
