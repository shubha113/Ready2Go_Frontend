import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './History.css';
import { userHistory, driverHistory } from '../../Redux/actions/jobAction';
import Loader from '../Loader/Loader';
import Navbar from '../Auth/Shared/Navbar';

const History = () => {
  const dispatch = useDispatch();
  const {
    loading,
    ongoingDeliveries,
    pastDeliveries,
    ongoingCount,
    pastDeliveriesCount,
    error
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

  const JobCard = ({ job, type }) => (
    <div className={`job-card ${type}`}>
      <div className="job-status">
        <span className={`status-badge ${job.status}`}>{job.status}</span>
        {user?.role === 'user' && job.driverName && (
          <p className="driver-name">Driver: {job.driverName}</p>
        )}
        {user?.role === 'driver' && job.userName && (
          <p className="customer-name">Customer: {job.userName}</p>
        )}
      </div>

      <div className="job-details">
        <div className="detail-group">
          <h4>Pickup Location</h4>
          <p>{job.pickupLocation.coordinates}</p>
        </div>

        <div className="detail-group">
          <h4>Drop Location</h4>
          <p>{job.dropLocation.coordinates}</p>
        </div>

        <div className="details-row">
          <div className="detail-item">
            <h4>Items Name</h4>
            <p>{job.items}</p>
          </div>

          <div className="detail-item">
            <h4>Weight</h4>
            <p>{job.weight} kg</p>
          </div>

          {job.fare && (
            <div className="detail-item">
              <h4>Fare</h4>
              <p>₹{job.fare}</p>
            </div>
          )}
        </div>

        {/* Show current location only for ongoing deliveries for drivers */}
        {user?.role === 'driver' && type === 'ongoing' && job.currentLocation && (
          <div className="detail-group">
            <h4>Current Location</h4>
            <p>{job.currentLocation}</p>
          </div>
        )}

        <div className="time-details">
          {job.startTime && <p>Start: {formatDate(job.startTime)}</p>}
          {job.endTime && <p>End: {formatDate(job.endTime)}</p>}
          <p>Created: {formatDate(job.createdAt)}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="history-container">
      <Navbar />
      
      {/* Role-specific header */}
      <h1 className="history-title">
        {user?.role === 'driver' ? 'My Deliveries' : 'My Orders'}
      </h1>

      {ongoingCount > 0 && (
        <section className="delivery-section">
          <h2>Ongoing {user?.role === 'driver' ? 'Deliveries' : 'Orders'} ({ongoingCount})</h2>
          <div className="jobs-grid">
            {ongoingDeliveries.map((job, index) => (
              <JobCard key={index} job={job} type="ongoing" />
            ))}
          </div>
        </section>
      )}

      {pastDeliveriesCount > 0 && (
        <section className="delivery-section">
          <h2>Past {user?.role === 'driver' ? 'Deliveries' : 'Orders'} ({pastDeliveriesCount})</h2>
          <div className="jobs-grid">
            {pastDeliveries.map((job, index) => (
              <JobCard key={index} job={job} type="past" />
            ))}
          </div>
        </section>
      )}

      {!ongoingCount && !pastDeliveriesCount && (
        <div className="no-deliveries">
          <h3>No {user?.role === 'driver' ? 'deliveries' : 'orders'} found</h3>
          <p>
            {user?.role === 'driver'
              ? "You haven't completed any deliveries yet."
              : "You haven't created any delivery requests yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default History;