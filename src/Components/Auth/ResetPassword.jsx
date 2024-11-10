import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../Redux/actions/userAction"; // Correct action import
import Loader from "../Loader/Loader.jsx";
import "./Login.css";
import CarouselImage1 from "../../Assets/Delivery.jpg";
import CarouselImage2 from "../../Assets/Delivery2.jpg";
import CarouselImage3 from "../../Assets/Delivery9.jpg";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, message, error } = useSelector((state) => state.user);

  // Initialize state for phone number and password
  const initialPhoneNumber = localStorage.getItem("phoneNumber") || "";
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);


  const carouselImages = [CarouselImage1, CarouselImage2, CarouselImage3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Carousel effect for images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  useEffect(() => {
    if (message === "Password reset successfully. You can now log in with your new password.") {
      toast.success(message);
      dispatch({ type: "clearMessage" });
      navigate("/login");
    }

    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
  }, [message, error, dispatch, navigate]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ password, phoneNumber }));
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="content-container">
        <div className="login-container">
          <h2>Reset Password</h2>
          <p className="subtitle">Enter your phone number and new password.</p>
          <form onSubmit={handleResetPassword}>
            <input
              type="tel" 
              name="phoneNumber"
              placeholder="Enter Your Phone Number"
              required
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              readOnly
            />
            <input
              type="password" 
              name="password"
              placeholder="Enter New Password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "40px",
              }}
            >
              {loading ? <Loader size={5} /> : "Change Password"}
            </button>
          </form>
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

export default ResetPassword;
