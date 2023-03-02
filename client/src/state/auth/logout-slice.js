import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resetUser } from "./auth-slice";

const initialState = {
  status: false,
  error: null,
};

const API_URL = process.env.REACT_APP_API_URL;

export const logout = createAsyncThunk(
  "/logout",
  async (_, { rejectWithValue, dispatch }) => {
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
      dispatch(resetUser());
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const logoutSlice = createSlice({
  name: "logout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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

export default logoutSlice.reducer;
