import React, { useEffect, useState } from 'react';
import { Check, Home, Package, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PaymentSuccess.css'
import Confetti from 'react-confetti';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [isConfettiActive, setConfettiActive] = useState(false);

  
  useEffect(() => {
    setConfettiActive(true);
    
    const confettiTimer = setTimeout(() => {
      setConfettiActive(false);
    }, 5000);

    return () => clearTimeout(confettiTimer);
  }, []); 


  return (
    <div className="payment-success-container">
      
      {isConfettiActive && <Confetti />}
      <div className="success-card">
        <div className="success-icon-wrapper">
          <Check size={64} className="success-icon" />
        </div>
        <h1 className="success-title">Payment Successful!</h1>
        <div className="success-details">
          <p className="success-message">
            Your payment has been processed successfully. 
            Your shipment is now confirmed and driver is notified.
          </p>
          
          <div className="success-info-grid">
            <div className="info-item">
              <Package size={24} className="info-icon" />
              <div>
                <h3>Job Assigned</h3>
                <p>Soon the driver will be at the pickup location</p>
              </div>
            </div>
            <div className="info-item">
              <span className="material-symbols-outlined"><IndianRupee/></span>
              <div>
                <h3>Amount Blocked</h3>
                <p>Amount has been blocked for delivery</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="success-actions">
          <button 
            className="home-button"
            onClick={() => navigate('/')}
          >
            <Home size={20} />
            <span>Go to Home</span>
          </button>
          <button 
            className="track-button"
            onClick={() => navigate('/track-order')}
          >
            <Package size={20} />
            <span>Track Job</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;