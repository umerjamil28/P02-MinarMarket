import React from 'react';
import { Navigate } from 'react-router-dom';

const RouteGuard = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/" replace />;
  }

  return children; // If token exists, render protected content
};

export default RouteGuard;
