// components/ProtectedRoute.jsx
// components/ProtectedRoute.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux'; // Ensure Redux is set up correctly
import { useSession } from "next-auth/react";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { data: session } = useSession();

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Show a loading state or nothing while redirecting
  if (!isAuthenticated) {
    return null; // Alternatively, return a loading spinner or similar
  }

  return <>{children}</>; // Render children if authenticated
};

export default ProtectedRoute;
