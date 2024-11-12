import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import CarouselImage1 from '../../Assets/Delivery.jpg';
import CarouselImage2 from '../../Assets/Delivery2.jpg';
import CarouselImage3 from '../../Assets/Delivery9.jpg';
import Loader from '../Loader/Loader.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../Redux/actions/userAction.js';
import { getFCMToken, messaging } from '../../utils/firebase';
import { onMessage } from 'firebase/messaging';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, message, error } = useSelector(state => state.user);

  const initialFormData = {
    email: '',
    password: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [fcmToken, setFcmToken] = useState(null);  // State to store FCM token

  const carouselImages = [CarouselImage1, CarouselImage2, CarouselImage3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Fetch FCM token when the component mounts
  useEffect(() => {
    const fetchFcmToken = async () => {
      const token = await getFCMToken();
      setFcmToken(token);
    };
    onMessage(messaging, (payload)=>{
      console.log(payload)
    })
    
    fetchFcmToken();
  }, []);

  useEffect(() => {
    if (message) {
      toast.success(message);
      setFormData(initialFormData);
      dispatch({ type: "clearMessage" });
      navigate('/')
    }
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
  }, [message, error, dispatch]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Include the fcmToken in the login request payload
    const loginData = {
      ...formData,
      fcmToken: fcmToken,  // Add fcmToken here
    };

    dispatch(login(loginData));  // Pass the updated loginData including the fcmToken
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="content-container">
        <div className="login-container">
          <h2>Login</h2>
          <p className="subtitle">Welcome back! Please login to your account.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <p className="register-link">
              <Link className='login-link-text' to="/forgot-password">Forgot Password?</Link>
            </p>
            <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}>
              {loading ? <Loader size={5} /> : "Login"}
            </button>
          </form>
          <p className="register-link">
            Don't have an account? <Link className='login-link-text' to="/register">Register</Link>
          </p>
        </div>

        {/* Carousel section */}
        <div className="carousel-container">
          <img
            src={carouselImages[currentImageIndex]}
            alt={`Carousel Slide ${currentImageIndex + 1}`}
            className="carousel-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
