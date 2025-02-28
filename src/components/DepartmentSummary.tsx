import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../scss/DepartmentSummary.scss";

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


interface DepartmentData {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>; 
}


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

      if (user.gender === 'male') groupedData[user.department].male++;
      else if (user.gender === 'female') groupedData[user.department].female++;

      const ageRange = `${Math.floor(user.age / 10) * 10}-${Math.floor(user.age / 10) * 10 + 9}`;
      groupedData[user.department].ageRange = ageRange;

      const hairColor = user.hair.color;
      if (!groupedData[user.department].hair[hairColor]) {
        groupedData[user.department].hair[hairColor] = 1;
      } else {
        groupedData[user.department].hair[hairColor]++;
      }

      const fullAddress = `${user.address.address}, ${user.address.city}, ${user.address.state} ${user.address.stateCode}, ${user.address.country}, ${user.address.postalCode}`;

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
