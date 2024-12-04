import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../Auth/Shared/Navbar";
import "./Profile.css";
import { Pencil, Check, X, Upload } from "lucide-react";
import { updateProfile } from "../../Redux/actions/userAction";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

const Profile = () => {
  const { user, message, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState({
    identityProof: [],
    addressProof: [],
    otherDocuments: [],
    driverLicense: [],
    vehicleInsurance: [],
    vehicleRegistration: [],
    vehiclePhoto: [],
  });
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: ''
  });

  const handleFileChange = (e, field) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to array
    setFiles((prevFiles) => {
      return {
        ...prevFiles,
        [field]: [...prevFiles[field], ...selectedFiles], // Add new files to the respective field
      };
    });
  };

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
    documents = {},
    vehicleDetails = {},
    verificationStatus = {},
  } = user;

  const vehicleTypes = [
    { label: "Motorcycle (up to 150 kg)", value: "motorcycle" },
    { label: "Small (up to 500 kg)", value: "small" },
    { label: "Medium (500 kg - 2,000 kg)", value: "medium" },
    { label: "Large (2,000 kg - 5,000 kg)", value: "large" },
    { label: "Extra-Large (5,000 kg - 10,000 kg)", value: "extra-large" },
    { label: "Heavy-Duty (10,000 kg and above)", value: "heavy-duty" },
  ];

  const handleEditClick = (field, initialValue) => {
    setEditingField(field);
    setFieldValue(initialValue || "");
    setFile(null);
  };

  const handleSaveClick = (field) => {
    // Handle Non-Document Fields (e.g., phoneNumber, vehicleType, etc.)
    if (editingField && fieldValue.trim()) {
      const updatedData = { [editingField]: fieldValue };
      dispatch(updateProfile(updatedData)); // Submit non-document data
      setEditingField(null);
      setFieldValue("");
      return;
    }

    // Handle Document Fields (e.g., identityProof, vehicleInsurance, etc.)
    if (field && files[field]?.length) {
      const updatedData = new FormData();
      files[field]?.forEach((file) => {
        updatedData.append(field, file);
      });

      dispatch(updateProfile(updatedData)).then(() => {
        setFiles((prevFiles) => ({
          ...prevFiles,
          [field]: [], // Clear the files after submission
        }));
      });
    }
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

  const formatDocumentList = (field, documentArray) => {
    const status = verificationStatus[field] || "pending";

    return (
      <div className="document-wrapper">
        {documentArray && documentArray.length > 0 ? (
          <ul className="documents-list">
            {documentArray.map((doc, index) => (
              <li key={index} className="document-item">
                <div className="document-info">
                  <a
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-link"
                  >
                    View Document
                  </a>
                  <span className={`verification-status ${status}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <span className="no-document">No document uploaded</span>
        )}
        <div className="document-upload">
          <label htmlFor={field} className="upload-label">
            <Upload size={16} /> Upload New
          </label>
          <input
            type="file"
            id={field}
            multiple // Allow multiple file uploads
            onChange={(e) => handleFileChange(e, field)} // Use the updated handler
            className="file-input"
          />
          {files[field]?.length > 0 && (
            <div className="selected-files">
              <ul>
                {files[field].map((file, index) => (
                  <li key={index}>{file.name}</li> // Display selected file names
                ))}
              </ul>
            </div>
          )}
          {files[field]?.length > 0 && (
            <button
              onClick={() => handleSaveClick(field)} // Pass the specific field to save
              disabled={loading}
              className="submit-upload"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "30px",
              }}
            >
              {loading ? <Loader size={5} /> : "Submit"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderBankDetails = () => {
    // Only show for drivers
    if (role !== 'driver') return null;
  
    return (
      <>
        <div className="info-item">
          <span className="info-label">Bank Name:</span>
          <div className="editable-field">
            {editingField === 'bankName' ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails(prev => ({
                    ...prev, 
                    bankName: e.target.value
                  }))}
                  className="edit-input"
                  placeholder="Enter Bank Name"
                />
                <button
                  onClick={() => {
                    dispatch(updateProfile({ 
                      driverAccountDetails: {
                        ...user.driverAccountDetails,
                        bankName: bankDetails.bankName
                      }
                    }));
                    setEditingField(null);
                  }}
                  disabled={loading}
                  className="action-btn save"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setEditingField(null)}
                  className="action-btn cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="display-mode">
                <span className="info-value">
                  {user.driverAccountDetails?.bankName || "Not provided"}
                </span>
                <button
                  onClick={() => {
                    setBankDetails(prev => ({
                      ...prev,
                      bankName: user.driverAccountDetails?.bankName || ''
                    }));
                    setEditingField('bankName');
                  }}
                  className="edit-btn"
                >
                  <Pencil size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
  
        <div className="info-item">
          <span className="info-label">Account Number:</span>
          <div className="editable-field">
            {editingField === 'accountNumber' ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails(prev => ({
                    ...prev, 
                    accountNumber: e.target.value
                  }))}
                  className="edit-input"
                  placeholder="Enter Account Number"
                />
                <button
                  onClick={() => {
                    dispatch(updateProfile({ 
                      driverAccountDetails: {
                        ...user.driverAccountDetails,
                        accountNumber: bankDetails.accountNumber
                      }
                    }));
                    setEditingField(null);
                  }}
                  disabled={loading}
                  className="action-btn save"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setEditingField(null)}
                  className="action-btn cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="display-mode">
                <span className="info-value">
                  {user.driverAccountDetails?.accountNumber 
                    ? user.driverAccountDetails.accountNumber.replace(/\d(?=\d{4})/g, "*") 
                    : "Not provided"}
                </span>
                <button
                  onClick={() => {
                    setBankDetails(prev => ({
                      ...prev,
                      accountNumber: user.driverAccountDetails?.accountNumber || ''
                    }));
                    setEditingField('accountNumber');
                  }}
                  className="edit-btn"
                >
                  <Pencil size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
  
        <div className="info-item">
          <span className="info-label">IFSC Code:</span>
          <div className="editable-field">
            {editingField === 'ifscCode' ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails(prev => ({
                    ...prev, 
                    ifscCode: e.target.value
                  }))}
                  className="edit-input"
                  placeholder="Enter IFSC Code"
                />
                <button
                  onClick={() => {
                    dispatch(updateProfile({ 
                      driverAccountDetails: {
                        ...user.driverAccountDetails,
                        ifscCode: bankDetails.ifscCode
                      }
                    }));
                    setEditingField(null);
                  }}
                  disabled={loading}
                  className="action-btn save"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setEditingField(null)}
                  className="action-btn cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="display-mode">
                <span className="info-value">
                  {user.driverAccountDetails?.ifscCode || "Not provided"}
                </span>
                <button
                  onClick={() => {
                    setBankDetails(prev => ({
                      ...prev,
                      ifscCode: user.driverAccountDetails?.ifscCode || ''
                    }));
                    setEditingField('ifscCode');
                  }}
                  className="edit-btn"
                >
                  <Pencil size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
  
        <div className="info-item">
          <span className="info-label">Account Holder Name:</span>
          <div className="editable-field">
            {editingField === 'accountHolderName' ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => setBankDetails(prev => ({
                    ...prev, 
                    accountHolderName: e.target.value
                  }))}
                  className="edit-input"
                  placeholder="Enter Account Holder Name"
                />
                <button
                  onClick={() => {
                    dispatch(updateProfile({ 
                      driverAccountDetails: {
                        ...user.driverAccountDetails,
                        accountHolderName: bankDetails.accountHolderName
                      }
                    }));
                    setEditingField(null);
                  }}
                  disabled={loading}
                  className="action-btn save"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setEditingField(null)}
                  className="action-btn cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="display-mode">
                <span className="info-value">
                  {user.driverAccountDetails?.accountHolderName || "Not provided"}
                </span>
                <button
                  onClick={() => {
                    setBankDetails(prev => ({
                      ...prev,
                      accountHolderName: user.driverAccountDetails?.accountHolderName || ''
                    }));
                    setEditingField('accountHolderName');
                  }}
                  className="edit-btn"
                >
                  <Pencil size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };


  const renderDriverFields = () => (
    <>
      <div className="info-item">
        <span className="info-label">Driver License:</span>
        {formatDocumentList("driverLicense", documents.driverLicense)}
      </div>

      <div className="info-item">
        <span className="info-label">Identity Proof:</span>
        {formatDocumentList("identityProof", documents.identityProof)}
      </div>

      <div className="info-item">
        <span className="info-label">Vehicle Insurance:</span>
        {formatDocumentList("vehicleInsurance", documents.vehicleInsurance)}
      </div>

      <div className="info-item">
        <span className="info-label">Vehicle Registration:</span>
        {formatDocumentList(
          "vehicleRegistration",
          documents.vehicleRegistration
        )}
      </div>

      <div className="info-item">
        <span className="info-label">Vehicle Photo:</span>
        {formatDocumentList("vehiclePhoto", documents.vehiclePhoto)}
      </div>

      <div className="info-item">
        <span className="info-label">Vehicle Type:</span>
        <div className="editable-field">
          {editingField === "vehicleType" ? (
            <div className="edit-mode">
              <select
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                className="edit-select"
              >
                {vehicleTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSaveClick}
                disabled={loading}
                className="action-btn save"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setEditingField(null)}
                className="action-btn cancel"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="display-mode">
              <span className="info-value">
                {vehicleDetails.vehicleType || "Not provided"}
              </span>
              <button
                onClick={() =>
                  handleEditClick("vehicleType", vehicleDetails.vehicleType)
                }
                className="edit-btn"
              >
                <Pencil size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="info-item">
        <span className="info-label">Load Capacity:</span>
        <div className="editable-field">
          {editingField === "loadCapacity" ? (
            <div className="edit-mode">
              <input
                type="text"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                className="edit-input"
              />
              <button
                onClick={handleSaveClick}
                disabled={loading}
                className="action-btn save"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setEditingField(null)}
                className="action-btn cancel"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="display-mode">
              <span className="info-value">
                {vehicleDetails.loadCapacity || "Not provided"}
              </span>
              <button
                onClick={() =>
                  handleEditClick("loadCapacity", vehicleDetails.loadCapacity)
                }
                className="edit-btn"
              >
                <Pencil size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderCompanyFields = () => (
    <>
      <div className="info-item">
        <span className="info-label">Company Registration:</span>
        {formatDocumentList(
          "companyRegistration",
          documents.companyRegistration
        )}
      </div>

      <div className="info-item">
        <span className="info-label">GST Certificate:</span>
        {formatDocumentList("gstCertificate", documents.gstCertificate)}
      </div>
    </>
  );

  return (
    <div className="profile-container">
      <div className="header1">
        <Navbar />
      </div>
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">{name}</h2>
          {role === "driver" && (
            <h4 className="wallet-balance">Wallet Balance: {walletBalance}</h4>
          )}
        </div>

        <div className="profile-content">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{email}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Phone Number:</span>
              <div className="editable-field">
                {editingField === "phoneNumber" ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                      className="edit-input"
                    />
                    <button
                      onClick={() => handleSaveClick("phoneNumber")}
                      disabled={loading}
                      className="action-btn save"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      className="action-btn cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="display-mode">
                    <span className="info-value">
                      {phoneNumber || "Not provided"}
                    </span>
                    <button
                      onClick={() =>
                        handleEditClick("phoneNumber", phoneNumber)
                      }
                      className="edit-btn"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {role === "driver" && (
  <>
    {renderDriverFields()}
    {renderBankDetails()}
  </>
)}
            {role === "company" && renderCompanyFields()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
