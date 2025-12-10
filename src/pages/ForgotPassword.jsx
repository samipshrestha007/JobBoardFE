import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock, FaKey, FaArrowLeft } from 'react-icons/fa';
import API_BASE_URL from '../config/api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      setSuccess(response.data.message);
      if (response.data.mockMode) {
        setSuccess(`${response.data.message} (Check server console for code)`);
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_BASE_URL}/api/auth/check-code`, { 
        email, 
        verificationCode: resetCode,
        type: 'reset'
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email,
        resetCode,
        newPassword
      });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={handleSendResetCode} className="space-y-6">
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Email Address</label>
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <FaEnvelope className="text-gray-500 mr-3" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none"
            placeholder="Enter your email address"
            required
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition"
      >
        {loading ? 'Sending...' : 'Send Reset Code'}
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleVerifyCode} className="space-y-6">
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Verification Code</label>
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <FaKey className="text-gray-500 mr-3" />
          <input
            type="text"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            className="w-full outline-none"
            placeholder="Enter 6-digit code"
            maxLength="6"
            required
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Enter the 6-digit code sent to {email}
        </p>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition"
      >
        {loading ? 'Verifying...' : 'Verify Code'}
      </button>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div>
        <label className="block mb-2 font-semibold text-gray-700">New Password</label>
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <FaLock className="text-gray-500 mr-3" />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full outline-none"
            placeholder="Enter new password"
            minLength="6"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">Confirm New Password</label>
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <FaLock className="text-gray-500 mr-3" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full outline-none"
            placeholder="Confirm new password"
            minLength="6"
            required
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-lg transition"
      >
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Login
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
          <p className="text-gray-600 mt-2">
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && "Enter the verification code sent to your email"}
            {step === 3 && "Create your new password"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Form Steps */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 