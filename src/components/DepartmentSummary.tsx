import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../scss/DepartmentSummary.scss";

const DepartmentSummary: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('https://dummyjson.com/users');
      const users = response.data.users;
      console.log(users);
      const transformedData = groupByDepartment(users);
      setData(transformedData);
    };

    fetchData();
  }, []);

  const groupByDepartment = (users: any) => {
    const groupedData: any = {};
    users.forEach((user: any) => {
      if (!groupedData[user.department]) {
        groupedData[user.department] = {
          male: 0,
          female: 0,
          ageRange: '',
          hair: { Black: 0, Blond: 0, Chestnut: 0, Brown: 0 },
          addressUser: {},
        };
      }

      if (user.gender === 'male') groupedData[user.department].male++;
      else if (user.gender === 'female') groupedData[user.department].female++;

      const ageRange = `${Math.floor(user.age / 10) * 10}-${Math.floor(user.age / 10) * 10 + 9}`;
      groupedData[user.department].ageRange = ageRange;

      groupedData[user.department].hair[user.hair]++;
      groupedData[user.department].addressUser[`${user.name}`] = user.postalCode;
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
                  <span>{hairColor}: </span>{count as number}
                </div>
              ))}
            </div>
            <div className="address-user">
              {Object.entries(data[department].addressUser).map(([name, postalCode]) => (
                <div key={name}>
                  {name}: {postalCode as string}
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
