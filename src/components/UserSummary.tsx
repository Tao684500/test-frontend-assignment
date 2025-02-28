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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

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

  const filterData = () => {
    let filtered = data;

    if (gender) {
      filtered = filtered.filter(user => user.gender === gender);
    }

    if (ageRange) {
      const [minAge, maxAge] = ageRange.split("-").map(Number);
      filtered = filtered.filter(user => user.age >= minAge && user.age <= maxAge);
    }

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData();
  }, [gender, ageRange, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const changePage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="user-summary-container">
      <h1>User Summary</h1>
      <div>
        <label htmlFor="search">Search (First Name / Last Name): </label>
        <input 
          type="text" 
          id="search" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Enter name"
        />
      </div>
      <div>
        <label htmlFor="gender">Select Gender: </label>
        <select id="gender" onChange={(e) => setGender(e.target.value)} value={gender}>
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
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
