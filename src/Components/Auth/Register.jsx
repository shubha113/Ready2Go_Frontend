import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import CarouselImage1 from "../../Assets/Delivery.jpg";
import CarouselImage2 from "../../Assets/Delivery2.jpg";
import CarouselImage3 from "../../Assets/Delivery9.jpg";
import Loader from "../Loader/Loader.jsx";
import { register } from "../../Redux/actions/userAction.js";
import "./Register.css";
import Navbar from "./Shared/Navbar.jsx";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { loading, message, error } = useSelector((state) => state.user);

  const initialFormData = {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const carouselImages = [CarouselImage1, CarouselImage2, CarouselImage3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselImages.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }
  
    // Dispatch registration action
    dispatch(register(formData));
  };
  
  // Monitor message state to check for successful registration
  useEffect(() => {
    if (message) {
      toast.success(message);
      setFormData(initialFormData);
      dispatch({ type: "clearMessage" });
      localStorage.setItem("isRegistered", "true"); // Set flag in local storage
      navigate('/verify-otp'); // Navigate to OTP page
    }
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
  }, [message, error, dispatch, navigate]);
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "phoneNumber" ? value.replace(/\s+/g, "") : value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  return (
      <div className="signup-page">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <div className="content-container">
          <div className="signup-container">
            <h2>Register</h2>
            <p className="subtitle">Hello! Let’s join with us</p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                required
                value={formData.phoneNumber}
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
              <div className="role-selection">
                <span>Role</span>
                <div className="role-buttons">
                  <button
                    type="button"
                    className={`role-button ${formData.role === "user" ? "selected" : ""}`}
                    onClick={() => handleRoleChange("user")}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    className={`role-button ${formData.role === "driver" ? "selected" : ""}`}
                    onClick={() => handleRoleChange("driver")}
                  >
                    Driver
                  </button>
                </div>
              </div>
              <label className="privacy-policy">
                <input type="checkbox" required /> I agree with the privacy policy
              </label>
              <button
                type="submit"
                disabled={loading}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40px" }}
              >
                {loading ? <Loader size={5} /> : "Register"}
              </button>
            </form>
            <p className="login-link">
              Already have an account? <Link className="login-link-text" to="/login">Login</Link>
            </p>
          </div>
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

export default Register;
