import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './RatingModal.css';
import { toast } from 'react-toastify';
import { rateJob } from '../../Redux/actions/jobAction';

const Rating = ({ jobId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.job);

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    dispatch(rateJob(jobId, rating));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      onClose();
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error, onClose]);

  return (
    <div className="rating-modal-overlay">
      <div className="rating-modal-container">
        <h2>Rate Your Delivery</h2>
        <p>How was your delivery experience?</p>
        <div className="star-rating">
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                type="button"
                key={index}
                className={index <= (hover || rating) ? "on" : "off"}
                onClick={() => setRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
              >
                <span className="star">&#9733;</span>
              </button>
            );
          })}
        </div>
        <div className="rating-description">
          {rating === 1 && "Poor"}
          {rating === 2 && "Below Average"}
          {rating === 3 && "Average"}
          {rating === 4 && "Good"}
          {rating === 5 && "Excellent"}
        </div>
        <div className="rating-modal-actions">
          <button 
            onClick={handleRatingSubmit} 
            disabled={loading || rating === 0}
            className="submit-rating"
          >
            {loading ? 'Submitting...' : 'Submit Rating'}
          </button>
          <button 
            onClick={onClose} 
            className="cancel-rating"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rating;