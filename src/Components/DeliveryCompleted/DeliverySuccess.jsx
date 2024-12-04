import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DeliverySuccess.css';
import Confetti from 'react-confetti';

const DeliverySuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isConfettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    setConfettiActive(true);

    const confettiTimer = setTimeout(() => {
      setConfettiActive(false);
    }, 5000);

    return () => clearTimeout(confettiTimer);
  }, []);

  const handleBackToDashboard = () => {
    navigate('/profile');
  };

  return (
    <div className="delivery-completion-container">
      {isConfettiActive && <Confetti />}
      <div className="completion-card">
        <h1>Delivery Completed Successfully!</h1>

        <div className="payout-details">
          <p><strong style={{fontSize: "20px"}}>Amount Released</strong></p>
          <p>Wallet Updated Successfully</p>
          <p className="success-message">Amount Sent To Your Bank Account</p>
        </div>

        <button
          className="back-to-dashboard-btn"
          onClick={handleBackToDashboard}
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default DeliverySuccess;
