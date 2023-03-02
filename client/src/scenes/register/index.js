import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
// import classes from "./index.module.css";
import { register, resetStatusAndError } from "state/auth/register-slice";

const NewUser = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.register);

  const isLoading = status === "loading";
  const hasError = status === "failed";
  const hasWorked = status === "succeeded";

  const { firstName, lastName, email, password, confirmPassword } = userData;

  useEffect(() => {
    return () => {
      dispatch(resetStatusAndError());
    };
  }, [dispatch, location]);

  const inputChangeHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const registerSubmitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      await dispatch(register(userData));
    }
  };

  return (
    <form onSubmit={registerSubmitHandler}>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={inputChangeHandler}
          required
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={inputChangeHandler}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={inputChangeHandler}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={inputChangeHandler}
          required
          autoComplete="new-password"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={inputChangeHandler}
          required
          autoComplete="new-password"
        />
      </div>
      <button type="submit" disabled={isLoading}>
        Register
      </button>
      {hasError && <div>{error}</div>}
      {hasWorked && <div>Yay you successfuly registered</div>}
    </form>
  );
};

export default NewUser;
