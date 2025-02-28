import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../scss/DepartmentSummary.scss";

const DepartmentSummary: React.FC = () => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('https://dummyjson.com/users');
      const users = response.data.users;
      const transformedData = groupByDepartment(users);
      setData(transformedData);
    };

    fetchData();
  }, []);

  const groupByDepartment = (users: any) => {
    const groupedData: any = [];
    
    users.forEach((user: any) => {
      let department = groupedData.find((dept: any) => dept.department === user.department);
      if (!department) {
        department = {
          department: user.department,
          male: 0,
          female: 0,
          ageRange: '',
          hair: { Black: 0, Blond: 0, Chestnut: 0, Brown: 0 },
          addressUser: [],
        };
        groupedData.push(department);
      }

      if (user.gender === 'male') department.male++;
      else if (user.gender === 'female') department.female++;

      const ageRange = `${Math.floor(user.age / 10) * 10}-${Math.floor(user.age / 10) * 10 + 9}`;
      department.ageRange = ageRange;

      department.hair[user.hair]++;
      department.addressUser.push({ name: user.name, postalCode: user.postalCode });
    });

    return groupedData;
  };

  return (
    <div className="department-summary-container">
      <h1>Department Summary</h1>
      {data.length > 0 ? (
        data.map((departmentData: any, index: number) => (
          <div key={index} className="department-summary">
            <h2>{departmentData.department}</h2>
            <p>Male: {departmentData.male}</p>
            <p>Female: {departmentData.female}</p>
            <p>Age Range: {departmentData.ageRange}</p>
            <div className="hair-summary">
              {Object.entries(departmentData.hair).map(([hairColor, count]) => (
                <div key={hairColor}>
                  <span>{hairColor}: </span>{count as number}
                </div>
              ))}
            </div>
            <div className="address-user">
              {departmentData.addressUser.map(({ name, postalCode }: any) => (
                <div key={name}>
                  {name}: {postalCode}
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
