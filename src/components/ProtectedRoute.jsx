// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  const payload = parseJwt(token);
  if (!payload || !payload.role) {
    // Bad token
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(payload.role)) {
    // Wrong role
    return <Navigate to="/" replace />;
  }

  return children;
}
