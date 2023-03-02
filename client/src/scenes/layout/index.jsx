import React from "react";
import classes from "./index.module.css";
import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  return (
  <div className={classes["layout-main"]}>
    <div className={classes.navbar}>
      <NavLink to="home" className={({ isActive }) => (isActive ? classes.active : classes.inactive)}>Home</NavLink>
      <NavLink to="dashboard" className={({ isActive }) => (isActive ? classes.active : classes.inactive)}>Dashboard</NavLink>
      <NavLink to="secret" className={({ isActive }) => (isActive ? classes.active : classes.inactive)}>Secrets</NavLink>
      <NavLink to="login" className={({ isActive }) => (isActive ? classes.active : classes.inactive)}>Login</NavLink>
      <NavLink to="signup" className={({ isActive }) => (isActive ? classes.active : classes.inactive)}>New User</NavLink>
      <NavLink to="logout" className={({ isActive }) =>(isActive ? classes.active : classes.inactive)}>Logout</NavLink>
    </div>
    <Outlet/>
  </div>
    );
};

export default Layout;
