import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import CarouselImage1 from "../../Assets/Delivery.jpg";
import CarouselImage2 from "../../Assets/Delivery2.jpg";
import CarouselImage3 from "../../Assets/Delivery9.jpg";
import Loader from "../Loader/Loader.jsx";
import { Link, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../Redux/actions/userAction.js";

const OTP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, message, error } = useSelector((state) => state.user);

  const initialFormData = {
    phoneNumber: Number(localStorage.getItem("phoneNumber")) || "",
    otp: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const carouselImages = [CarouselImage1, CarouselImage2, CarouselImage3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Carousel effect for images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselImages.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Countdown timer for enabling Resend OTP button
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(countdown);
  }, [timer]);


  useEffect(() => {
    if (message === "Phone number verified successfully.") {  // Only navigate on verification success
      toast.success(message);
      setFormData(initialFormData);
      dispatch({ type: "clearMessage" });
      navigate('/login');
    } else if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
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
      [name]: value,
    });
  };

  // Handle OTP form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyOtp(formData)); 
  };

  // Handle Resend OTP button click
  const handleResendOtp = () => {
    setTimer(60); 
    setIsResendDisabled(true); 
    dispatch(resendOtp(formData));
  };

  return (
    <div className="login-page">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <div className="content-container">
        <div className="login-container">
          <h2>Verify OTP</h2>
          <p className="subtitle">
            Please enter the OTP sent to your phone number.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              required
              value={formData.otp}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              readOnly 
            />
            {/* Timer and Resend OTP button */}
            <div className="otp-timer">
              <span>{`Time remaining: ${timer}s`}</span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResendDisabled}
                className={`resend-button ${
                  isResendDisabled ? "disabled" : ""
                }`}
              >
                Resend OTP
              </button>
            </div>
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
              {loading ? <Loader size={5} /> : "Verify OTP"}
            </button>
          </form>
          <p className="register-link">
            Want to change phone number?{" "}
            <Link className="register-link-text" to="/register">
              Register
            </Link>
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

export default OTP;
