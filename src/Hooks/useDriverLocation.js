// 2. useDriverLocation.js
import { useEffect } from 'react';
import { locationSocket } from '../utils/socket';

export const useDriverLocation = (jobId, driverId) => {
  useEffect(() => {
    if (jobId) {
      locationSocket.joinJobRoom(jobId);
      
      // Cleanup when component unmounts
      return () => {
        locationSocket.leaveJobRoom(jobId);
      };
    }
  }, [jobId]);

  // Function to emit location updates
  const emitLocation = (coordinates) => {
    if (jobId && driverId) {
      locationSocket.emitDriverLocation(coordinates, jobId, driverId);
    }
  };

  return { emitLocation };
};