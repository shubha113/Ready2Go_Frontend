import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { forgotPassword, verifyOtp } from "../../Redux/actions/userAction";
import Loader from "../Loader/Loader.jsx";
import "./Login.css";
import CarouselImage1 from "../../Assets/Delivery.jpg";
import CarouselImage2 from "../../Assets/Delivery2.jpg";
import CarouselImage3 from "../../Assets/Delivery9.jpg";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, message, error } = useSelector((state) => state.user);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const carouselImages = [CarouselImage1, CarouselImage2, CarouselImage3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Carousel effect for images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Handle messages and errors
  useEffect(() => {
    if (message === "OTP sent successfully. Please verify to reset your password.") {
      toast.success(message);
      dispatch({ type: "clearMessage" });
      setOtpSent(true);  // Set otpSent to true when OTP is sent successfully
    } else if (message === "Phone number verified successfully.") {
      toast.success(message);
      dispatch({ type: "clearMessage" });
      navigate("/reset-password");
    }

    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
  }, [message, error, dispatch, navigate]);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleRequestOtp = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ phoneNumber }));
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ phoneNumber, otp }));
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="content-container">
        <div className="login-container">
          <h2>Forgot Password</h2>
          <p className="subtitle">Please enter your phone number to receive an OTP.</p>

          {/* Show the request OTP form only if OTP hasn't been sent */}
          {!otpSent && (
            <form onSubmit={handleRequestOtp}>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter Phone Number"
                required
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
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
                {loading ? <Loader size={5} /> : "Request OTP"}
              </button>
            </form>
          )}

          {/* Show the OTP verification form only after OTP has been sent */}
          {otpSent && (
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                required
                value={otp}
                onChange={handleOtpChange}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "40px",
                  marginTop: "10px",
                }}
              >
                {loading ? <Loader size={5} /> : "Verify OTP"}
              </button>
            </form>
          )}
        </div>

        {/* Carousel section */}
        <div className="carousel-container">
          <img
            src={carouselImages[currentImageIndex]}
            className="carousel-image"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
