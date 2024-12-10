import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapPin, Truck, Package, Weight, Route, Send } from 'lucide-react';
import './CreateOrder.css';
import { createJob } from "../../Redux/actions/jobAction";
import Navbar from '../Auth/Shared/Navbar';
import Loader from '../Loader/Loader';
import GoogleMap from '../Map/Map';
import { useTranslation } from 'react-i18next';

const CreateOrder = () => {
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.job);
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropLocation: '',
    vehicleType: '',
    items: '',
    weight: '',
    multiDropLocations: '',
  });
  const [weightError, setWeightError] = useState('');
  const [itemsError, setItemsError] = useState('');
  const [showMap, setShowMap] = useState(null);

  const vehicleTypeLimits = {
    motorcycle: 150,
    small: 500,
    medium: 2000,
    large: 5000,
    "extra-large": 10000,
    "heavy-duty": Infinity,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "items") {
      if (/^[a-zA-Z\s,]*$/.test(value)) {
        setItemsError('');
      } else {
        setItemsError('Items field should only contain letters, spaces, and commas.');
      }
    }
    
    setFormData({ ...formData, [name]: value });

    if (name === "weight" || name === "vehicleType") {
      validateWeight(name === "weight" ? value : formData.weight, name === "vehicleType" ? value : formData.vehicleType);
    }
  };

  const validateWeight = (weight, vehicleType) => {
    if (vehicleType && weight) {
      const maxWeight = vehicleTypeLimits[vehicleType];
      if (weight > maxWeight) {
        // Use translation for weight error
        setWeightError(
          t(`createOrder.errorMessages.weightValidation.${vehicleType.replace('-', '')}`, 
            `${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} vehicle can carry only ${maxWeight}kg.`)
        );
      } else {
        setWeightError("");
      }
    }
  };

  const handleLocationSelect = (address) => {
    if (showMap === 'pickup') {
      setFormData({ ...formData, pickupLocation: address });
    } else if (showMap === 'drop') {
      setFormData({ ...formData, dropLocation: address });
    }
    setShowMap(null);
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
            <h1 className="title">{t('createOrder.pageTitle')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="create-order-form">
            <div className="form-group">
              <label>
                <MapPin size={18} style={{ color: "#DB2777", marginRight: '0.5rem', verticalAlign: 'middle' }} />
                {t('createOrder.labels.pickupLocation')}
              </label>
              <div className="location-input">
                <input
                  placeholder={t('createOrder.labels.pickupLocationPlaceholder')}
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onFocus={() => setShowMap('pickup')}
                  onChange={handleChange}
                  required
                />
                
              </div>
            </div>

            <div className="form-group">
              <label>
                <Route size={18} style={{color: "#DB2777", marginRight: '0.5rem', verticalAlign: 'middle' }} />
                {t('createOrder.labels.dropLocation')}
              </label>
              <div className="location-input">
                <input
                  placeholder={t('createOrder.labels.dropLocationPlaceholder')}
                  type="text"
                  name="dropLocation"
                  value={formData.dropLocation}
                  onFocus={() => setShowMap('drop')}
                  onChange={handleChange}
                  required
                />
                
              </div>
            </div>

            <div className="form-group">
              <label>
                <Truck size={18} style={{ color: "#DB2777", marginRight: '0.5rem', verticalAlign: 'middle' }} />
                {t('createOrder.labels.vehicleType')}
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="">{t('createOrder.labels.vehicleTypePlaceholder')}</option>
                {Object.keys(vehicleTypeLimits).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <Package size={18} style={{ color: "#DB2777", marginRight: '0.5rem', verticalAlign: 'middle' }} />
                {t('createOrder.labels.items')}
              </label>
              <input
                placeholder={t('createOrder.labels.itemsPlaceholder')}
                type="text"
                name="items"
                value={formData.items}
                onChange={handleChange}
                required
              />
              {itemsError && <small className="error-message">{itemsError}</small>}
            </div>

            <div className="form-group">
              <label>
                <Weight size={18} style={{ color: "#DB2777", marginRight: '0.5rem', verticalAlign: 'middle' }} />
                {t('createOrder.labels.weight')}
              </label>
              <input
                placeholder={t('createOrder.labels.weightPlaceholder')}
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
                <small className="error-message">{weightError}</small>
              )}
            </div>

            <div className="form-group multi-drop">
              <label>
                <Route size={18} style={{color: "#DB2777", marginRight: '0.5rem', verticalAlign: 'middle' }} />
                {t('createOrder.labels.multiDropLocations')}
              </label>
              <input
                type="text"
                name="multiDropLocations"
                value={formData.multiDropLocations}
                onChange={handleChange}
                placeholder= {t('createOrder.labels.multiDropLocationsPlaceholder')}
              />
            </div>

            <button
              type="submit"
              className="cta-button"
              disabled={loading}
            >
              {loading ? <Loader size={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}/> : <>
                <Send size={18} />
                {t('createOrder.submitButton')}
              </>}
            </button>
          </form>
        </div>
      </div>

      {showMap && (
        <div className="map-modal">
          <div>
            <GoogleMap onLocationSelect={handleLocationSelect} />
            <button onClick={() => setShowMap(null)}>Close Map</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;