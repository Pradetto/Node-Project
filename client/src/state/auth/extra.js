import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  status: false,
  error: null,
};

const API_URL = process.env.REACT_APP_API_URL;

export const register = createAsyncThunk(
  "/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const login = createAsyncThunk(
  "/login",
  async (userData, { rejectWithValue }) => {
    console.log(userData);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk(
  "/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Logout failed");
      }
      localStorage.removeItem("user");
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // be careful of the behavior below if they sign up do I want to make them sign in again or automatically be signed in
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
