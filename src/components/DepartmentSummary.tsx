import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../scss/DepartmentSummary.scss";

// 🟢 1. กำหนด Type สำหรับ User
interface User {
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

// 🟢 2. กำหนด Type สำหรับข้อมูลที่จัดกลุ่ม
interface DepartmentData {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>; // ✅ ใช้ข้อมูลที่อยู่เต็มรูปแบบ
}

// 🟢 3. Type ของข้อมูลทั้งหมดที่จัดกลุ่ม
type GroupedData = Record<string, DepartmentData>;

const DepartmentSummary: React.FC = () => {
  const [data, setData] = useState<GroupedData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ users: User[] }>('https://dummyjson.com/users');
        const users = response.data.users;
        console.log(users);
        const transformedData = groupByDepartment(users);
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // 🟢 4. ฟังก์ชันจัดกลุ่มข้อมูลตาม department
  const groupByDepartment = (users: User[]): GroupedData => {
    const groupedData: GroupedData = {};

    users.forEach((user) => {
      if (!groupedData[user.department]) {
        groupedData[user.department] = {
          male: 0,
          female: 0,
          ageRange: '',
          hair: {},
          addressUser: {},
        };
      }

      // นับจำนวนเพศ
      if (user.gender === 'male') groupedData[user.department].male++;
      else if (user.gender === 'female') groupedData[user.department].female++;

      // คำนวณช่วงอายุเป็นช่วงสิบปี
      const ageRange = `${Math.floor(user.age / 10) * 10}-${Math.floor(user.age / 10) * 10 + 9}`;
      groupedData[user.department].ageRange = ageRange;

      // ✅ ใช้เฉพาะ `color` จาก `hair`
      const hairColor = user.hair.color;
      if (!groupedData[user.department].hair[hairColor]) {
        groupedData[user.department].hair[hairColor] = 1;
      } else {
        groupedData[user.department].hair[hairColor]++;
      }

      // ✅ ใช้ที่อยู่เต็มรูปแบบ
      const fullAddress = `${user.address.address}, ${user.address.city}, ${user.address.state} ${user.address.stateCode}, ${user.address.country}, ${user.address.postalCode}`;

      // ✅ จัดเก็บที่อยู่ของผู้ใช้
      groupedData[user.department].addressUser[user.name] = fullAddress;
    });

    return groupedData;
  };

  return (
    <div className="department-summary-container">
      <h1>Department Summary</h1>
      {data ? (
        Object.keys(data).map((department) => (
          <div key={department} className="department-summary">
            <h2>{department}</h2>
            <p>Male: {data[department].male}</p>
            <p>Female: {data[department].female}</p>
            <p>Age Range: {data[department].ageRange}</p>

            <div className="hair-summary">
              {Object.entries(data[department].hair).map(([hairColor, count]) => (
                <div key={hairColor}>
                  <span>{hairColor}: </span>{count}
                </div>
              ))}
            </div>

            <div className="address-user">
              {/* 🟢 แสดงที่อยู่เต็มรูปแบบ */}
              {Object.entries(data[department].addressUser).map(([name, address]) => (
                <div key={name}>
                   {address}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DepartmentSummary;
