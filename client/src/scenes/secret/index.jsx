import React from 'react'
import { Link, Outlet } from 'react-router-dom';

const Secret = () => {
  return (
    <div>
      Shhh this screen is a secret
      <Link to="/secret"> Hide more secrets?</Link>
      <Link to="/secret/moresecrets"> See more secrets?</Link>
      <Outlet/>
    </div>
  )
}

export default Secret