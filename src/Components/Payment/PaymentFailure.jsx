import React from 'react';
import { X, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PaymentFailure.css';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-failure-container">
      <div className="failure-card">
        <div className="failure-icon-wrapper">
          <X size={64} className="failure-icon" />
        </div>
        <h1 className="failure-title">Payment Failed</h1>
        <div className="failure-details">
          <p className="failure-message">
            Oops! Something went wrong with your payment. 
            Please don't worry, no amount has been deducted.
          </p>
          
          <div className="failure-reasons">
            <h3>Possible Reasons:</h3>
            <ul>
              <li>Insufficient funds</li>
              <li>Network error</li>
              <li>Bank transaction declined</li>
              <li>Payment gateway issue</li>
            </ul>
          </div>
        </div>
        
        <div className="failure-actions">
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={20} />
            <span>Retry Payment</span>
          </button>
          <button 
            className="home-button"
            onClick={() => navigate('/')}
          >
            <Home size={20} />
            <span>Go to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;