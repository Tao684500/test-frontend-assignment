import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../scss/UserSummary.scss";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  age: number;
  hair: {
    color: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

const UserSummary: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [gender, setGender] = useState<string>(""); // สำหรับเลือกเพศ
  const [ageRange, setAgeRange] = useState<string>(""); // สำหรับเลือกช่วงอายุ
  const [currentPage, setCurrentPage] = useState<number>(1); // หน้าที่เลือก
  const itemsPerPage = 5; // จำนวนข้อมูลที่แสดงในแต่ละหน้า

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ users: User[] }>('https://dummyjson.com/users');
        const users = response.data.users;
        setData(users);
        setFilteredData(users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ฟังก์ชันสำหรับกรองข้อมูลตามเพศและช่วงอายุ
  const filterData = () => {
    let filtered = data;

    // กรองตามเพศ
    if (gender) {
      filtered = filtered.filter(user => user.gender === gender);
    }

    // กรองตามช่วงอายุ
    if (ageRange) {
      const [minAge, maxAge] = ageRange.split("-").map(Number);
      filtered = filtered.filter(user => user.age >= minAge && user.age <= maxAge);
    }

    setFilteredData(filtered);
  };

  // เมื่อมีการเปลี่ยนแปลงค่าของ dropdown
  useEffect(() => {
    filterData();
  }, [gender, ageRange]);

  // ฟังก์ชันที่ใช้ในการคำนวณข้อมูลที่จะแสดงในแต่ละหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // ฟังก์ชันสำหรับการเปลี่ยนหน้า
  const changePage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="user-summary-container">
      <h1>User Summary</h1>

      {/* Dropdown สำหรับเลือกเพศ */}
      <div>
        <label htmlFor="gender">Select Gender: </label>
        <select id="gender" onChange={(e) => setGender(e.target.value)} value={gender}>
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Dropdown สำหรับเลือกช่วงอายุ */}
      <div>
        <label htmlFor="ageRange">Select Age Range: </label>
        <select id="ageRange" onChange={(e) => setAgeRange(e.target.value)} value={ageRange}>
          <option value="">All</option>
          <option value="1-10">1-10</option>
          <option value="11-20">11-20</option>
          <option value="21-30">21-30</option>
          <option value="31-40">31-40</option>
          <option value="41-50">41-50</option>
          <option value="51-60">51-60</option>
        </select>
      </div>

      {/* แสดงข้อมูลผู้ใช้ */}
      <div>
        {currentItems.length > 0 ? (
          currentItems.map((user) => (
            <div key={user.id} className="user-summary">
              <h2>{user.firstName} {user.lastName}</h2>
              <p>Gender: {user.gender}</p>
              <p>Age: {user.age}</p>
              <p>Hair Color: {user.hair.color}</p>
              <p>Address: {user.address.address}, {user.address.city}, {user.address.state}, {user.address.country}, {user.address.postalCode}</p>
            </div>
          ))
        ) : (
          <p>No users found matching the filters.</p>
        )}
      </div>

      {/* Pagination with Previous and Next buttons */}
      <div className="pagination">
        <button 
          onClick={() => changePage(currentPage - 1)} 
          disabled={currentPage === 1}>
          Previous
        </button>
        <button 
          onClick={() => changePage(currentPage + 1)} 
          disabled={currentPage * itemsPerPage >= filteredData.length}>
          Next
        </button>
      </div>
    </div>
  );
};

export default UserSummary;
