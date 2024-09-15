import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous login action to get token
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { rejectWithValue }) => {
    try {
      // First, authenticate the user with email, password, and role
      const loginResponse = await fetch('http://127.0.0.1:8000/apis/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role, // Assuming role is part of the form data
        }),
      });

      const loginData = await loginResponse.json();

      // If login response is not OK, reject with the error message
      if (!loginResponse.ok) {
        const errorMessage = loginData?.detail || 'Login failed: Invalid credentials or role';
        return rejectWithValue(errorMessage);
      }

      // If the login is successful, fetch the token from /token/ endpoint
      const tokenResponse = await fetch('http://127.0.0.1:8000/apis/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email, // Use email as username for token generation
          password: formData.password,
        }),
      });

      const tokenData = await tokenResponse.json();

      // If token response is not OK, reject with the error message
      if (!tokenResponse.ok) {
        const errorMessage = tokenData?.detail || 'Token fetch failed: Invalid credentials';
        return rejectWithValue(errorMessage);
      }

      // Return the token data if successful (access and refresh tokens)
      return { access: tokenData.access, refresh: tokenData.refresh };

    } catch (error) {
      // If there is a network or other error, reject the promise
      return rejectWithValue('Network error. Please try again later.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    loginSuccess: (state, action) => {
      state.token = action.payload.token; // Adjust according to the token structure
      state.isAuthenticated = true;
      state.error = null;
      
    },
    loginFailure: (state, action) => {
      state.error = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('token', action.payload.access);
        localStorage.setItem('refreshToken', action.payload.refresh);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = typeof action.payload === 'string' ? action.payload : 'Login failed';
        state.isAuthenticated = false;
      });
  },
});

export const { logout, loginSuccess, loginFailure } = authSlice.actions;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
