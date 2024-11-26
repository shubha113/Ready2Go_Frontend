import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Truck, Check, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getSubmittedFares, acceptFareOffer } from '../../Redux/actions/jobAction';
import './Fare.css';
import Loader from '../Loader/Loader';

const Fare = () => {
  const dispatch = useDispatch();
  const { jobId } = useParams();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedFare, setSelectedFare] = useState(null);
  const { submittedFares, jobDetails, loading, error, message } = useSelector((state) => state.job);

  useEffect(() => {
    if (jobId && !isInitialized) {
      dispatch(getSubmittedFares(jobId));
      setIsInitialized(true);
    }
  }, [dispatch, jobId, isInitialized]);

  const handleAcceptFare = (driverId, fareAmount, fareId) => {
    
    setSelectedFare({
      driverId,
      fareAmount,
      fareId
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAcceptance = async () => {
    if (selectedFare) {
      await dispatch(acceptFareOffer(
        jobId,
        selectedFare.driverId,
        selectedFare.fareId
      ));
      setShowConfirmModal(false);
    }
  };

  if (loading) {
    return <div className="fares-container"><Loader/></div>;
  }

  if (error) {
    return (
      <div className="fares-container">
        <div className="error-message">
          <X className="error-icon" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!submittedFares || submittedFares.length === 0) {
    return (
      <div className="fares-container">
        <div className="no-fares-container">
          <Truck size={64} />
          <h3>No Fares Available</h3>
          <p>No drivers have submitted fares for this job yet. Please check back later.</p>
        </div>
      </div>
    );
  }

  const groupedFares = submittedFares.reduce((acc, submission) => {
    if (submission.driver && submission.driver.name) {
      if (!acc[submission.driver.id]) {
        acc[submission.driver.id] = {
          driverInfo: submission.driver,
          fares: [{
            amount: submission.fare,
            status: submission.status,
            timestamp: submission.timestamp,
            fareId: submission.fareId
          }]
        };
      } else {
        acc[submission.driver.id].fares.push({
          amount: submission.fare,
          status: submission.status,
          timestamp: submission.timestamp,
          fareId: submission.fareId
        });
      }
    }
    return acc;
  }, {});

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="fares-container">
      {message && (
        <div className="success-message">
          <Check className="success-icon" />
          <p>{message}</p>
        </div>
      )}

      {jobDetails && (
        <div className="job-details-card">
          <h2>Job Details</h2>
          <div className="job-details-grid">
            <div>
              <h3>Pickup Location</h3>
              <p>{jobDetails.pickupLocation.text}</p>
            </div>
            <div>
              <h3>Drop Location</h3>
              <p>{jobDetails.dropLocation.text}</p>
            </div>
            <div>
              <h3>Items</h3>
              <p>{jobDetails.items.join(', ')}</p>
            </div>
            <div>
              <h3>Weight</h3>
              <p>{jobDetails.weight} kg</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="main-title">Driver Fare Submissions</h2>
      <div className="fares-grid">
        {Object.entries(groupedFares).map(([driverId, data]) => (
          <div key={driverId} className="driver-card">
            <div className="card-header">
              <h3 className="driver-name">{data.driverInfo.name}</h3>
              <div className="vehicle-type">
                <Truck size={20} />
                <span>{data.driverInfo.vehicleDetails.type}</span>
              </div>
            </div>

            {data.driverInfo.distance !== null && (
              <div className="location">
                <MapPin size={16} />
                <span>{data.driverInfo.distance} km away</span>
              </div>
            )}

            <div className="section">
              <h4 className="section-title">Verification Status</h4>
              <div className="verification-grid">
                <div className="verification-item">
                  <span>{data.driverInfo.overallVerificationStatus}</span>
                </div>
              </div>
            </div>

            <div className="section">
              <h4 className="section-title">Vehicle Photos</h4>
              <div className="photo-grid">
                {data.driverInfo.vehiclePhotos.map((photo, index) => (
                  <a 
                    key={index}
                    href={photo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="photo-link"
                  >
                    Photo {index + 1}
                  </a>
                ))}
              </div>
            </div>

            <div className="section">
              <h4 className="section-title">Submitted Fares</h4>
              <div className="fares-section">
                {data.fares.map((fare, index) => (
                  <div key={fare.fareId} className="fare-item">
                    <div>
                      <div>Fare {index + 1}</div>
                      <div className="fare-timestamp">
                        {formatDate(fare.timestamp)}
                      </div>
                      <div className="fare-status">
                        Status: {fare.status}
                      </div>
                    </div>
                    <div className="fare-actions">
                      <span className="fare-amount">
                        ₹{fare.amount.toLocaleString()}
                      </span>
                      {fare.status === 'pending' && (
                        <button
                          onClick={() => handleAcceptFare(driverId, fare.amount, fare.fareId)}
                          className="accept-button"
                        >
                          Accept & Pay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Fare Acceptance</h2>
            <p>
              You are about to accept a fare offer of ₹{selectedFare?.fareAmount.toLocaleString()}. 
              This amount will be blocked from your account.
            </p>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-button"
                onClick={handleConfirmAcceptance}
              >
                Confirm & Pay ₹{selectedFare?.fareAmount.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fare;