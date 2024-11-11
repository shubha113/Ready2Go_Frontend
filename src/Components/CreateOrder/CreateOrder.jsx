import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateOrder.css';
import { createJob } from "../../Redux/actions/jobAction";
import Navbar from '../Auth/Shared/Navbar';
import Loader from '../Loader/Loader';

const CreateOrder = () => {
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.job); // Adjust if your job state has different properties
  
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropLocation: '',
    vehicleType: '',
    items: '',
    weight: '',
    multiDropLocations: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createJob(formData)); // Start the job creation process
  };

  // Trigger toast notifications for success or error messages
  useEffect(() => {
    if (message) {
      toast.success(message);
      setFormData({
        pickupLocation: '',
        dropLocation: '',
        vehicleType: '',
        items: '',
        weight: '',
        multiDropLocations: '',
      }); // Reset form after success
      dispatch({ type: "clearMessage" });
    }
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
  }, [message, error, dispatch]);

  return (
    <div className="create-order-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="card-overlay">
        <Navbar />
        
        <div className="main-content1">
          <div className="content1-title">
            <h1 className="title">Create Job</h1>
          </div>
          
          <div className="content1-form">
            <form onSubmit={handleSubmit} className="create-order-form">
              <div className="form-group">
                <label>Pickup Location</label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Drop Location</label>
                <input
                  type="text"
                  name="dropLocation"
                  value={formData.dropLocation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Vehicle Type</label>
                <input
                  type="text"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Items</label>
                <input
                  type="text"
                  name="items"
                  value={formData.items}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Weight</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Multi-Drop Locations (Optional)</label>
                <input
                  type="text"
                  name="multiDropLocations"
                  value={formData.multiDropLocations}
                  onChange={handleChange}
                  placeholder="Comma-separated locations"
                />
              </div>

              <button type="submit" className="cta-button" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}>
              {loading ? <Loader size={5} /> : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
