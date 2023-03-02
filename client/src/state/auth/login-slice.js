import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setUser } from "./auth-slice";

const initialState = {
  status: false,
  error: null,
};

const API_URL = process.env.REACT_APP_API_URL;

export const login = createAsyncThunk(
  "/login",
  async (userData, { rejectWithValue, dispatch }) => {
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
      dispatch(setUser({ isAutheticated: true, user: data.user }));
      return data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    resetStatusAndError: (state) => {
      state.error = null;
      state.status = false;
    },
  },
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
      });
  },
});

export const { resetStatusAndError } = loginSlice.actions;

export default loginSlice.reducer;
