import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './History.css';
import { userHistory } from '../../Redux/actions/jobAction';
import Loader from '../Loader/Loader';

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

  useEffect(() => {
    dispatch(userHistory());
  }, [dispatch]);

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
        {job.driverName && <p className="driver-name">Driver: {job.driverName}</p>}
      </div>
      
      <div className="job-details">
        <div className="detail-group">
          <h4>Pickup Location</h4>
          <p>{job.pickupLocation.coordinates.join(', ')}</p>
        </div>
        
        <div className="detail-group">
          <h4>Drop Location</h4>
          <p>{job.dropLocation.coordinates.join(', ')}</p>
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
        
        <div className="time-details">
          {job.startTime && <p>Start: {formatDate(job.startTime)}</p>}
          {job.endTime && <p>End: {formatDate(job.endTime)}</p>}
          <p>Created: {formatDate(job.createdAt)}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading"><Loader/></div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="history-container">
      {ongoingCount > 0 && (
        <section className="delivery-section">
          <h2>Ongoing Deliveries ({ongoingCount})</h2>
          <div className="jobs-grid">
            {ongoingDeliveries.map((job, index) => (
              <JobCard key={index} job={job} type="ongoing" />
            ))}
          </div>
        </section>
      )}

      {pastDeliveriesCount > 0 && (
        <section className="delivery-section">
          <h2>Past Deliveries ({pastDeliveriesCount})</h2>
          <div className="jobs-grid">
            {pastDeliveries.map((job, index) => (
              <JobCard key={index} job={job} type="past" />
            ))}
          </div>
        </section>
      )}

      {!ongoingCount && !pastDeliveriesCount && (
        <div className="no-deliveries">
          <h3>No deliveries found</h3>
          <p>You haven't created any delivery requests yet.</p>
        </div>
      )}
    </div>
  );
};

export default History;