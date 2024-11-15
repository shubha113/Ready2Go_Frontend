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
  const [editingDocument, setEditingDocument] = useState(null);

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
    vehicleDetails,
    verificationStatus,
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
    setFieldValue(initialValue);
    setFile(null);
    setEditingDocument(field);
  };

  const handleSaveClick = () => {
    if (!editingField) {
      console.error("No field selected for editing.");
      return;
    }

    const updatedData = new FormData();

    if (file) {
      updatedData.append(editingField, file);
    } else {
      updatedData.append(editingField, fieldValue);
    }

    dispatch(updateProfile(updatedData)).then(() => {
      if (editingField === "phoneNumber") {
        navigate("/verify-otp");
      }
      setEditingField(null);
      setFile(null);
      setEditingDocument(null);
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

    const status = verificationStatus?.[field] || "pending";

    return (
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

            <div className="document-upload">
              <label htmlFor={`${field}-${index}`} className="upload-label">
                <Upload size={16} /> Upload New
              </label>
              <input
                type="file"
                id={`${field}-${index}`}
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setEditingField(field);
                  setEditingDocument(field);
                }}
                className="file-input"
              />
              {file && editingDocument === field && (
                <button
                  onClick={handleSaveClick}
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
          </li>
        ))}
      </ul>
    );
  };
  return (
    <div className="profile-container">
      <div className="header1">
        <Navbar />
      </div>
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">{name}</h2>
          {role === "user" && (
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
                <div className="info-item">
                  <span className="info-label">Ratings:</span>
                  <span className="info-value">
                    {ratings?.length > 0
                      ? ratings.join(", ")
                      : "No ratings available"}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Driver License:</span>
                  {formatDocumentList(
                    documents?.driverLicense,
                    "driverLicense"
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Vehicle Registration:</span>
                  {formatDocumentList(
                    documents?.vehicleRegistration,
                    "vehicleRegistration"
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Vehicle Insurance:</span>
                  {formatDocumentList(
                    documents?.vehicleInsurance,
                    "vehicleInsurance"
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Identity Proof:</span>
                  {formatDocumentList(
                    documents?.identityProof,
                    "identityProof"
                  )}
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
                          {user.vehicleDetails?.vehicleType || "Not provided"}
                        </span>
                        <button
                          onClick={() =>
                            handleEditClick(
                              "vehicleType",
                              user.vehicleDetails?.vehicleType
                            )
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
                          {vehicleDetails?.loadCapacity || "Not provided"} Kg
                        </span>
                        <button
                          onClick={() =>
                            handleEditClick(
                              "loadCapacity",
                              vehicleDetails?.loadCapacity
                            )
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
            )}

            {role === "company" && (
              <>
                <div className="section">
                  <h3 className="section-title">Company Details</h3>
                  <div className="info-item">
                    <span className="info-label">Company Registration:</span>
                    {formatDocumentList(
                      documents?.companyRegistration,
                      "companyRegistration"
                    )}
                  </div>

                  <div className="info-item">
                    <span className="info-label">GST Certificate:</span>
                    {formatDocumentList(
                      documents?.gstCertificate,
                      "gstCertificate"
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
