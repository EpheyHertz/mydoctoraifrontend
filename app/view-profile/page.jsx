'use client';
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../utils/auth';
import ProtectedRoute from '../components/ProtectedRoute';

const UserProfile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle for editing mode

  useLayoutEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/auth/login');
      }
    };
    checkAuth();
  }, [router]);

  // Helper function to check if the token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expiry = decodedToken.exp;
      return Date.now() >= expiry * 1000;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  // Function to refresh token
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await fetch('http://127.0.0.1:8000/apis/token/refresh/', {
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

  // Fetch user data with token refresh
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

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithTokenRefresh('http://127.0.0.1:8000/apis/user/', {
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

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle profile update submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    try {
      const response = await fetchWithTokenRefresh('http://127.0.0.1:8000/apis/update/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Profile updated:', result.message);
        setIsEditing(false); // Exit edit mode after successful update
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
              <label className="text-gray-700 font-medium">Phone Number:</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'cursor-not-allowed' : ''}`}
              />
            </div>
            <div className="form-group">
              <label className="text-gray-700 font-medium">Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'cursor-not-allowed' : ''}`}
              />
            </div>
          </div>

          {userData.profile.role === 'doctor' && (
            <div>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Doctor Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="form-group">
                  <label className="text-gray-700 font-medium">Specialty:</label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'cursor-not-allowed' : ''}`}
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
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'cursor-not-allowed' : ''}`}
                  />
                </div>
                <div className="form-group">
                  <label className="text-gray-700 font-medium">Patient Age:</label>
                  <input
                    name="age"
                    value={formData.age || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 ml-4 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default UserProfile;
