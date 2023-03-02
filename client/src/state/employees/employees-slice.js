import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = { employees: [], status: "idle", error: null };

const API_URL = process.env.REACT_APP_API_URL;

export const fetchEmployees = createAsyncThunk(
  "/api/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.token) {
        throw new Error("Need to login before accessing this page");
      }
      const token = user.token;
      const res = await fetch(`${API_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      return data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;
