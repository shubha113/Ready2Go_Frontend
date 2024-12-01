import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userHistory, driverHistory } from "../../Redux/actions/jobAction";
import { cancelJob } from "../../Redux/actions/jobAction";
import Loader from "../Loader/Loader";
import Navbar from "../Auth/Shared/Navbar";
import "./History.css";
import {
  PackageOpen,
  UserCheck,     
  CheckCircle,     
  MapPinOff,
  MapPin,
  HelpCircle,
  Truck,
  Weight,
  Clock,
  IndianRupee,
  User,
  Calendar,
  CheckCircle2,
  Timer,
  MapPinned,
  XCircle,
  Navigation,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Location from '../Location/Location.jsx';

const History = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    ongoingDeliveries = [], 
    pastDeliveries = [], 
    ongoingCount = 0, 
    pastDeliveriesCount = 0, 
  } = useSelector((state) => state.job);

  const { isAuthenticated, user } = useSelector(state => state.user);

  useEffect(() => {
    if (user?.role === "driver") {
      dispatch(driverHistory());
    } else if (user?.role === "user") {
      dispatch(userHistory());
    }
  }, [dispatch, user?.role]);

  const getCurrentJobId = () => {
    if (user?.role === "driver" && ongoingDeliveries.length > 0) {
      // Assuming the first ongoing delivery is the current job
      return ongoingDeliveries[0]?._id;
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancelJob = (jobId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this job?"
    );
    if (confirmCancel) {
      dispatch(cancelJob(jobId))
        .then(() => {
          toast.success("Job canceled successfully");
          if (user?.role === "user") {
            dispatch(userHistory());
          }
        })
        .catch((error) => {
          toast.error(error.message || "Failed to cancel job");
        });
    }
  };

  const getLocationText = (location) => {
    try {
      if (!location) return null;
  
      if (location.pickupLocationText) return location.pickupLocationText;
      if (location.dropLocationText) return location.dropLocationText;
      
      if (location.text) return location.text;
      if (location.address) return location.address;
  
      if (location.coordinates && Array.isArray(location.coordinates)) {
        if (location.pickupLocationText) return location.pickupLocationText;
        if (location.dropLocationText) return location.dropLocationText;
        
        return `Location: ${location.coordinates[1]}, ${location.coordinates[0]}`;
      }
  
      if (typeof location === 'string') return location;
  
      if (Array.isArray(location)) {
        return `Location: ${location[1]}, ${location[0]}`;
      }
  
      return "Address not available";
    } catch (error) {
      console.error("Error extracting location text:", error);
      return "Address not available";
    }
  };

  const JobCard = ({ job, type }) => {
    if (!job) return null;

    const pickupAddress = getLocationText(job.pickupLocation) || "Address not available";
    const dropAddress = getLocationText(job.dropLocation) || "Address not available";

    return (
      <div className={`job-card ${type}`}>
        <div className="job-header">
          {isAuthenticated && user?.role === 'driver' && (
            <Location
              isAuthenticated={isAuthenticated}
              driverId={user?._id}
              jobId={getCurrentJobId()}
            />
          )}
          <div className="status-section">
  <span className={`status-badge ${job.status || 'unknown'}`}>
    {(() => {
      switch(job.status) {
        case 'pending':
          return <Clock className="status-icon" />;
        case 'assigned':
          return <UserCheck className="status-icon" />;
        case 'in-transit':
          return <Truck className="status-icon" />;
        case 'completed':
          return <CheckCircle className="status-icon" />;
        case 'canceled':
          return <XCircle className="status-icon" />;
        case 'driver_at_pickup':
          return <MapPin className="status-icon" />;
        case 'driver_at_drop':
          return <MapPinOff className="status-icon" />;
        default:
          return <HelpCircle className="status-icon" />;
      }
    })()}
    {job.status || 'Unknown Status'}
  </span>
</div>

          {/* User-specific buttons */}
          {user?.role === "user" && (
            <>
              {job.status === "pending" && !job.driverName && (
                <button
                  onClick={() => navigate(`/fares/${job._id}`)}
                  className="cancel-job-button"
                >
                  <IndianRupee className="cancel-icon" />
                  View Fares
                </button>
              )}

              {(job.status === "assigned" || 
                job.status === "in-transit" || 
                job.status === "driver_at_pickup" || 
                job.status === "driver_at_drop") && 
                job.driverName && (
                <button
                  onClick={() => navigate(`/track-order/${job._id}`)}
                  className="track-job-button"
                >
                  <Navigation className="track-icon" />
                  Track Order
                </button>
              )}

              {job.status === "pending" && (
                <button
                  className="cancel-job-button"
                  onClick={() => handleCancelJob(job._id)}
                >
                  <XCircle className="cancel-icon" />
                  Cancel Job
                </button>
              )}
            </>
          )}

          {/* Driver-specific buttons */}
          {user?.role === "driver" && (
            <>
              {/* Start Delivery Button */}
              {(job.status === "assigned" || 
                job.status === "driver_at_pickup") && (
                <button
                  onClick={() => navigate(`/track-order/${job._id}`)}
                  className="cancel-job-button"
                >
                  <Navigation className="cancel-icon" />
                  Start Delivery
                </button>
              )}

              {/* Track Order Button */}
              {(job.status === "in-transit" || 
                job.status === "driver_at_drop") && (
                <button
                  onClick={() => navigate(`/track-order/${job._id}`)}
                  className="track-job-button"
                >
                  <Navigation className="track-icon" />
                  Track Order
                </button>
              )}
            </>
          )}
        </div>

        <div className="job-content">
          <div className="location-group">
            <div className="location-item">
              <MapPin className="location-icon pickup" />
              <div className="location-text">
                <h4>Pickup Location</h4>
                <p>{pickupAddress}</p>
              </div>
            </div>

            <div className="location-item">
              <MapPinned className="location-icon drop" />
              <div className="location-text">
                <h4>Drop Location</h4>
                <p>{dropAddress}</p>
              </div>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <PackageOpen className="detail-icon" />
              <div className="detail-text">
                <h4>Items</h4>
                <p>{job.items || 'No items specified'}</p>
              </div>
            </div>

            <div className="detail-item">
              <Weight className="detail-icon" />
              <div className="detail-text">
                <h4>Weight</h4>
                <p>{job.weight ? `${job.weight} kg` : 'Weight not specified'}</p>
              </div>
            </div>

            <div className="detail-item">
              <IndianRupee className="detail-icon" />
              <div className="detail-text">
                <h4>Fare</h4>
                <p>{job.fare ? `₹${job.fare}` : "No fare decided"}</p>
              </div>
            </div>

            {user?.role === "user" && (
              <div className="detail-item">
                <User className="detail-icon" />
                <div className="detail-text">
                  <h4>Assigned Driver:</h4>
                  <p>{job.driverName || "Not assigned"}</p>
                </div>
              </div>
            )}

            {user?.role === "driver" && job.userName && (
              <div className="detail-item">
                <User className="detail-icon" />
                <div className="detail-text">
                  <h4>Customer:</h4>
                  <p className="person-name">{job.userName}</p>
                </div>
              </div>
            )}
          </div>

          <div className="time-details">
            <Clock className="time-icon" />
            <div className="time-grid">
              {job.startTime && (
                <div className="time-item">
                  <Calendar className="calendar-icon" />
                  <p>Start: {formatDate(job.startTime)}</p>
                </div>
              )}
              {job.endTime && (
                <div className="time-item">
                  <Calendar className="calendar-icon" />
                  <p>End: {formatDate(job.endTime)}</p>
                </div>
              )}
              <div className="time-item">
                <Calendar className="calendar-icon" />
                <p>Created: {formatDate(job.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="history-container">
      <Navbar />
      <div className="history-content">
        <h1 className="history-title">
          {user?.role === "driver" ? "My Deliveries" : "My Orders"}
        </h1>

        {ongoingDeliveries && ongoingDeliveries.length > 0 && (
          <section className="delivery-section">
            <h2>
              <Truck className="section-icon" />
              Ongoing {user?.role === "driver" ? "Deliveries" : "Orders"} (
              {ongoingCount})
            </h2>
            <div className="jobs-grid">
              {ongoingDeliveries.map((job) => (
                <JobCard key={job?._id || Math.random()} job={job} type="ongoing" />
              ))}
            </div>
          </section>
        )}

        {pastDeliveries && pastDeliveries.length > 0 && (
          <section className="delivery-section">
            <h2>
              <CheckCircle2 className="section-icon" />
              Past {user?.role === "driver" ? "Deliveries" : "Orders"} (
              {pastDeliveriesCount})
            </h2>
            <div className="jobs-grid">
              {pastDeliveries.map((job) => (
                <JobCard key={job?._id || Math.random()} job={job} type="past" />
              ))}
            </div>
          </section>
        )}

        {(!ongoingDeliveries?.length && !pastDeliveries?.length) && (
          <div className="no-deliveries">
            <PackageOpen size={48} className="empty-icon" />
            <h3>
              No {user?.role === "driver" ? "deliveries" : "orders"} found
            </h3>
            <p>
              {user?.role === "driver"
                ? "You haven't completed any deliveries yet."
                : "You haven't created any delivery requests yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;