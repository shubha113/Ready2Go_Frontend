import { useEffect, useCallback } from 'react';
import { locationSocket } from '../../utils/socket';

const DriverLocationEmitter = ({ jobId, driverId }) => {
  const emitLocation = useCallback(async (position) => {
    const coordinates = [position.coords.longitude, position.coords.latitude];
    locationSocket.emitDriverLocation(coordinates, jobId, driverId);
  }, [jobId, driverId]);

  const handleError = (error) => {
    console.error('Error getting location:', error);
  };

  useEffect(() => {
    let watchId;
    if (jobId && driverId) {
      // Watch position with high accuracy
      watchId = navigator.geolocation.watchPosition(
        emitLocation,
        handleError,
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [jobId, driverId, emitLocation]);

  return null; // This is a utility component, no UI needed
};

export default DriverLocationEmitter;
