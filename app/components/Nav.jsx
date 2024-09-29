'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { logout } from 'app/store/authSlice'; 
import { useRouter } from 'next/navigation';

const Nav = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const router=useRouter()
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleSignOut = async () => {
    try {
      // Call backend logout API
      const response = await fetch('https://doctorai-cw25.onrender.com//apis/logout/', {
        method: 'POST', // or 'GET' depending on your backend setup
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the token if necessary
        }
      });
  
      // Check if logout was successful
      if (response.ok) {
        // Dispatch the logout action to clear frontend state
        dispatch(logout());
        alert("Logout Successfull!")
        // Optionally remove the token from localStorage
        localStorage.removeItem('token');
  
        // Redirect to login page or home after successful sign-out
        router.push('/auth/login'); // Adjust the redirect if needed
      } else {
        console.error('Failed to log out from the backend');
      }
    } catch (error) {
      console.error('Error while logging out:', error);
    }
  };
  
  useEffect(() => {
    // Log the current authentication state for debugging
    console.log('Auth state updated:', isAuthenticated);
  }, [isAuthenticated]);

  // useEffect(() => {
  //   // Function to check authentication status
  //   const checkAuthStatus = () => {
  //     const token = localStorage.getItem('token'); // Check token in localStorage

  //     if (token) {
  //       setIsAuthenticated(true);
  //     } else {
  //       setIsAuthenticated(false);
  //     }
  //   };

  //   // Call the function on mount to check if the user is authenticated
  //   checkAuthStatus();

  //   // Listen for changes to the `localStorage` (triggered on login/logout)
  //   const handleStorageChange = () => {
  //     checkAuthStatus();
  //   };

  //   // Add event listener for storage changes
  //   window.addEventListener('storage', handleStorageChange);

  //   // Cleanup the event listener when the component is unmounted
  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, [router]);


  
  return (
    <nav className="bg-blue-600 p-4 shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center justify-between w-full">
          <div className="text-white text-lg font-semibold">
            <Link href="/">Doctor AI</Link>
          </div>
          <button
            className="text-white md:hidden flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
        <div
          className={`md:flex md:items-center md:space-x-6 ${isMenuOpen ? 'block' : 'hidden'}`}
        >
          <div className="flex flex-col md:flex-row md:space-x-6 w-full">
            {isAuthenticated ? (
              <>
                {/* <Link href="/" className="text-white hover:text-gray-200 px-4 py-2">
                  Home
                </Link> */}
                <Link href="/make-appointment" className="text-white hover:text-gray-200 px-4 py-2">
                  Make Appointment
                </Link>
                <Link href="/view-profile" className="text-white hover:text-gray-200 px-4 py-2">
                  Profile
                </Link>
                {/* <Link href="/update-profile" className="text-white hover:text-gray-200 px-4 py-2">
                  Update Profile
                </Link> */}
                <Link href="/my-appointments" className="text-white hover:text-gray-200 px-4 py-2">
                  Appointments
                </Link>
                <Link href="/diagnosis" className="text-white hover:text-gray-200 px-4 py-2">
                  Talk With The Diagnose AI
                </Link>
                <button
                  className="text-white hover:text-gray-200 px-4 py-2"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/" className="text-white hover:text-gray-200 px-4 py-2">
                  Home
                </Link>
                <Link href="/auth/login" className="text-white hover:text-gray-200 px-4 py-2">
                  Login
                </Link>
                <Link href="/auth/signup" className="text-white hover:text-gray-200 px-4 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
