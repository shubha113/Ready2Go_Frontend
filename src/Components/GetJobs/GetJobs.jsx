import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapPin,
  Truck,
  ChevronDown,
  ChevronUp,
  Navigation,
  Package, 
  Weight,
  User,
  IndianRupee
} from "lucide-react";
import "./GetJobs.css";
import { getJobs, acceptJob } from "../../Redux/actions/jobAction";
import Navbar from "../Auth/Shared/Navbar";
import Loader from "../Loader/Loader";
import { toast, ToastContainer } from "react-toastify";

const GetJobs = () => {
  const dispatch = useDispatch();
  const { loading, jobs, error, message } = useSelector((state) => state.job);

  const [expandedJob, setExpandedJob] = useState(null);
  const [fareInputs, setFareInputs] = useState({});


  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);


  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  
  const handleFareChange = (jobId, value) => {
    setFareInputs(prev => ({
      ...prev,
      [jobId]: value
    }));
  };

  const handleSubmitFare = (jobId) => {
    const fare = fareInputs[jobId];
    if (fare && parseFloat(fare) > 0) {
      dispatch(acceptJob(jobId, parseFloat(fare)));
      setFareInputs(prev => ({
        ...prev,
        [jobId]: ''
      }));
    } else {
      alert("Please enter a valid fare amount");
    }
  };


  if (loading) return <Loader/>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="nearby-jobs-container">
        <Navbar/>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="header-section">
        <h2 className="main-title">Nearby Jobs</h2>
        <div className="header-controls">
          <div className="jobs-count">
            <span>{jobs.length} jobs found</span>
          </div>
        </div>
      </div>

      <div className="jobs-list">
        {jobs.map((job) => (
          <div className="job-card" key={job._id}>
            {/* Job Header */}
            <div className="job-card-header">
              <div className="job-header-content">
                <div className="job-type">
                  <div className="icon-container">
                    <Truck className="icon" />
                  </div>
                  <div className="vehicle-info">
        <h3>{job.user.name}</h3>
        <p className="timestamp">{new Date(job.createdAt).toLocaleString()}</p> {/* Timestamp below vehicle type */}
      </div>
                 </div>
                 <div className="job-distance">
                  <span className="distance-badge">{job.distance} km away</span>
                  {expandedJob === job._id ? (
                    <ChevronUp
                      className="icon"
                      onClick={() => setExpandedJob(null)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <ChevronDown
                      className="icon"
                      onClick={() => setExpandedJob(job._id)}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Default Details (Pickup & Drop) */}
            <div className="location-details">
              <div className="location">
                <MapPin className="icon" />
                <p>
                  <strong>Pickup:</strong> {job.pickupLocation.text}
                </p>
              </div>
              <div className="location">
                <Navigation className="icon" />
                <p>
                  <strong>Drop:</strong> {job.dropLocation.text}
                </p>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedJob === job._id && (
              <div className="expanded-details">
                <div className="details-grid">
                  <div className="detail-item">
                    <Package className="icon"/>
                    <span className="detail-label">Items:</span>
                    <span className="detail-value">{job.items.join(", ")}</span>
                  </div>
                  <div className="detail-item">
                  <Weight className="icon"/>
                    <span className="detail-label">Weight:</span>
                    <span className="detail-value">{job.weight} kg</span>
                  </div>
                  <div className="detail-item">
                    <Truck className="icon"/>
                    <span className="detail-label">Vehicle Type:</span>
                    <span className="detail-value">{job.vehicleType}</span>
                  </div>
                  <div className="detail-item">
                    <User className="icon"/>
                    <span className="detail-label">Client Name:</span>
                    <span className="detail-value">{job.user.name}</span>
                  </div>
                </div>

                <div className="fare-submission-section">
                  <div className="fare-input-container">
                    <IndianRupee className="icon"/>
                    <input 
                      type="number" 
                      placeholder="Enter your fare"
                      value={fareInputs[job._id] || ''}
                      onChange={(e) => handleFareChange(job._id, e.target.value)}
                      className="fare-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <button 
                    className="primary-button" 
                    onClick={() => handleSubmitFare(job._id)}
                  >
                    Submit Fare
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetJobs;
