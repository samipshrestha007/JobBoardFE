// client/src/pages/Employees.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeCard from '../components/EmployeeCard';
import API_BASE_URL from '../config/api';

export default function Employees() {
  const [emps, setEmps]   = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view employees');
      return;
    }

    axios.get(`${API_BASE_URL}/api/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setEmps(res.data);
      setError('');
    })
    .catch(err => {
      console.error('Fetch employees error:', err);
      setError(err.response?.data?.error || 'Failed to load employees');
    });
  }, []);

  const handleApply = async (employeeId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to apply');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/employees/${employeeId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Contact request sent!');
    } catch (err) {
      console.error('Apply employee error:', err);
      alert(err.response?.data?.error || 'Failed to send contact request');
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">
        {emps.length} Employees Available
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {emps.map(emp => (
          <EmployeeCard
            key={emp._id}
            emp={emp}
            onApply={handleApply}
          />
        ))}
      </div>
    </div>
  );
}
