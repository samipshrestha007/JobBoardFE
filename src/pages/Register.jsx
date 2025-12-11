// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import API_BASE_URL from '../config/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/send-verification`, { email });
      setSuccess('Verification code sent! Redirecting...');
      setTimeout(() => {
        navigate('/verify-email', { state: { email } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left image */}
      <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://alumni.amrita.edu/wp-content/uploads/2023/06/job_search_portals.png')" }} />

      {/* Right form */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-gray-100">
        <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-lg">
          <div className="text-center mb-6">
            <FaShieldAlt className="text-4xl text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Email Verification</h2>
            <p className="text-gray-600 mt-2">Enter your email to receive a verification code</p>
          </div>

          {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-4 text-center">{success}</p>}

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
