import { useState, useEffect } from "react";
import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "scenes/layout";
import Login from "scenes/login";
import Logout from "scenes/logout";
import Dashboard from "scenes/dashboard";
import Secret from "scenes/secret";
import Home from "scenes/home";
import MoreSecrets from "scenes/secret/moresecrets";
import NewUser from "scenes/register";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "state/auth/auth-slice";

function App() {
  const [prevLocation, setPrevLocation] = useState(null);
  const location = useLocation();

  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
    if (
      !isAuthenticated &&
      location.pathname !== "/login" &&
      location.pathname !== "/logout" &&
      location.pathname !== "/signup"
    ) {
      setPrevLocation(location.pathname);
    }
  }, [isAuthenticated, location.pathname, dispatch]);

  return (
    <div className="app">
      <Routes>
        <Route element={<Layout />}>
          <Route path="*" element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="signup" element={<NewUser />} />
          <Route path="login" element={<Login prevLocation={prevLocation} />} />
          <Route path="logout" element={<Logout />} />
          <Route
            path="dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="secret"
            element={isAuthenticated ? <Secret /> : <Navigate to="/login" />}
          >
            <Route path="moresecrets" element={<MoreSecrets />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
