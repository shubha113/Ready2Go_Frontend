import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateOrder.css";
import { createJob } from "../../Redux/actions/jobAction";
import Navbar from "../Auth/Shared/Navbar";
import Loader from "../Loader/Loader";
import GoogleMap from "../Map/Map";
import { FaMapMarkerAlt } from "react-icons/fa";

const CreateOrder = () => {
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.job);

  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    vehicleType: "",
    items: "",
    weight: "",
    multiDropLocations: "",
  });
  const [weightError, setWeightError] = useState("");
  const [itemsError, setItemsError] = useState("");
  const [showMap, setShowMap] = useState(null); // State to control map modal

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

    // Items validation: allow only letters and spaces
    if (name === "items") {
      // Updated regex to allow letters, spaces, and commas
      if (/^[a-zA-Z\s,]*$/.test(value)) {
        setItemsError("");
      } else {
        setItemsError(
          "Items field should only contain letters, spaces, and commas."
        );
      }
    }

    setFormData({ ...formData, [name]: value });

    // Weight validation
    if (name === "weight" || name === "vehicleType") {
      validateWeight(
        name === "weight" ? value : formData.weight,
        name === "vehicleType" ? value : formData.vehicleType
      );
    }
  };

  const validateWeight = (weight, vehicleType) => {
    if (vehicleType && weight) {
      const maxWeight = vehicleTypeLimits[vehicleType];
      if (weight > maxWeight) {
        setWeightError(
          `${
            vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)
          } vehicle can carry only ${maxWeight}kg.`
        );
      } else {
        setWeightError("");
      }
    }
  };

  const handleLocationSelect = (address) => {
    if (showMap === "pickup") {
      setFormData({ ...formData, pickupLocation: address });
    } else if (showMap === "drop") {
      setFormData({ ...formData, dropLocation: address });
    }
    setShowMap(null); // Close the map after selecting location
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
        pickupLocation: "",
        dropLocation: "",
        vehicleType: "",
        items: "",
        weight: "",
        multiDropLocations: "",
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <div className="card-overlay">
        <Navbar />
        <div>
          <p>
            Create <span class="fancy">Job</span>
          </p>
        </div>
        <div className="formbold-main-wrapper">
          <div
            className="formbold-form-wrapper"
            style={{
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
              padding: "20px",
            }}
          >
            <form onSubmit={handleSubmit} className="create-order-form">
              <div className="formbold-input-flex">
                <div className="input-icon-wrapper">
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    placeholder="Please select pickup location"
                    required
                    onClick={() => setShowMap("pickup")}
                  />
                  <FaMapMarkerAlt className="input-icon" color="purple" />
                  <label htmlFor="pickup" className="formbold-form-label">
                    Pickup Location
                  </label>
                </div>
                <div className="input-icon-wrapper">
                  <input
                    type="text"
                    name="dropLocation"
                    value={formData.dropLocation}
                    onChange={handleChange}
                    placeholder="Please select drop location"
                    required
                    onClick={() => setShowMap("drop")}
                  />
                  <FaMapMarkerAlt className="input-icon" color="purple" />
                  <label htmlFor="drop" className="formbold-form-label">
                    Drop Location
                  </label>
                </div>
              </div>

              <div className="formbold-input-flex">
                <div>
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
                  <label for="email" className="formbold-form-label">
                    Vehicle Type
                  </label>
                </div>
                <div>
                  <input
                    type="text"
                    name="items"
                    value={formData.items}
                    onChange={handleChange}
                    required
                    placeholder="please enter items"
                  />

                  {itemsError && (
                    <small style={{ color: "red" }}>{itemsError}</small>
                  )}

                  <label for="items" className="formbold-form-label">
                    Items
                  </label>
                </div>
              </div>

              <div className="formbold-input-flex">
                <div>
                  <input
                    type="text"
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
                  <label for="lastname" className="formbold-form-label">
                    Weight (kg)
                  </label>
                </div>
                <div>
                  <input
                    type="text"
                    name="multiDropLocations"
                    value={formData.multiDropLocations}
                    onChange={handleChange}
                    placeholder="Comma-separated locations"
                  />

                  <label for="items" className="formbold-form-label">
                    Multi Drop Locations
                  </label>
                </div>
              </div>

              {/* <div className="formbold-textarea">
                <textarea
                  rows="6"
                  name="message"
                  id="message"
                  placeholder="Write your message..."
                  className="formbold-form-input"
                ></textarea>
                <label for="message" className="formbold-form-label">
                  {" "}
                  Message{" "}
                </label>
              </div> */}

              <button
                type="submit"
                className="cta-button"
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "40px",
                }}
              >
                {loading ? <Loader size={5} /> : "Create Delivery"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Conditionally render Google Map */}
      {showMap && (
        <div className="map-modal">
          <GoogleMap onLocationSelect={handleLocationSelect} />
          <button onClick={() => setShowMap(null)}>Close Map</button>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;
