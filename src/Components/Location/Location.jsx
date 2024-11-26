import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { locationSocket } from '../../utils/socket';

const Location = ({ isAuthenticated, jobId, driverId }) => {
  const [watchId, setWatchId] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [lastCoordinates, setLastCoordinates] = useState(null);

  const MIN_DISTANCE = 30;
  const RATE_LIMIT = 5000; 

  const calculateDistance = (coords1, coords2) => {
    const [lon1, lat1] = coords1;
    const [lon2, lat2] = coords2;
    
    const R = 6371;
    
    const dLat = (lat2 - lat1) * (Math.PI/180);
    const dLon = (lon2 - lon1) * (Math.PI/180);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Convert to meters
  };

  const positionOptions = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0,
  };

  useEffect(() => {
    if (!isAuthenticated || !driverId) return;

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

          console.log('Current position:', {
            coordinates: currentCoordinates,
            accuracy,
            timestamp: new Date(currentTime).toISOString()
          });

          if (lastCoordinates) {
            const distance = calculateDistance(lastCoordinates, currentCoordinates);
            console.log(`Distance from last update: ${distance}m`);
            
            if (distance < MIN_DISTANCE) {
              console.log(`Movement (${distance}m) below minimum threshold (${MIN_DISTANCE}m)`);
              return;
            }
          }

          if (lastUpdate && currentTime - lastUpdate < RATE_LIMIT) {
            console.log(`Update too soon. Time since last update: ${currentTime - lastUpdate}ms`);
            return;
          }

          // Emit location via socket
          if (jobId && driverId) {
            locationSocket.emitDriverLocation(currentCoordinates, jobId, driverId);
            
            // Update local state for tracking
            setLastUpdate(currentTime);
            setLastCoordinates(currentCoordinates);
          }
        };

        const handlePositionError = (error) => {
          console.error('Geolocation error:', error);
        };

        const id = navigator.geolocation.watchPosition(
          handlePositionSuccess,
          handlePositionError,
          positionOptions
        );

        setWatchId(id);
      } catch (error) {
        console.error('Location tracking error:', error);
      }
    };

    startLocationTracking();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isAuthenticated, driverId, jobId, lastUpdate, lastCoordinates]);
  

  return null;
};

export default Location;