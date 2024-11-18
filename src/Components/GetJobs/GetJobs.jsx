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
  User
} from "lucide-react";
import "./GetJobs.css"; // Matches the provided CSS file
import { getJobs } from "../../Redux/actions/jobAction";
import Navbar from "../Auth/Shared/Navbar";

const GetJobs = () => {
  const dispatch = useDispatch();
  const { loading, jobs, error } = useSelector((state) => state.job);

  const [expandedJob, setExpandedJob] = useState(null); // To toggle job details

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="nearby-jobs-container">
        <Navbar/>
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

                <div className="action-buttons">
                  <button className="primary-button">Accept Job</button>
                  <button className="secondary-button">Contact Customer</button>
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
