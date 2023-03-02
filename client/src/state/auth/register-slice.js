import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setUser } from "./auth-slice";

const initialState = {
  status: false,
  error: null,
};

const API_URL = process.env.REACT_APP_API_URL;

export const register = createAsyncThunk(
  "/register",
  async (userData, { rejectWithValue, dispatch }) => {
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
      dispatch(setUser({ isAutheticated: true, user: data.user }));
      return data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetStatusAndError: (state) => {
      state.status = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { resetStatusAndError } = registerSlice.actions;
export default registerSlice.reducer;
