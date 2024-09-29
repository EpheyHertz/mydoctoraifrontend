// 'use client'
// import React, { useState, useEffect } from 'react';

// const UserProfile = () => {
//   const [userData, setUserData] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState(null);

//   // Helper function to check if the token is expired
//   const isTokenExpired = (token) => {
//     if (!token) return true;
//     const decodedToken = JSON.parse(atob(token.split('.')[1]));
//     const expiry = decodedToken.exp;
//     return Date.now() >= expiry * 1000;
//   };

//   // Function to refresh token
//   const refreshAccessToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       const response = await fetch('http://127.0.0.1:8000/apis/token/refresh/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ refresh: refreshToken }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         localStorage.setItem('token', result.access);
//         localStorage.setItem('refreshToken', result.refresh);
//         return result.access;
//       } else {
//         setErrors('Failed to refresh token.');
//         return null;
//       }
//     } catch (error) {
//       console.error('Error refreshing token:', error);
//       setErrors('Network error. Please try again later.');
//       return null;
//     }
//   };

//   // Function to make authenticated API request with token refresh logic
//   const fetchWithTokenRefresh = async (url, options) => {
//     let token = localStorage.getItem('token');

//     if (isTokenExpired(token)) {
//       token = await refreshAccessToken();
//     }

//     if (token) {
//       const updatedOptions = {
//         ...options,
//         headers: {
//           ...options.headers,
//           'Authorization': `Bearer ${token}`,
//         },
//       };
//       return fetch(url, updatedOptions);
//     } else {
//       throw new Error('Unable to refresh token.');
//     }
//   };

//   useEffect(() => {
//     // Fetch user data from backend API on component mount
//     const fetchUserData = async () => {
//       try {
//         const response = await fetchWithTokenRefresh('http://127.0.0.1:8000/apis/user/', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.ok) {
//           const result = await response.json();
//           console.log(result)
//           setUserData(result);
//           setFormData({
//             ...result,
//             ...result.profile,
//             ...(result.profile.doctor_profile || result.profile.patient_profile),
//           });
//         } else {
//           setErrors('Failed to load user data.');
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         setErrors('Network error. Please try again later.');
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors(null);

//     try {
//       const response = await fetchWithTokenRefresh('http://127.0.0.1:8000/apis/update/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log('Profile updated:', result.message);
//         // Optionally handle successful update
//       } else {
//         const result = await response.json();
//         setErrors(result.message || 'Error updating profile.');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       setErrors('Network error. Please try again later.');
//     }
//   };

//   if (!userData) {
//     return <div>Loading...</div>;
//   }

//   return (
// <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
//   <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Profile</h1>
//   {errors && <div className="text-red-500 mb-4">{errors}</div>}
//   <form onSubmit={handleSubmit} className="space-y-6">
//     <div className="grid grid-cols-1 gap-4">
//       <div className="form-group">
//         <label className="text-gray-700 font-medium">Username:</label>
//         <input
//           type="text"
//           name="username"
//           value={formData.username}
//           disabled
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div className="form-group">
//         <label className="text-gray-700 font-medium">Email:</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           disabled
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div className="form-group">
//         <label className="text-gray-700 font-medium">Role:</label>
//         <input
//           type="text"
//           name="role"
//           value={formData.role}
//           disabled
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div className="form-group">
//         <label className="text-gray-700 font-medium">Gender:</label>
//         <input
//           type="text"
//           name="gender"
//           value={formData.gender || ''}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div className="form-group">
//         <label className="text-gray-700 font-medium">Phone Number:</label>
//         <input
//           type="text"
//           name="phone_number"
//           value={formData.phone_number || ''}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div className="form-group">
//         <label className="text-gray-700 font-medium">Address:</label>
//         <input
//           type="text"
//           name="address"
//           value={formData.address || ''}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//     </div>

//     {userData.profile.role === 'doctor' && (
//       <div>
//         <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Doctor Details</h3>
//         <div className="grid grid-cols-1 gap-4">
//           <div className="form-group">
//             <label className="text-gray-700 font-medium">Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name || ''}
//               disabled
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="form-group">
//             <label className="text-gray-700 font-medium">Specialty:</label>
//             <input
//               type="text"
//               name="specialty"
//               value={formData.specialty || ''}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </div>
//     )}

//     {userData.profile.role === 'patient' && (
//       <div>
//         <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Patient Details</h3>
//         <div className="grid grid-cols-1 gap-4">
//           <div className="form-group">
//             <label className="text-gray-700 font-medium">Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name || ''}
//               disabled
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="form-group">
//             <label className="text-gray-700 font-medium">Age:</label>
//             <input
//               type="number"
//               name="age"
//               value={formData.age || ''}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="form-group">
//             <label className="text-gray-700 font-medium">Medical History:</label>
//             <textarea
//               name="medical_history"
//               value={formData.medical_history || ''}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </div>
//     )}

//     <div className="flex justify-center">
//       <button
//         type="submit"
//         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
//       >
//         Save
//       </button>
//     </div>
//   </form>
// </div>

//   );
// };

// export default UserProfile;

// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router'; // Assuming you're using Next.js for routing

// const UserProfile = () => {
//   const [userData, setUserData] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState(null);
//   const router = useRouter(); // Use Next.js router for redirection

//   // Helper function to check if the token is expired
//   const isTokenExpired = (token) => {
//     if (!token) return true;
//     const decodedToken = JSON.parse(atob(token.split('.')[1]));
//     const expiry = decodedToken.exp;
//     return Date.now() >= expiry * 1000;
//   };

//   // Function to refresh token
//   const refreshAccessToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) {
//         throw new Error('No refresh token found.');
//       }

//       const response = await fetch('http://127.0.0.1:8000/apis/token/refresh/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ refresh: refreshToken }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         localStorage.setItem('token', result.access);
//         localStorage.setItem('refreshToken', result.refresh);
//         return result.access;
//       } else {
//         throw new Error('Failed to refresh token.');
//       }
//     } catch (error) {
//       console.error('Error refreshing token:', error);
//       setErrors('Failed to refresh token. Redirecting to login...');
//       setTimeout(() => router.push('/login'), 2000); // Redirect after showing error message
//       return null;
//     }
//   };

//   // Function to make authenticated API request with token refresh logic
//   const fetchWithTokenRefresh = async (url, options) => {
//     let token = localStorage.getItem('token');

//     if (isTokenExpired(token)) {
//       token = await refreshAccessToken();
//     }

//     if (token) {
//       const updatedOptions = {
//         ...options,
//         headers: {
//           ...options.headers,
//           'Authorization': `Bearer ${token}`,
//         },
//       };
//       return fetch(url, updatedOptions);
//     } else {
//       throw new Error('Unable to refresh token.');
//     }
//   };

//   useEffect(() => {
//     const checkAuthAndFetchData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token || isTokenExpired(token)) {
//         const refreshedToken = await refreshAccessToken();
//         if (!refreshedToken) {
//           // If token cannot be refreshed, redirect to login
//           router.push('/login');
//           return;
//         }
//       }

//       // Fetch user data if the user is authenticated
//       try {
//         const response = await fetchWithTokenRefresh('http://127.0.0.1:8000/apis/user/', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.ok) {
//           const result = await response.json();
//           setUserData(result);
//           setFormData({
//             ...result,
//             ...result.profile,
//             ...(result.profile.doctor_profile || result.profile.patient_profile),
//           });
//         } else {
//           setErrors('Failed to load user data.');
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         setErrors('Network error. Please try again later.');
//       }
//     };

//     checkAuthAndFetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors(null);

//     try {
//       const response = await fetchWithTokenRefresh('http://127.0.0.1:8000/apis/update/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log('Profile updated:', result.message);
//       } else {
//         const result = await response.json();
//         setErrors(result.message || 'Error updating profile.');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       setErrors('Network error. Please try again later.');
//     }
//   };

//   if (!userData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
//       <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Profile</h1>
//       {errors && <div className="text-red-500 mb-4">{errors}</div>}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Form fields here */}
//         <div className="grid grid-cols-1 gap-4">
//       <div className="form-group">
//         <label className="text-gray-700 font-medium">Username:</label>
//         <input
//           type="text"
//           name="username"
//           value={formData.username}
//           disabled
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div className="form-group">
//         <label className="text-gray-700 font-medium">Email:</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           disabled
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div className="form-group">
//         <label className="text-gray-700 font-medium">Role:</label>
//         <input
//           type="text"
//           name="role"
//           value={formData.role}
//           disabled
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div className="form-group">
//         <label className="text-gray-700 font-medium">Gender:</label>
//         <input
//           type="text"
//           name="gender"
//           value={formData.gender || ''}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div className="form-group">
//         <label className="text-gray-700 font-medium">Phone Number:</label>
//         <input
//           type="text"
//           name="phone_number"
//           value={formData.phone_number || ''}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div className="form-group">
//         <label className="text-gray-700 font-medium">Address:</label>
//         <input
//           type="text"
//           name="address"
//           value={formData.address || ''}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//     </div>

//     {userData.profile.role === 'doctor' && (
//       <div>
//         <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Doctor Details</h3>
//         <div className="grid grid-cols-1 gap-4">
//           <div className="form-group">
//             <label className="text-gray-700 font-medium">Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name || ''}
//               disabled
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="form-group">
//             <label className="text-gray-700 font-medium">Specialty:</label>
//             <input
//               type="text"
//               name="specialty"
//               value={formData.specialty || ''}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </div>
//     )}

//     {userData.profile.role === 'patient' && (
//       <div>
//         <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Patient Details</h3>
//         <div className="grid grid-cols-1 gap-4">
//           <div className="form-group">
//             <label className="text-gray-700 font-medium">Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name || ''}
//               disabled
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="form-group">
//             <label className="text-gray-700 font-medium">Age:</label>
//             <input
//               type="number"
//               name="age"
//               value={formData.age || ''}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="form-group">
//             <label className="text-gray-700 font-medium">Medical History:</label>
//             <textarea
//               name="medical_history"
//               value={formData.medical_history || ''}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </div>
//     )}

//     <div className="flex justify-center">
//       <button
//         type="submit"
//         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
//       >
//         Save
//       </button>
//     </div>
//         <div className="flex justify-center">
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UserProfile;



'use client';
import React, { useState, useEffect, useCallback,useLayoutEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../components/ProtectedRoute';
import { isAuthenticated } from '../utils/auth';
import { useRouter } from 'next/navigation';
const UserProfile = () => {
  const router = useRouter();
    useLayoutEffect(() => {
        const checkAuth = () => {
          if (!isAuthenticated()) {
            router.push('/auth/login'); // Redirect to home page if not authenticated
          }
        };
    
        checkAuth();
      }, [router]);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState(null);

  // Helper function to check if the token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expiry = decodedToken.exp;
      return Date.now() >= expiry * 1000;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Treat as expired if there's an issue decoding
    }
  };

  // Function to refresh token
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await fetch('https://doctorai-cw25.onrender.com/apis/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('token', result.access);
        localStorage.setItem('refreshToken', result.refresh);
        return result.access;
      } else {
        setErrors('Failed to refresh token.');
        return null;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      setErrors('Network error. Please try again later.');
      return null;
    }
  }, []);

  // Function to make authenticated API request with token refresh logic
  const fetchWithTokenRefresh = useCallback(async (url, options) => {
    let token = localStorage.getItem('token');

    if (isTokenExpired(token)) {
      token = await refreshAccessToken();
    }

    if (token) {
      const updatedOptions = {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        },
      };
      return fetch(url, updatedOptions);
    } else {
      throw new Error('Unable to refresh token.');
    }
  }, [refreshAccessToken]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithTokenRefresh('https://doctorai-cw25.onrender.com/apis/user/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          setUserData(result);
          setFormData({
            ...result,
            ...result.profile,
            ...(result.profile.doctor_profile || result.profile.patient_profile),
          });
        } else {
          setErrors('Failed to load user data.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrors('Network error. Please try again later.');
      }
    };

    fetchUserData();
  }, [fetchWithTokenRefresh]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    try {
      const response = await fetchWithTokenRefresh('https://doctorai-cw25.onrender.com/apis/update/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Profile updated:', result.message);
      } else {
        const result = await response.json();
        setErrors(result.message || 'Error updating profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors('Network error. Please try again later.');
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Profile</h1>
      {errors && <div className="text-red-500 mb-4">{errors}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="form-group">
            <label className="text-gray-700 font-medium">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label className="text-gray-700 font-medium">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label className="text-gray-700 font-medium">Role:</label>
            <input
              type="text"
              name="role"
              value={formData.role || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label className="text-gray-700 font-medium">Gender:</label>
            <input
              type="text"
              name="gender"
              value={formData.gender || ''}
              disabled
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label className="text-gray-700 font-medium">Phone Number:</label>
            <input
              type="text"
              name="phone_number"
              disabled
              value={formData.phone_number || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label className="text-gray-700 font-medium">Address:</label>
            <input
              type="text"
              name="address"
              disabled
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {userData.profile.role === 'doctor' && (
          <div>
            <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Doctor Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="form-group">
                <label className="text-gray-700 font-medium">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="text-gray-700 font-medium">Specialty:</label>
                <input
                  type="text"
                  name="specialty"
                  disabled
                  value={formData.specialty || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {userData.profile.role === 'patient' && (
          <div>
            <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Patient Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="form-group">
                <label className="text-gray-700 font-medium">Patient Name:</label>
                <input
                  type="text"
                  name="patient_name"
                  value={formData.name || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="text-gray-700 font-medium">Patient Age:</label>
                <input
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="text-gray-700 font-medium">Medical History:</label>
                <textarea
                  name="medical_history"
                  value={formData.medical_history || ''}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

         <div className="text-center">
          <button
            type=""
            
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
             <Link href="/update-profile" className="text-white hover:text-gray-200 px-4 py-2">
                  Update Profile
              </Link>
            
          </button> 
        </div>
      </form>
    </div>
    </ProtectedRoute>
  );
};

export default UserProfile;
