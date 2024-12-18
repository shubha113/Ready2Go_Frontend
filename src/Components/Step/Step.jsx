import React, { useState } from 'react';
import './Step.css';

const Step= () => {
  const [activeStep, setActiveStep] = useState(null);

  // Define steps with their respective descriptions
  const steps = [
    { 
      number: 1, 
      title: "Account Creation",
      description: "Create your account and set up your personalized profile with detailed information." 
    },
    { 
      number: 2, 
      title: "Service Selection", 
      description: "Browse through our comprehensive range of services and select the ones that best match your needs." 
    },
    { 
      number: 3, 
      title: "Scheduling", 
      description: "Schedule your first appointment or consultation with our expert team, choosing a time that works best for you." 
    },
    { 
      number: 4, 
      title: "Support Initiation", 
      description: "Receive personalized support and guidance tailored to your specific requirements and goals." 
    },
    { 
      number: 5, 
      title: "Continuous Tracking", 
      description: "Track your progress, receive ongoing assistance, and make adjustments as needed." 
    }
  ];

  const handleStepClick = (stepNumber) => {
    setActiveStep(activeStep === stepNumber ? null : stepNumber);
  };

  return (
    <div className="step-guide-container">
      <div className="page-header">
        <h1>Your Journey with Our Platform</h1>
        <p>Discover how to make the most of our services step by step</p>
      </div>
      
      <div className="step-guide-wrapper">
        <div className="step-guide">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className={`step-item ${activeStep === step.number ? 'active' : ''}`}
            >
              <div className="step-content-wrapper">
                {activeStep === step.number && (
                  <div className={`step-popup ${step.number % 2 === 0 ? 'bottom' : 'top'}`}>
                    <div className="step-popup-content">
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </div>
                )}
                
                <div 
                  className="step-number-wrapper" 
                  onClick={() => handleStepClick(step.number)}
                  onMouseEnter={() => setActiveStep(step.number)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  <div className="step-number">{step.number}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step;