import { configureStore } from "@reduxjs/toolkit";
import employeesReducer from "./employees/employees-slice";
import authReducer from "./auth/auth-slice";
// import checkAuthReducer from "./auth/checkAuth-slice";
import registerReducer from "./auth/register-slice";
import loginReducer from "./auth/login-slice";
import logoutReducer from "./auth/logout-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer,
    login: loginReducer,
    logout: logoutReducer,
    employees: employeesReducer,
  },
});

export default store;
