// api.ts
import axios from 'axios';
import { User } from '../utils/types';

// ฟังก์ชันสำหรับดึงข้อมูลจาก API
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<{ users: User[] }>('https://dummyjson.com/users');
    return response.data.users;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
