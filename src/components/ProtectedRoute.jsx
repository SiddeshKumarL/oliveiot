import React from 'react';
import { Navigate } from 'react-router-dom';
import { useIoT } from '../context/IoTContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useIoT();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
