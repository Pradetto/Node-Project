import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { logout } from "state/auth/auth-slice";
import { logout } from "state/auth/logout-slice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/", { replace: true });
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
