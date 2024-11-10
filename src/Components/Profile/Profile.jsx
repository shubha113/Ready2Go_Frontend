import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../Auth/Shared/Navbar';
import './Profile.css';
import profileImage from '../../Assets/Delivery.jpg';

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const {
    walletBalance,
    name,
    email,
    phoneNumber,
    role,
    ratings,
    documents,
    overallVerificationStatus,
    vehicleDetails,
    createdAt,
    updatedAt,
    verificationStatus,
    verificationTimestamp,
    location,
    companyDetails
  } = user;

  const formatDocumentList = (documentArray) => {
    if (!Array.isArray(documentArray) || documentArray.length === 0) {
      return <span>No document uploaded</span>;
    }
  
    return (
      <ul>
        {documentArray.map((doc, index) => (
          <li key={index}>
            <a href={doc} target="_blank" rel="noopener noreferrer">
              View Document
            </a>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <Navbar /> {/* Navbar inside the card */}
        <div className="profile-sidebar">
          <img src={profileImage} alt="Profile Background" className="profile-image" />
          <h2 className="profile-name">{name}</h2>
          <p className="profile-role">{role === 'user' ? 'User' : role.charAt(0).toUpperCase() + role.slice(1)}</p>
        </div>
        <div className="profile-info">
          <h3>Basic Information</h3>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Phone Number:</strong> {phoneNumber || 'Not provided'}</p>
          <button className="history-button">History</button>
          
          {role === 'user' && (
            <p><strong>Wallet Balance:</strong> ${walletBalance}</p>
          )}

          {role === 'driver' && (
            <>
              <h3>Driver Details</h3>
              <p><strong>Ratings:</strong> {ratings && ratings.length > 0 ? ratings.join(', ') : 'No ratings available'}</p>
              
              <div>
                <strong>Driver License:</strong> {formatDocumentList(documents?.driverLicense || [])}
              </div>
              <div>
                <strong>Vehicle Registration:</strong> {formatDocumentList(documents?.vehicleRegistration || [])}
              </div>
              <div>
                <strong>Vehicle Insurance:</strong> {formatDocumentList(documents?.vehicleInsurance || [])}
              </div>
              <div>
                <strong>Identity Proof:</strong> {formatDocumentList(documents?.identityProof || [])}
              </div>
              <p><strong>Overall Verification Status:</strong> {overallVerificationStatus}</p>
              <h4>Vehicle Details</h4>
              <p><strong>Type:</strong> {vehicleDetails?.vehicleType || 'Not provided'}</p>
              <p><strong>Load Capacity:</strong> {vehicleDetails?.loadCapacity || 'Not provided'}</p>
              <p><strong>Availability:</strong> {vehicleDetails?.availability ? 'Available' : 'Not Available'}</p>
              {vehicleDetails?.vehiclePhoto && <img src={vehicleDetails.vehiclePhoto} alt="Vehicle" className="vehicle-photo" />}
              <p><strong>Account Created:</strong> {new Date(createdAt).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(updatedAt).toLocaleDateString()}</p>
              <p><strong>Verification Status:</strong> {verificationStatus}</p>
              <p><strong>Verification Timestamp:</strong> {new Date(verificationTimestamp).toLocaleString()}</p>
            </>
          )}

          {role === 'company' && (
            <>
              <h3>Company Details</h3>
              <div>
                <strong>Company Registration:</strong> {formatDocumentList(documents?.companyRegistration || [])}
              </div>
              <div>
                <strong>GST Certificate:</strong> {formatDocumentList(documents?.gstCertificate || [])}
              </div>
              <p><strong>Overall Verification Status:</strong> {overallVerificationStatus}</p>
              <p><strong>Verification Status:</strong> {verificationStatus}</p>
              <p><strong>Verification Timestamp:</strong> {new Date(verificationTimestamp).toLocaleString()}</p>
              <h4>Company Information</h4>
              <p><strong>Company Name:</strong> {companyDetails?.companyName || 'Not provided'}</p>
              <p><strong>Account Created:</strong> {new Date(createdAt).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(updatedAt).toLocaleDateString()}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
