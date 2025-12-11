// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import API_BASE_URL from '../config/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left image section */}
      <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://alumni.amrita.edu/wp-content/uploads/2023/06/job_search_portals.png')" }}>
        {/* Optional overlay or logo */}
      </div>

      {/* Right form section */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Email</label>
            <div className="flex items-center border rounded px-3">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full py-2 outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Password</label>
            <div className="flex items-center border rounded px-3">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full py-2 outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            Login
          </button>

          <div className="flex justify-between items-center mt-3 mb-1">
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
              Forgot password?
            </Link>
          </div>

          <p className="text-center mt-4 text-sm">
            Don’t have an account? <Link to="/register" className="text-blue-600 font-semibold">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
