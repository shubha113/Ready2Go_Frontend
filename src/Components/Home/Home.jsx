// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import './Home.css';
import CargoImage from '../../Assets/Home.png';
import Navbar from '../Auth/Shared/Navbar';
import LocationTracker from '../Location/Location';
import { updateLocation } from '../../Redux/actions/userAction';

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      // Check and handle location
      if (navigator.geolocation) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((permissionStatus) => {
            console.log("Permission status:", permissionStatus.state);
            
            if (permissionStatus.state === "granted") {
              // Get location if permission is already granted
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  dispatch(updateLocation([longitude, latitude]))
                    .catch((error) => {
                      console.error("Location update error:", error);
                      toast.error("Failed to update location");
                    });
                },
                (error) => {
                  console.error("Geolocation error:", error);
                  toast.error("Error getting location");
                }
              );
            } else if (permissionStatus.state === "prompt") {
              // Ask for permission if not yet granted
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  dispatch(updateLocation([longitude, latitude]))
                    .catch((error) => {
                      console.error("Location update error:", error);
                      toast.error("Failed to update location");
                    });
                },
                (error) => {
                  console.error("Geolocation error:", error);
                  toast.error("Please allow location access");
                }
              );
            } else {
              // Handle denied permission
              toast.error("Location access is denied. Please enable it in browser settings");
            }
          })
          .catch((error) => {
            console.error("Permission query error:", error);
            toast.error("Error checking location permissions");
          });
      } else {
        toast.error("Geolocation is not supported by your browser");
      }
    }
  }, [isAuthenticated, dispatch]);

  return (
    <div>
      <div className="landing-page">
        <div className="card-overlay">
          {/* Navbar */}
          <Navbar />
          
          {/* Location Tracker */}
          {isAuthenticated && (
            <LocationTracker 
              onLocationUpdate={updateLocation}
              isAuthenticated={isAuthenticated}
            />
          )}

          {/* Main Home Content */}
          <div className="main-content">
            <div className="content">
              <h1 className="name">
                Ready<span style={{ color: "purple", fontSize: '6rem' }}>2</span>Go
              </h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur culpa nisi minus esse
                corporis aliquam voluptates fuga quisquam voluptatem doloribus.
              </p>
              <button className="cta-button">Find Cargo</button>
            </div>

            <div className="image-container">
              <img src={CargoImage} alt="Cargo Transport" className="cargo-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;