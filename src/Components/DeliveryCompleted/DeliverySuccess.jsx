import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DeliverySuccess.css';

const DeliverySuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/profile');
  };

  return (
    <div className="delivery-completion-container">
      <div className="completion-card">
        <div className="success-icon">
          ✓
        </div>
        <h1>Delivery Completed Successfully!</h1>
        
        {payoutDetails && (
          <div className="payout-details">
            <h2>Payment Details</h2>
            <p><strong>Amount Released</strong></p>
            <p>Wallet Updated Successfully</p>
            <p className="success-message"> Amount Sent To Your Bank Account</p>
          </div>
        )}
        
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