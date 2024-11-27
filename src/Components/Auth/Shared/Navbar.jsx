import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
          <NavLink to="/">
            <img src={Logo} alt="Ready2Go" />
          </NavLink>
        </div>
        <ul className={`nav-links ${isMenuActive ? "active" : ""}`}>
          <li>
            <div className="button-logout">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `button-link ${isActive ? 'active-route' : ''}`
                }
              >
                Home
              </NavLink>
            </div>
          </li>
          {user?.role === "user" && (
            <li>
              <div className="button-logout">
                <NavLink 
                  to="/create-order" 
                  className={({ isActive }) => 
                    `button-link ${isActive ? 'active-route' : ''}`
                  }
                >
                  Create Order
                </NavLink>
              </div>
            </li>
          )}
          {(user?.role === "driver" || user?.role === "company") && (
            <li>
              <div className="button-logout">
                <NavLink 
                  to="/jobs" 
                  className={({ isActive }) => 
                    `button-link ${isActive ? 'active-route' : ''}`
                  }
                >
                  Take Delivery
                </NavLink>
              </div>
            </li>
          )}
          {isAuthenticated ? (
            <>
              <li>
                <div className="button-logout">
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => 
                      `button-link ${isActive ? 'active-route' : ''}`
                    }
                  >
                    Profile
                  </NavLink>
                </div>
              </li>
              <li>
                <div className="button-logout">
                  <NavLink 
                    to="/history" 
                    className={({ isActive }) => 
                      `button-link ${isActive ? 'active-route' : ''}`
                    }
                  >
                    History
                  </NavLink>
                </div>
              </li>
              <li onClick={handleLogout}>
                <div className="button-logout">
                  <NavLink 
                    to="/logout" 
                    className={({ isActive }) => 
                      `button-link ${isActive ? 'active-route' : ''}`
                    }
                  >
                    Logout
                  </NavLink>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <div className="button-logout">
                  <NavLink 
                    to="/register" 
                    className={({ isActive }) => 
                      `button-link ${isActive ? 'active-route' : ''}`
                    }
                  >
                    Register
                  </NavLink>
                </div>
              </li>
              <li onClick={handleLogin}>
                <div className="button-login">
                  <NavLink 
                    to="/login" 
                    className={({ isActive }) => 
                      `button-link ${isActive ? 'active-route' : ''}`
                    }
                  >
                    Login
                  </NavLink>
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