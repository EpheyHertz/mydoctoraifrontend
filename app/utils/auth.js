// utils/auth.js
import { store } from '../store/index'; // Import your Redux store
import { selectIsAuthenticated } from '../store/authSlice'; // Import the selector
export const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token found.');
      }
  
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
        throw new Error('Failed to refresh token.');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Handle errors, maybe redirect to login page
      return null;
    }
  };

  export const isAuthenticated = () => {
    const state = store.getState(); // Get the current state
    return selectIsAuthenticated(state); // Use the selector to get isAuthenticated
  };
  