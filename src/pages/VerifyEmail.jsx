import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaShieldAlt, FaEnvelope, FaArrowLeft, FaUser, FaLock, FaPhone, FaBriefcase, FaClock } from 'react-icons/fa';

export default function VerifyEmail() {
  const [step, setStep] = useState(1); // 1: code, 2: registration
  const [verificationCode, setVerificationCode] = useState('');
  const [form, setForm] = useState({
    name: '',
    password: '',
    role: 'jobseeker',
    contact: '',
    position: '',
    yearsOfExperience: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    navigate('/register');
    return null;
  }

  // Step 1: Only verify code (call /api/auth/check-code)
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/check-code', {
        email,
        verificationCode
      });
      setSuccess('Code verified! Please complete your registration.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Registration form validation
  const validateForm = () => {
    const newErrors = {};
    if (!/^[A-Za-z\s]{5,}$/.test(form.name)) {
      newErrors.name = 'Name must be at least 5 characters long and contain only letters';
    }
    if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (!/^\d{10}$/.test(form.contact)) {
      newErrors.contact = 'Contact number must be 10 digits';
    }
    if (form.role === 'jobseeker' && !/^[A-Za-z\s]+$/.test(form.position)) {
      newErrors.position = 'Position must contain only letters';
    }
    if (form.role === 'jobseeker') {
      const years = parseInt(form.yearsOfExperience);
      if (isNaN(years) || years < 0 || years > 50) {
        newErrors.yearsOfExperience = 'Years of experience must be between 0 and 50';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'contact' && !/^\d*$/.test(value)) return;
    if (name === 'yearsOfExperience' && !/^\d*$/.test(value)) return;
    if (name === 'name' && !/^[A-Za-z\s]*$/.test(value)) return;
    if (name === 'position' && !/^[A-Za-z\s]*$/.test(value)) return;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Step 2: Registration submit
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-email', {
        email,
        verificationCode,
        ...form
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Code input
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-xl">
            <div className="text-center">
              <FaShieldAlt className="text-4xl text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a verification code to <span className="font-semibold">{email}</span>
              </p>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    className="w-full border border-gray-300 px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 text-sm"
              >
                <FaArrowLeft className="mr-2" />
                Back to Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Registration form
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Complete Registration</h2>
            <p className="text-gray-600 mt-2">Email verified: <span className="font-semibold">{email}</span></p>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          <form onSubmit={handleRegistrationSubmit} className="space-y-4">
            <InputField 
              icon={<FaUser />} 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              placeholder="Full Name" 
              error={errors.name}
            />
            <InputField 
              icon={<FaLock />} 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              placeholder="Password" 
              type="password" 
              error={errors.password}
            />
            <InputField 
              icon={<FaPhone />} 
              name="contact" 
              value={form.contact} 
              onChange={handleChange} 
              placeholder="Contact Number" 
              error={errors.contact}
            />
            <div>
              <label className="block mb-1 font-semibold">Role</label>
              <select 
                name="role" 
                value={form.role} 
                onChange={handleChange} 
                className="w-full border px-3 py-2 rounded outline-none"
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
            </div>
            {form.role === 'jobseeker' && (
              <>
                <InputField 
                  icon={<FaBriefcase />} 
                  name="position" 
                  value={form.position} 
                  onChange={handleChange} 
                  placeholder="Desired Position" 
                  error={errors.position}
                />
                <InputField 
                  icon={<FaClock />} 
                  name="yearsOfExperience" 
                  value={form.yearsOfExperience} 
                  onChange={handleChange} 
                  placeholder="Years of Experience" 
                  error={errors.yearsOfExperience}
                />
              </>
            )}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => setStep(1)}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Back to Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, name, value, onChange, placeholder, type = "text", error }) {
  return (
    <div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
} 