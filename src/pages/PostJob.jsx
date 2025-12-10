import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaFileAlt, FaPhone, FaMoneyBillWave } from 'react-icons/fa';
import API_BASE_URL from '../config/api';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    contact: '',
    salary: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Title validation: 5-50 characters, alphanumeric with spaces
    if (!/^[A-Za-z0-9\s]{2,50}$/.test(form.title)) {
      newErrors.title = 'Job title must be 2-50 characters long and contain only letters, numbers, and spaces';
    }

    // Company validation: 2-50 characters, alphanumeric with spaces
    if (!/^[A-Za-z0-9\s]{2,50}$/.test(form.company)) {
      newErrors.company = 'Company name must be 2-50 characters long and contain only letters, numbers, and spaces';
    }

    // Location validation: 3-50 characters, alphanumeric with spaces and common symbols
    if (!/^[A-Za-z0-9\s,.-]{3,50}$/.test(form.location)) {
      newErrors.location = 'Location must be 3-50 characters long and contain only letters, numbers, spaces, and common symbols (.,-)';
    }

    // Description validation: 50-1000 characters
    if (form.description.length < 10 || form.description.length > 1000) {
      newErrors.description = 'Description must be between 10 and 1000 characters';
    }

    // Contact validation: exactly 10 digits
    if (!/^\d{10}$/.test(form.contact)) {
      newErrors.contact = 'Contact number must be 10 digits';
    }

    // Salary validation: positive number between 1000 and 1000000
    const salary = Number(form.salary);
    if (isNaN(salary) || salary < 1000 || salary > 1000000) {
      newErrors.salary = 'Salary must be between 1,000 and 1,000,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Prevent non-numeric input for contact
    if (name === 'contact' && !/^\d*$/.test(value)) {
      return;
    }

    // Prevent negative numbers for salary
    if (name === 'salary' && value !== '' && Number(value) < 0) {
      return;
    }

    setForm(prevForm => ({ ...prevForm, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  }, [errors]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE_URL}/api/jobs`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Job posted successfully!');
      navigate('/jobs');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to post job');
    }
  };

  const InputField = useCallback(({ icon, name, value, onChange, placeholder, type = "text", error, required = false }) => (
    <div>
      <label className="block mb-1 font-semibold capitalize">{name}</label>
      <div className={`flex items-center border rounded px-3 ${error ? 'border-red-500' : ''}`}>
        <span className="text-gray-500 mr-2">{icon}</span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full py-2 outline-none"
          placeholder={placeholder}
          required={required}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  ), []);

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Post a Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          icon={<FaBriefcase />}
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          error={errors.title}
          required
        />
        <InputField
          icon={<FaBuilding />}
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company Name"
          error={errors.company}
          required
        />
        <InputField
          icon={<FaMapMarkerAlt />}
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          error={errors.location}
          required
        />
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <div className={`flex items-start border rounded px-3 ${errors.description ? 'border-red-500' : ''}`}>
            <span className="text-gray-500 mr-2 mt-3"><FaFileAlt /></span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Job Description"
              className="w-full py-2 outline-none resize-none"
              rows="4"
              required
            />
          </div>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        <InputField
          icon={<FaPhone />}
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          error={errors.contact}
          required
        />
        <InputField
          icon={<FaMoneyBillWave />}
          name="salary"
          type="number"
          value={form.salary}
          onChange={handleChange}
          placeholder="Salary"
          error={errors.salary}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors duration-300"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}
