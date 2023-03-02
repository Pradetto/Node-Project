import React, { useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { fetchEmployees } from 'state/employees/employees-slice'
import classes from './index.module.css'

const Dashboard = () => {
  const dispatch = useDispatch()
  const employees = useSelector((state) => state.employees.employees)
  const status = useSelector((state) => state.employees.status)
  const error = useSelector((state) => state.employees.error)

  useEffect(() => {
    dispatch(fetchEmployees())
  },[dispatch])
  
  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'failed') {
    return <div>Error...: {error}</div>
  }

  if (status === 'succeeded') {
    if (employees.length === 0) {
      return <div>No employees to display</div>;
    } else {
      return (
        <div className={classes.container}>
          {employees.map((e) => <div key={e.id}>{e.id}</div>)}
        </div>
      );
    }
  }
}

export default Dashboard