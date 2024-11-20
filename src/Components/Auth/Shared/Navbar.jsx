import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Navbar.css";
import { logout } from "../../../Redux/actions/userAction";
import { toast } from "react-toastify";
import Logo from "../../../Assets/logo.png";

const Navbar = () => {
  const [isMenuActive, setMenuActive] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, message, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (message) {
      navigate("/login");
      toast.success(message);
      dispatch({ type: "clearMessage" });
    }
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
  }, [message, error, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuActive(!isMenuActive);
  };

  return (
    <header className="header">
      <nav>
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Ready2Go" />
          </Link>
        </div>
        <ul className={`nav-links ${isMenuActive ? "active" : ""}`}>
          <li>
             <div className="button-logout">
                  <Link  to="/" className="button-link">Home</Link>
                </div>
         
          </li>

          {user?.role === "user" && (
            <>
              <li>
                <div className="button-logout">
                  <Link  to="/create-order" className="button-link">Create Order</Link>
                </div>
              </li>
              
              <li>
                <div className="button-logout">
                  <Link  to="/track-order" className="button-link">Track Order</Link>
                </div>
                
              </li>
            </>
          )}
          {(user?.role === "driver" || user?.role === "company") && (
            <li>
            
               <div className="button-logout">
                  <Link  to="/jobs" className="button-link">Take Delivery</Link>
                </div>
            </li>
          )}

          {isAuthenticated ? (
            <>
              <li>
                  <div className="button-logout">
                  <Link  to="/profile" className="button-link">Profile</Link>
                </div>
          
              </li>
              <li>
                 <div className="button-logout">
                  <Link  to="/history" className="button-link">History</Link>
                </div>
              </li>
              <li onClick={handleLogout}>
                <div className="button-logout">
                  <Link className="button-link">Logout</Link>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
             
                    <div className="button-logout">
                  <Link  to="/register" className="button-link">Register</Link>
                </div>
              </li>

              <li onClick={handleLogin}>
                <div className="button-login">
                  <Link className="button-link">Login</Link>
                </div>
              </li>
            </>
          )}
        </ul>
        <div
          className={`hamburger ${isMenuActive ? "hamburger-active" : ""}`}
          onClick={toggleMenu}
        >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
