import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const LocationTracker = ({ onLocationUpdate, isAuthenticated }) => {
  const dispatch = useDispatch();
  const [watchId, setWatchId] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [lastCoordinates, setLastCoordinates] = useState(null); // Track last coordinates
  const MIN_DISTANCE = 30; // meters (set to 30 meters to track movement)
  const RATE_LIMIT = 5000; // milliseconds
  const RETRY_LIMIT = 3; // Retry after 3 failures
  let retryCount = 0;

  const positionOptions = {
    enableHighAccuracy: true, // Use GPS if available
    timeout: 45000,           // Increased timeout to 45 seconds
    maximumAge: 0,            // Don't use cached location
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (coords1, coords2) => {
    const [lng1, lat1] = coords1;
    const [lng2, lat2] = coords2;

    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const startLocationTracking = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });

        if (permission.state === 'denied') {
          toast.error('Location access is denied. Please enable it in browser settings');
          return;
        }

        const handlePositionSuccess = (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const currentCoordinates = [longitude, latitude];
          const currentTime = Date.now();

          // Log the accuracy to determine if it's GPS
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters`);

          // If accuracy is too large, skip this update
          if (accuracy > 500) {
            console.log('Skipping update due to low accuracy');
            return;
          }

          // Check if the user has moved at least 30 meters
          if (lastCoordinates) {
            const distance = calculateDistance(lastCoordinates, currentCoordinates);
            if (distance < MIN_DISTANCE) {
              console.log('Skipping update due to minimal movement');
              return;
            }
          }

          // Rate limiting check (e.g., 5 seconds between updates)
          if (lastUpdate && currentTime - lastUpdate < RATE_LIMIT) {
            console.log('Skipping update due to rate limit');
            return;
          }

          // Dispatch location update
          dispatch(onLocationUpdate(currentCoordinates))
            .then(() => {
              setLastUpdate(currentTime);
              setLastCoordinates(currentCoordinates); // Save new coordinates
              console.log('Location updated successfully');
            })
            .catch((error) => {
              console.error('Location update error:', error);
              toast.error('Failed to update location');
            });
        };

        const handlePositionError = (error) => {
          console.error('Geolocation error:', error);
          if (error.code === error.TIMEOUT) {
            toast.error('Location request timed out. Retrying...');
            if (retryCount < RETRY_LIMIT) {
              retryCount++;
              startLocationTracking(); // Retry fetching the location
            } else {
              toast.error('Failed to get location after multiple attempts. Please try again.');
            }
          } else {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                toast.error('Location permission denied. Please enable location access.');
                break;
              case error.POSITION_UNAVAILABLE:
                toast.error('Location information unavailable.');
                break;
              default:
                toast.error('Error getting location.');
            }
          }
        };

        const id = navigator.geolocation.watchPosition(
          handlePositionSuccess,
          handlePositionError,
          positionOptions
        );

        setWatchId(id);
      } catch (error) {
        console.error('Location tracking error:', error);
        toast.error('Error setting up location tracking');
      }
    };

    startLocationTracking();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isAuthenticated, dispatch, onLocationUpdate, lastUpdate, lastCoordinates]);

  return null;
};

export default LocationTracker;
