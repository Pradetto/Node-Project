import React from 'react'
import { useSelector } from 'react-redux';

const Home = () => {
  const {user} = useSelector(state => state.auth)
  return (
    <>
    <div>You are at the home page</div>
    {user &&
    <>
    <div>{user.firstName}</div>
    <div>{user.lastName}</div>
    <div>{user.email}</div>
    <div>{user.role}</div>
    </>
    }
    </>
  )
}

export default Home