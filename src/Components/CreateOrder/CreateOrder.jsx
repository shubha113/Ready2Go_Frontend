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
  const { loading, message, error } = useSelector((state) => state.job);

  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropLocation: '',
    vehicleType: '',
    items: '',
    weight: '',
    multiDropLocations: '',
  });
  const [weightError, setWeightError] = useState(''); // State for weight validation error

  // Vehicle type weight limits
  const vehicleTypeLimits = {
    motorcycle: 150,
    small: 500,
    medium: 2000,
    large: 5000,
    "extra-large": 10000,
    "heavy-duty": Infinity, // for weights above 10,000 kg
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Weight validation
    if (name === "weight" || name === "vehicleType") {
      validateWeight(name === "weight" ? value : formData.weight, name === "vehicleType" ? value : formData.vehicleType);
    }
  };

  const validateWeight = (weight, vehicleType) => {
    if (vehicleType && weight) {
      const maxWeight = vehicleTypeLimits[vehicleType];
      if (weight > maxWeight) {
        setWeightError(`${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} vehicle can carry only ${maxWeight}kg.`);
      } else {
        setWeightError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weightError) {
      dispatch(createJob(formData));
    } else {
      toast.error("Please fix the weight error before submitting.");
    }
  };

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
      });
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
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  {Object.keys(vehicleTypeLimits).map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
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
                  style={{
                    borderColor: weightError ? "red" : "initial",
                  }}
                />
                {weightError && (
                  <small style={{ color: "red" }}>{weightError}</small>
                )}
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

              <button
                type="submit"
                className="cta-button"
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '40px',
                }}
              >
                {loading ? <Loader size={5} /> : "Create Delivery"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
