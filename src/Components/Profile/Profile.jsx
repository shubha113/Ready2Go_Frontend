import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Auth/Shared/Navbar';
import './Profile.css';
import profileImage from '../../Assets/profile2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { updateProfile } from '../../Redux/actions/userAction';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';

const Profile = () => {
  const { user, message, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editingField, setEditingField] = React.useState(null);
  const [fieldValue, setFieldValue] = React.useState('');

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
    verificationStatus,
    verificationTimestamp,
    location,
    companyDetails
  } = user;

  const handleEditClick = (field, initialValue) => {
    setEditingField(field);
    setFieldValue(initialValue);
  };

  const handleSaveClick = () => {
    const updatedData = { [editingField]: fieldValue };
    
    dispatch(updateProfile(updatedData)).then(() => {
      if (editingField === 'phoneNumber') {
        navigate('/verify-otp');
      }
      setEditingField(null);
    });
  };

  
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
    }
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
  }, [message, error, dispatch]);
  

  const formatDocumentList = (documentArray, field) => {
    if (!Array.isArray(documentArray) || documentArray.length === 0) {
      return <span>No document uploaded</span>;
    }
    return (
      <ul>
        {documentArray.map((doc, index) => (
          <li key={index}>
            <a href={doc} target="_blank" rel="noopener noreferrer" style={{ color: 'purple' }}>
              View Document
            </a>
            {editingField === field && (
              <input
                type="text"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
              />
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="navbar-container">
          <Navbar />
        </div>
        <div className="profile-content">
          <div className="profile-main-info">
            <p><strong className='strong'>Email:</strong> {email}</p>
            
            <p>
              <strong className='strong'>Phone Number:</strong> {phoneNumber || 'Not provided'}
              <FontAwesomeIcon className='icon' icon={faPen} onClick={() => handleEditClick('phoneNumber', phoneNumber)} />
            </p>
            {editingField === 'phoneNumber' && (
              <div>
                <input
                  type="text"
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                />
                <button onClick={handleSaveClick} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}>
                {loading ? <Loader size={5} /> : "Save"}
                </button>
              </div>
            )}

            {role === 'driver' && (
              <>
                <p><strong className='strong'>Ratings:</strong> {ratings?.length > 0 ? ratings.join(', ') : 'No ratings available'}</p>

                <div>
                  <strong className='strong'>Driver License:</strong> {formatDocumentList(documents?.driverLicense, 'driverLicense')}
                  <FontAwesomeIcon className='icon' icon={faPen} onClick={() => handleEditClick('driverLicense', '')} />
                </div>
                
                <div>
                  <strong className='strong'>Vehicle Registration:</strong> {formatDocumentList(documents?.vehicleRegistration, 'vehicleRegistration')}
                  <FontAwesomeIcon className='icon' icon={faPen} onClick={() => handleEditClick('vehicleRegistration', '')} />
                </div>

                <div>
                  <strong className='strong'>Vehicle Insurance:</strong> {formatDocumentList(documents?.vehicleInsurance, 'vehicleInsurance')}
                  <FontAwesomeIcon className='icon' icon={faPen} onClick={() => handleEditClick('vehicleInsurance', '')} />
                </div>

                <div>
                  <strong className='strong'>Identity Proof:</strong> {formatDocumentList(documents?.identityProof, 'identityProof')}
                  <FontAwesomeIcon className='icon' icon={faPen} onClick={() => handleEditClick('identityProof', '')} />
                </div>

                <p><strong className='strong'>Vehicle Type:</strong> {vehicleDetails?.vehicleType || 'Not provided'}
                  <FontAwesomeIcon className='icon' icon={faPen} onClick={() => handleEditClick('vehicleType', vehicleDetails?.vehicleType)} />
                </p>
                
                {editingField === 'vehicleType' && (
                  <div>
                    <input
                      type="text"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                    />
                    <button onClick={handleSaveClick} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}>
                {loading ? <Loader size={5} /> : "Save"}
                </button>
                  </div>
                )}

                <p><strong className='strong'>Load Capacity:</strong> {vehicleDetails?.loadCapacity || 'Not provided'}Kg
                  <FontAwesomeIcon className='icon' icon={faPen} onClick={() => handleEditClick('loadCapacity', vehicleDetails?.loadCapacity)} />
                </p>
                
                {editingField === 'loadCapacity' && (
                  <div>
                    <input
                      type="text"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                    />
                    <button onClick={handleSaveClick} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}>
                {loading ? <Loader size={5} /> : "Save"}
                </button>
                  </div>
                )}
              </>
            )}

            {role === 'company' && (
              <>
                <h3>Company Details</h3>
                <div>
                  <strong className='strong'>Company Registration:</strong> {formatDocumentList(documents?.companyRegistration, 'companyRegistration')}
                  <FontAwesomeIcon className='icon' icon={faPen} onClick={() => handleEditClick('companyRegistration', '')} />
                </div>

                <div>
                  <strong className='strong'>GST Certificate:</strong> {formatDocumentList(documents?.gstCertificate, 'gstCertificate')}
                  <FontAwesomeIcon className='icon' icon={faPen} onClick={() => handleEditClick('gstCertificate', '')} />
                </div>
              </>
              
            )}
          </div>
          <div className="profile-sidebar">
            <img src={profileImage} alt="Profile Background" className="profile-image" />
            <h2 className="profile-name">{name}</h2>
            <h4 className="profile-name1">Wallet Balance: {walletBalance}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
