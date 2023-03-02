import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!getToken(),
  user: null,
  status: false,
  error: null,
};

const API_URL = process.env.REACT_APP_API_URL;

function getToken() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.token) {
    return null;
  }

  // Send for check to see if token is expired
  return user.token;
}

export const checkAuth = createAsyncThunk("/check-auth", async () => {
  const token = getToken();

  if (!token) {
    throw new Error("Invalid Token");
  }

  const response = await fetch(`${API_URL}/check-auth`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    localStorage.removeItem("user");
    throw new Error("Invalid Token");
  }

  const data = await response.json();
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = action.payload.isAutheticated;
      state.user = action.payload.user;
    },
    resetUser: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});
export const { setUser, resetUser } = authSlice.actions;
export default authSlice.reducer;
