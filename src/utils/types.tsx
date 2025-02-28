// types.ts
export interface User {
    id: number;
    name: string;
    age: number;
    gender: "male" | "female";
    department: string;
    hair: {
      color: string;
      type: string;
    };
    address: {
      address: string;
      city: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      country: string;
      postalCode: string;
      state: string;
      stateCode: string;
    };
  }
  
  export interface DepartmentData {
    male: number;
    female: number;
    ageRange: string;
    hair: Record<string, number>;
    addressUser: Record<string, string>; // ใช้ข้อมูลที่อยู่เต็มรูปแบบ
  }
  
  export type GroupedData = Record<string, DepartmentData>;
  