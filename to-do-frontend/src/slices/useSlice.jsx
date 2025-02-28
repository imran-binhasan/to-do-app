import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch user data
export const fetchUser = createAsyncThunk("user/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("http://localhost:4000/api/auth/me", { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
  }
});

export const logoutUser = createAsyncThunk(
  "user/logoutUser", 
  async (_, { rejectWithValue }) => {
    try {
      // Make an API call to logout and clear cookies
      await axios.get("http://localhost:4000/api/auth/logout", { withCredentials: true });
      
      // If the backend is successful, return null or empty response
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to logout");
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null; // Clear user state after logout
      });
  }
  
});

// ✅ Export with correct name

export default userSlice.reducer;
