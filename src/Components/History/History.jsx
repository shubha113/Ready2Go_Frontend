import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userHistory, driverHistory } from '../../Redux/actions/jobAction';
import { cancelJob } from '../../Redux/actions/jobAction';
import Loader from '../Loader/Loader';
import Navbar from '../Auth/Shared/Navbar';
import './History.css'
import { 
  PackageOpen, 
  MapPin, 
  Truck, 
  Weight, 
  Clock, 
  DollarSign,
  User,
  Calendar,
  CheckCircle2,
  Timer,
  MapPinned,
  XCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const History = () => {
  const dispatch = useDispatch();
  const {
    loading,
    ongoingDeliveries,
    pastDeliveries,
    ongoingCount,
    pastDeliveriesCount,
  } = useSelector((state) => state.job);
  
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.role === 'driver') {
      dispatch(driverHistory());
    } else if (user?.role === 'user') {
      dispatch(userHistory());
    }
  }, [dispatch, user?.role]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelJob = (jobId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this job?');
    if (confirmCancel) {
      dispatch(cancelJob(jobId))
        .then(() => {
          toast.success('Job canceled successfully');
          if (user?.role === 'user') {
            dispatch(userHistory());
          }
        })
        .catch((error) => {
          toast.error(error.message || 'Failed to cancel job');
        });
    }
  };

  const JobCard = ({ job, type }) => (
    <div className={`job-card ${type}`}>
      <div className="job-header">
        <div className="status-section">
          <span className={`status-badge ${job.status}`}>
            {type === 'ongoing' ? <Timer className="status-icon" /> : <CheckCircle2 className="status-icon" />}
            {job.status}
          </span>
        </div>
        {user?.role === 'user' && job.driverName && (
          <div className="person-info">
            <User className="person-icon" />
            <p className="person-name">Driver: {job.driverName}</p>
          </div>
        )}
        {user?.role === 'driver' && job.userName && (
          <div className="person-info">
            <User className="person-icon" />
            <p className="person-name">Customer: {job.userName}</p>
          </div>
        )}
        
        {/* Conditional Cancel Button for Users in Pending Jobs */}
        {user?.role === 'user' && job.status === 'pending' && (
          <button 
            className="cancel-job-button"
            onClick={() => handleCancelJob(job._id)}
          >
            <XCircle className="cancel-icon" />
            Cancel Job
          </button>
        )}
      </div>

      <div className="job-content">
        <div className="location-group">
          <div className="location-item">
            <MapPin className="location-icon pickup" />
            <div className="location-text">
              <h4>Pickup Location</h4>
              <p>{job.pickupLocation.coordinates}</p>
            </div>
          </div>

          <div className="location-item">
            <MapPinned className="location-icon drop" />
            <div className="location-text">
              <h4>Drop Location</h4>
              <p>{job.dropLocation.coordinates}</p>
            </div>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <PackageOpen className="detail-icon" />
            <div className="detail-text">
              <h4>Items</h4>
              <p>{job.items}</p>
            </div>
          </div>

          <div className="detail-item">
            <Weight className="detail-icon" />
            <div className="detail-text">
              <h4>Weight</h4>
              <p>{job.weight} kg</p>
            </div>
          </div>

          {job.fare && (
            <div className="detail-item">
              <DollarSign className="detail-icon" />
              <div className="detail-text">
                <h4>Fare</h4>
                <p>₹{job.fare}</p>
              </div>
            </div>
          )}
        </div>

        {user?.role === 'driver' && type === 'ongoing' && job.currentLocation && (
          <div className="current-location">
            <Truck className="detail-icon" />
            <div className="detail-text">
              <h4>Current Location</h4>
              <p>{job.currentLocation}</p>
            </div>
          </div>
        )}

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

  if (loading) return <Loader />;

  return (
    <div className="history-container">
      <Navbar />
      <div className="history-content">
        <h1 className="history-title">
          {user?.role === 'driver' ? 'My Deliveries' : 'My Orders'}
        </h1>

        {ongoingCount > 0 && (
          <section className="delivery-section">
            <h2>
              <Truck className="section-icon" />
              Ongoing {user?.role === 'driver' ? 'Deliveries' : 'Orders'} ({ongoingCount})
            </h2>
            <div className="jobs-grid">
              {ongoingDeliveries.map((job, index) => (
                <JobCard key={index} job={job} type="ongoing" />
              ))}
            </div>
          </section>
        )}

        {pastDeliveriesCount > 0 && (
          <section className="delivery-section">
            <h2>
              <CheckCircle2 className="section-icon" />
              Past {user?.role === 'driver' ? 'Deliveries' : 'Orders'} ({pastDeliveriesCount})
            </h2>
            <div className="jobs-grid">
              {pastDeliveries.map((job, index) => (
                <JobCard key={index} job={job} type="past" />
              ))}
            </div>
          </section>
        )}

        {!ongoingCount && !pastDeliveriesCount && (
          <div className="no-deliveries">
            <PackageOpen size={48} className="empty-icon" />
            <h3>No {user?.role === 'driver' ? 'deliveries' : 'orders'} found</h3>
            <p>
              {user?.role === 'driver'
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