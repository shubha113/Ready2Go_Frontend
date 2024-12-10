import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./Home.css";
import CargoImage from "../../Assets/Home1.png";
import Navbar from "../Auth/Shared/Navbar";
import LocationTracker from "../Location/Location";
import { updateLocation } from "../../Redux/actions/userAction";
import Features from "./Fetaures";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { t } = useTranslation();
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);
  const [locationPermissionRequested, setLocationPermissionRequested] = useState(false);

  const handleLocationUpdate = useCallback(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        await dispatch(updateLocation([longitude, latitude]));
      } catch (error) {
        console.error("Location update error:", error);
        toast.error("Failed to update location");
      }
    },
    [dispatch]
  );

  const handleLocationError = useCallback((error) => {
    console.error("Geolocation error:", error);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        toast.error(
          "Location access denied. Please enable it in browser settings"
        );
        break;
      case error.POSITION_UNAVAILABLE:
        toast.error("Location information unavailable");
        break;
      case error.TIMEOUT:
        toast.error("Location request timed out");
        break;
      default:
        toast.error("Error getting location");
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    navigate("/create-order")
    // Prevent multiple requests
    if (locationPermissionRequested) return;

    // Only proceed if the user is a driver
    if (user?.role !== "driver") return;

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    try {
      setLocationPermissionRequested(true);
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      switch (permission.state) {
        case "granted":
        case "prompt":
          navigator.geolocation.getCurrentPosition(
            handleLocationUpdate,
            handleLocationError,
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
          break;
        case "denied":
          toast.error(
            "Location access is denied. Please enable it in browser settings"
          );
          break;
      }

      permission.addEventListener("change", () => {
        if (permission.state === "granted" && user?.role === "driver") {
          navigator.geolocation.getCurrentPosition(
            handleLocationUpdate,
            handleLocationError
          );
        }
      });
    } catch (error) {
      console.error("Permission query error:", error);
      toast.error("Error checking location permissions");
    }
  }, [
    handleLocationUpdate,
    handleLocationError,
    user?.role,
    locationPermissionRequested,
  ]);

  return (
    <div>
      <div className="landing-page">
        <div className="card-overlay">
          <Navbar />

          {isAuthenticated && user?.role === "driver" && (
            <LocationTracker
              isAuthenticated={isAuthenticated}
              driverId={user?._id}
              jobId={user.currentJob ? user.currentJob._id : null}
            />
          )}

          <div className="main-content">
            <div className="content">
              <h1 className="name">
              <span>Ready<span style={{color:"purple"}}>2</span>Go</span>
              </h1>
              <p>
              {t('home.tagline')}
              </p>
              <button
                className="cta-button"
                onClick={requestLocationPermission}
                
              >
                {t('home.ctaButton')}
              </button>
            </div>

            <div className="image-container">
              <img
                src={CargoImage}
                alt="Cargo Transport"
                className="cargo-image"
              />
            </div>
          </div>
        </div>
      </div>
      <Features />
    </div>
  );
};

export default Home;
