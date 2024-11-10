// src/pages/CreateOrder.jsx
import React, { useState } from 'react';
import './CreateOrder.css';
import Navbar from '../Auth/Shared/Navbar';

const CreateOrder = ({ onSubmit }) => {
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
    onSubmit(formData);
  };

  return (
    <div className="create-order-page">
      <div className="card-overlay">
        {/* Navbar */}
        <Navbar />

        {/* Main Create Order Content */}
        <div className="main-content">
          <div className="content">
            <h1 className="title">Create Job</h1>
            <form onSubmit={handleSubmit} className="create-order-form">
              <label>Pickup Location</label>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
              />

              <label>Drop Location</label>
              <input
                type="text"
                name="dropLocation"
                value={formData.dropLocation}
                onChange={handleChange}
                required
              />

              <label>Vehicle Type</label>
              <input
                type="text"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              />

              <label>Items</label>
              <input
                type="text"
                name="items"
                value={formData.items}
                onChange={handleChange}
                required
              />

              <label>Weight</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />

              <label>Multi-Drop Locations (Optional)</label>
              <input
                type="text"
                name="multiDropLocations"
                value={formData.multiDropLocations}
                onChange={handleChange}
                placeholder="Comma-separated locations"
              />

              <button type="submit" className="cta-button">Submit Job</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
