import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import classes from "./index.module.css";
import { login, resetStatusAndError } from "state/auth/login-slice";


const Login = ({prevLocation}) => {
  const [userData, setUserData] = useState({email:"",password:""})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const {isAuthenticated,user} = useSelector((state) => state.auth)
  const {status,error} = useSelector((state) => state.login)

  const isLoading = status === 'loading'
  const hasError = status === 'failed'

  const {email, password} = userData

  useEffect(() => {
    return () => {
      dispatch(resetStatusAndError())
    }
  }, [dispatch,location])

  const inputChangeHandler = (e) => {
    setUserData({...userData, [e.target.name]:e.target.value})
  }

  const loginSubmitHandler = async (e) => {
    e.preventDefault()
    const res = await dispatch(login(userData))
    
    if (!res.error) {
      if (prevLocation){
        navigate(prevLocation)
      } else {
        navigate("/")
      }
    }
  }
  
  return (
    <>
      <form action="" onSubmit={loginSubmitHandler}>
        <div className={classes["login-container"]}>
          <label htmlFor="email">
            Username
          </label>
          <input type="text" id="email" name="email" value={email} onChange={inputChangeHandler} required/>
        </div>
        <div className={classes["login-container"]}>
          <label htmlFor="password">
            Password
          </label>
          <input type="text" id="password" name="password" value={password} onChange={inputChangeHandler} required/>
        </div>
        <button type="submit" disabled={isLoading || isAuthenticated}>Login!</button>
        {hasError && <div>{error}</div>}
        {isAuthenticated && <div>Hello {user.firstName} {user.lastName} you are already Signed in <Link to="/logout">Logout</Link></div>}
      </form>
      
      <Link to="/signup">Create New User?</Link>
      </>
  );
};

export default Login;
