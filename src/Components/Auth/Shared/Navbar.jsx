import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Navbar.css';
import { logout } from '../../../Redux/actions/userAction';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, message, error } = useSelector(state => state.user);


  useEffect(() => {
    if (message) { 
      toast.success(message);
      dispatch({ type: "clearMessage" });
      navigate('/login')
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
          <li><Link to="/categories">Create Order</Link></li>
          <li><Link to="/categories">Track Order</Link></li>
          <li><Link to="/categories">Take Delivery</Link></li>

          {isAuthenticated ? (
            <>
            
            <li> <Link to="/profile">Profile</Link> </li>
              <li onClick={handleLogout}> <Link>Logout</Link></li>
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
