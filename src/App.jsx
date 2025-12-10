// client/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar        from './components/NavBar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Hero          from './components/Hero.jsx';
import Footer        from './components/Footer.jsx';

import Home          from './pages/Home.jsx';
import Register      from './pages/Register.jsx';
import Login         from './pages/Login.jsx';
import VerifyEmail   from './pages/VerifyEmail.jsx';
import Jobs          from './pages/Jobs.jsx';
import Employees     from './pages/Employees.jsx';
import Dashboard     from './pages/Dashboard.jsx';
import PostJob       from './pages/PostJob.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<><Hero/><Home/></>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['employer','jobseeker']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <PostJob />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
