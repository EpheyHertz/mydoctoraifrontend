'use client'
import { isAuthenticated } from '../utils/auth';
import React, { useState, useEffect, useCallback,useLayoutEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
const UserProfile = () => {
  const { data: session } = useSession();  //
  const router = useRouter();
  // useEffect(() => {
  //   if (session) {
  //     const { accessToken, idToken, code } = session; // Adjust according to your actual session data structure
  //     // Send token to backend (optional - depends on your API design)
  //     fetch('http://127.0.0.1:8000/apis/auth/google/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
        
  //       },
  //       body: JSON.stringify({ access_token: session.accessToken,code:session.code,id_token:session.idToken }),
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log("Google token exchange response:", data);
  //     });
  //   }
  // }, [session]);
  useLayoutEffect(() => {
        const checkAuth = () => {
          if (!isAuthenticated()) {
            router.push('/auth/login'); // Redirect to home page if not authenticated
          }
        };
    
        checkAuth();
      }, [router]);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    profile: {
      gender: '',
      phone_number: '',
      address: '',
    },
    doctor_details: {
      name: '',
      specialty: '',
    },
    patient_details: {
      name: '',
      age: 0,
      medical_history: '',
    },
  });
  const [errors, setErrors] = useState(null);

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expiry = decodedToken.exp;
      return Date.now() >= expiry * 1000;
    } catch (error) {
      console.error('Error decoding token:');
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
  },[]);

  const fetchWithTokenRefresh = useCallback(async (url, options) => {
    let token = localStorage.getItem('token');
    if (isTokenExpired(token)) {
      token = await refreshAccessToken();
    }
  
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
  }, [refreshAccessToken]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithTokenRefresh('https://doctorai-cw25.onrender.com/apis/update/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result)
          setUserData(result);

          // Update formData based on user role
          const updatedFormData = {
            profile: {
              gender: result.profile.gender || '',
              phone_number: result.profile.phone_number || '',
              address: result.profile.address || '',
            },
            doctor_details: result.profile.role === 'doctor' ? {
              name: result.profile.doctor_details?.name || '',
              specialty: result.profile.doctor_details?.specialty || '',
            } : {
              name: '',
              specialty: ''
            },
            patient_details: result.profile.role === 'patient' ? {
              name: result.profile.patient_details?.name || '',
              age: result.profile.patient_details?.age || 0,
              medical_history: result.profile.patient_details?.medical_history || '',
            } : {
              name: '',
              age: 0,
              medical_history: ''
            }
          };

          setFormData(updatedFormData);
        } else {
          setErrors('Failed to load user data.');
        }
      } catch (error) {
        console.error('Error fetching profile data:');
        setErrors('Network error. Please try again later.');
      }
    };

    fetchUserData();
  }, [fetchWithTokenRefresh]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [parentKey, childKey] = name.split('.');

    if (childKey) {
      setFormData((prevData) => ({
        ...prevData,
        [parentKey]: {
          ...prevData[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
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
      console.error('Error updating profile:');
      setErrors('Network error. Please try again later.');
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute> 
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Profile</h1>
      {errors && <div className="text-red-500 mb-4">{errors}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="form-group">
            <label className="text-gray-700 font-medium">Username:</label>
            <input
              type="text"
              name="username"
              value={userData.user.username || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label className="text-gray-700 font-medium">Email:</label>
            <input
              type="email"
              name="email"
              value={userData.user.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label className="text-gray-700 font-medium">Role:</label>
            <input
              type="text"
              name="role"
              value={userData.profile.role || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
  <label className="text-gray-700 font-medium">Gender:</label>
  <select
    name="profile.gender"
    value={formData.profile.gender || ''}
    onChange={handleChange}
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">Select Gender</option>
    <option value="M">Male</option>
    <option value="F">Female</option>
  </select>
</div>

          <div className="form-group">
            <label className="text-gray-700 font-medium">Phone Number:</label>
            <input
              type="text"
              name="profile.phone_number"
              value={formData.profile.phone_number || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label className="text-gray-700 font-medium">Address:</label>
            <input
              type="text"
              name="profile.address"
              value={formData.profile.address || ''}
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
                  name="doctor_details.name"
                  value={formData.doctor_details.name || ''}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="text-gray-700 font-medium">Specialty:</label>
                <input
                  type="text"
                  name="doctor_details.specialty"
                  value={formData.doctor_details.specialty || ''}
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
                <label className="text-gray-700 font-medium">Name:</label>
                <input
                  type="text"
                  name="patient_details.name"
                  value={formData.patient_details.name || ''}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="text-gray-700 font-medium">Age:</label>
                <input
                  type="number"
                  name="patient_details.age"
                  value={formData.patient_details.age || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="text-gray-700 font-medium">Medical History:</label>
                <textarea
                  type="text"
                  name="patient_details.medical_history"
                  value={formData.patient_details.medical_history || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
    </ProtectedRoute>
  );
};

export default UserProfile;
