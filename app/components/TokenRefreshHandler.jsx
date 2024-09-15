
  // components/TokenRefreshHandler.js
  'use client'
  import { useEffect } from 'react';
  import { refreshAccessToken } from '../utils/auth';
  
  export default function TokenRefreshHandler() {
    useEffect(() => {
      const intervalId = setInterval(async () => {
        await refreshAccessToken();
      }, 3 * 60 * 1000); // 5 minutes
  
      return () => clearInterval(intervalId);
    }, []);
  
    return null; // This component does not render anything
  }
  