// types/index.ts
export interface Car {
    id: string;
    userId: string;
    title: string;
    description: string;
    images: string[];
    tags: {
      carType: string;
      company: string;
      dealer: string;
      [key: string]: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
  }
  
  export interface CarFormData {
    title: string;
    description: string;
    images: File[];
    tags: {
      carType: string;
      company: string;
      dealer: string;
      [key: string]: string;
    };
  }