import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Navbar.css';
import { logout } from '../../../Redux/actions/userAction';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, message, error } = useSelector(state => state.user);

  useEffect(() => {
    if (message) {
      navigate('/login')
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

  return (
    <header className="header">
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          
          {user?.role === 'user' && (
            <>
              <li><Link to="/create-order">Create Order</Link></li>
              <li><Link to="/track-order">Track Order</Link></li>
            </>
          )}
          {(user?.role === 'driver' || user?.role === 'company') && (
            <li><Link to="/take-delivery">Take Delivery</Link></li>
          )}

          {isAuthenticated ? (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/history">History</Link></li>
              <li onClick={handleLogout}><Link>Logout</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
