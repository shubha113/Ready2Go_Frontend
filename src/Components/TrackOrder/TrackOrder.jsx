import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { locationSocket } from '../../utils/socket';
import { MapPin, Package, Truck } from 'lucide-react';
import { driverHistory, userHistory } from '../../Redux/actions/jobAction';
import Navbar from '../Auth/Shared/Navbar';
import './TrackOrder.css';

const TrackOrder = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch(); 
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const routeRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [isDriverMoving, setIsDriverMoving] = useState(false);
  const [eta, setEta] = useState(null);
  const [locationError, setLocationError] = useState(null);

  
  const { user, isAuthenticated } = useSelector(state => state.user);

  const { ongoingDeliveries, loading, error } = useSelector(state => state.job);
  const job = ongoingDeliveries?.find(delivery => delivery._id === jobId);


  useEffect(() => {
    // Always check for authentication first
    if (!isAuthenticated) return;
  
    // Then dispatch based on user role
    if (user?.role === "driver") {
      dispatch(driverHistory());
    } else if (user?.role === "user") {
      dispatch(userHistory());
    }
  }, [dispatch, user?.role, isAuthenticated]);


  useEffect(() => {
    console.log('=== Job Debug ===');
    console.log('Full Job Object:', job);
    console.log('Assigned To:', job?.assignedTo);
    console.log('Driver Location:', job?.assignedTo?.location);

    // If job is not found and not loading, dispatch appropriate history action
    if (!job && !loading) {
      if (user?.role === 'user') {
        dispatch(userHistory());
      } else if (user?.role === 'driver') {
        dispatch(driverHistory());
      }
    }
  }, [job, loading, dispatch, user?.role]);

 
  // Debug function to log coordinates
  const debugCoordinates = (label, location) => {
    console.log(`=== ${label} ===`);
    console.log('Raw location:', location);
    if (location?.coordinates) {
      console.log('Coordinates:', location.coordinates);
      console.log('Parsed:', parseCoordinates(location));
    }
  };

  const parseCoordinates = (location) => {
    try {
      console.log('=== Detailed Location Debug ===');
      console.log('Full location object:', location);
  
      // Handle location with Point type from User model
      if (location && location.type === 'Point' && Array.isArray(location.coordinates)) {
        const [longitude, latitude] = location.coordinates;
        console.log('Parsed Point coordinates:', { latitude, longitude });
        return validateAndReturnCoordinates(latitude, longitude);
      }
  
      // Handle coordinates array directly
      if (location && Array.isArray(location.coordinates)) {
        const [longitude, latitude] = location.coordinates;
        return validateAndReturnCoordinates(latitude, longitude);
      }
  
      // Handle direct coordinates array
      if (Array.isArray(location)) {
        const [longitude, latitude] = location;
        return validateAndReturnCoordinates(latitude, longitude);
      }
  
      console.log('Invalid coordinates format:', location);
      throw new Error('Invalid coordinates format');
    } catch (error) {
      console.error('Coordinate parsing error:', error);
      setLocationError(`Location error: ${error.message}`);
      return null;
    }
  };
  
  const validateAndReturnCoordinates = (latitude, longitude) => {
    console.log('Validating coordinates:', { latitude, longitude });
    
    if (typeof latitude !== 'number' || typeof longitude !== 'number' ||
        isNaN(latitude) || isNaN(longitude) ||
        latitude < -90 || latitude > 90 || 
        longitude < -180 || longitude > 180) {
      throw new Error(`Invalid coordinate values: lat=${latitude}, lng=${longitude}`);
    }
    return { lat: latitude, lng: longitude };
  };

  useEffect(() => {
    if (!ongoingDeliveries?.length) {
      dispatch(userHistory());
    }
  }, [dispatch, ongoingDeliveries?.length]);

  const createCustomMarker = (position, iconType, color, title) => {
    const svgPaths = {
      pickup: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        dropoff: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        driver: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.5-9.5H4V9h5.5V9zm2.5 0h-1.5V9H16v-.5zm3.5 9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'
    };

    const svgMarker = {
      path: svgPaths[iconType],
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 1,
      strokeColor: '#FFFFFF',
      scale: 1.5,
      anchor: new google.maps.Point(12, 24)
    };

    const marker = new google.maps.Marker({
      position,
      icon: svgMarker,
      title,
      animation: iconType === 'driver' ? google.maps.Animation.DROP : null
    });

    if (iconType === 'driver') {
      const pulseAnimation = () => {
        const icon = marker.getIcon();
        icon.scale = isDriverMoving ? 1.8 : 1.5;
        marker.setIcon(icon);
        setTimeout(() => {
          icon.scale = 1.5;
          marker.setIcon(icon);
        }, 150);
      };

      if (isDriverMoving) {
        setInterval(pulseAnimation, 1500);
      }
    }

    return marker;
  };

  const displayRoute = async () => {
    if (!directionsService || !directionsRenderer || !job) return;

    const pickupCoords = parseCoordinates(job.pickupLocation);
    const dropCoords = parseCoordinates(job.dropLocation);

    if (!pickupCoords || !dropCoords) {
      setLocationError('Invalid coordinates for route');
      return;
    }

    try {
      const result = await new Promise((resolve, reject) => {
        directionsService.route({
          origin: pickupCoords,
          destination: dropCoords,
          travelMode: google.maps.TravelMode.DRIVING,
        }, (response, status) => {
          if (status === 'OK') resolve(response);
          else reject(status);
        });
      });

      directionsRenderer.setDirections(result);
      routeRef.current = result;
    } catch (error) {
      setLocationError(`Error displaying route: ${error}`);
    }
  };

  const updateRouteWithDriverLocation = async (driverPos) => {
    if (!directionsService || !directionsRenderer || !job || !driverPos) return;
  
    const pickupCoords = parseCoordinates(job.pickupLocation);
    const dropCoords = parseCoordinates(job.dropLocation);
  
    if (!pickupCoords || !dropCoords) return;
  
    try {
      // If the driver is not at the pickup location, show route from driver to pickup
      if (user?.role === 'driver') {
        const pickupRoute = await new Promise((resolve, reject) => {
          directionsService.route({
            origin: driverPos,
            destination: pickupCoords,
            travelMode: google.maps.TravelMode.DRIVING,
          }, (response, status) => {
            if (status === 'OK') resolve(response);
            else reject(status);
          });
        });
  
        // Display pickup route
        const pickupRenderer = new google.maps.DirectionsRenderer({
          map: mapInstanceRef.current,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#FF7900',
            strokeWeight: 3,
            strokeOpacity: 0.7
          }
        });
        pickupRenderer.setDirections(pickupRoute);
      }
  
      // Show route from pickup to drop location
      const dropRoute = await new Promise((resolve, reject) => {
        directionsService.route({
          origin: pickupCoords,
          destination: dropCoords,
          travelMode: google.maps.TravelMode.DRIVING,
        }, (response, status) => {
          if (status === 'OK') resolve(response);
          else reject(status);
        });
      });
  
      directionsRenderer.setDirections(dropRoute);
      routeRef.current = dropRoute;
  
      // Calculate and set ETA
      if (dropRoute.routes[0] && dropRoute.routes[0].legs[0]) {
        const duration = dropRoute.routes[0].legs[0].duration.text;
        setEta(duration);
      }
    } catch (error) {
      setLocationError(`Error updating route: ${error}`);
    }
  };

  useEffect(() => {
    if (!jobId || !job || !window.google || !mapRef.current || mapInstanceRef.current) return;

    // Debug logging for driver location
    const driverLocation = job.assignedTo?.location?.coordinates;
    console.log('=== Driver Location Debug ===');
    debugCoordinates('Driver Location', driverLocation);

    const pickupCoords = parseCoordinates(job.pickupLocation);
    if (!pickupCoords) {
      setLocationError('Invalid pickup coordinates');
      return;
    }

    const mapInstance = new google.maps.Map(mapRef.current, {
      zoom: 12,
      center: pickupCoords,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    const directionsServiceInstance = new google.maps.DirectionsService();
    const directionsRendererInstance = new google.maps.DirectionsRenderer({
      map: mapInstance,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#4A90E2',
        strokeWeight: 4
      }
    });

    setDirectionsService(directionsServiceInstance);
    setDirectionsRenderer(directionsRendererInstance);
    mapInstanceRef.current = mapInstance;

    const dropCoords = parseCoordinates(job.dropLocation);
    
    if (pickupCoords) {
      const pickupMarker = createCustomMarker(
        pickupCoords,
        'pickup',
        '#22C55E',
        'Pickup Location'
      );
      pickupMarker.setMap(mapInstance);
    }

    if (dropCoords) {
      const dropMarker = createCustomMarker(
        dropCoords,
        'dropoff',
        '#EF4444',
        'Drop Location'
      );
      dropMarker.setMap(mapInstance);
    }

    const initialDriverLocation = job.assignedTo?.location?.type === 'Point' 
    ? parseCoordinates(job.assignedTo.location) 
    : parseCoordinates(job.pickupLocation);

    if (initialDriverLocation) {
      const driverMarker = createCustomMarker(
        initialDriverLocation,
        'driver',
        '#6366F1',
        'Driver Location'
      );
      driverMarker.setMap(mapInstance);
      markerRef.current = driverMarker;
      setDriverLocation(initialDriverLocation);
      updateRouteWithDriverLocation(initialDriverLocation);
    }

    if (directionsServiceInstance && directionsRendererInstance) {
      displayRoute();
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (directionsRendererInstance) {
        directionsRendererInstance.setMap(null);
      }
      mapInstanceRef.current = null;
    };
  }, [jobId, job]);

  useEffect(() => {
    if (directionsService && directionsRenderer && job) {
      displayRoute();
    }
  }, [directionsService, directionsRenderer, job]);

  useEffect(() => {
    if (!jobId || !markerRef.current || !mapInstanceRef.current) return;

    locationSocket.joinJobRoom(jobId);
    
  locationSocket.subscribeToLocationUpdates((data) => {
    console.log('=== Full Location Update Data ===', data);
    console.log('Job ID:', jobId);
    console.log('Driver Location from Job:', job.assignedTo?.location?.coordinates);
      
      if (!markerRef.current || !data.coordinates) {
        console.log('Missing marker reference or coordinates');
        return;
      }

      const newPosition = Array.isArray(data.coordinates) ? 
        validateAndReturnCoordinates(data.coordinates[1], data.coordinates[0]) : null;
    
      console.log('Parsed new position:', newPosition);
    
      if (!newPosition) {
        console.log('Failed to parse new position');
        return;
      }

      if (driverLocation) {
        const start = driverLocation;
        const end = newPosition;
        animateMarker(start, end, markerRef.current);
      } else {
        markerRef.current.setPosition(newPosition);
        updateRouteWithDriverLocation(newPosition);
      }
  
      setDriverLocation(newPosition);  

      const bounds = mapInstanceRef.current.getBounds();
      if (bounds && !bounds.contains(newPosition)) {
        mapInstanceRef.current.panTo(newPosition);
      }
    });

    return () => {
      locationSocket.leaveJobRoom(jobId);
      locationSocket.unsubscribeFromLocationUpdates();
    };
  }, [jobId, driverLocation]);

  const animateMarker = (start, end, marker) => {
    let progress = 0;
    const duration = 1000;
    const startTime = Date.now();
  
    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);
  
      const current = {
        lat: start.lat + (end.lat - start.lat) * progress,
        lng: start.lng + (end.lng - start.lng) * progress
      };
  
      marker.setPosition(current);
  
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsDriverMoving(false);
        updateRouteWithDriverLocation(end);
      }
    };
  
    setIsDriverMoving(true);
    requestAnimationFrame(animate);
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!job) return <div className="error-container">Delivery not found</div>;



  return (
    <div className="tracking-container">
      <Navbar />
      <div className="tracking-content">
      <h1 className="tracking-title">Track Your {user?.role === 'driver' ? 'Delivery' : 'Order'}</h1>
        
        {locationError && (
          <div className="error-banner">
            {locationError}
          </div>
        )}

        <div className="order-details">
          <div className="detail-item">
            <strong>Order ID:</strong> {job._id}
          </div>
          <div className="detail-item">
            <strong>Status:</strong> 
            <span className={`status-badge ${job.status}`}>{job.status}</span>
          </div>
          <div className="detail-item">
            <strong>{user?.role === 'user' ? 'Driver' : 'Customer'}:</strong> 
            {user?.role === 'user' 
              ? (job.driverName || 'Not assigned') 
              : (job.userName || 'Customer not found')}
          </div>
          {eta && (
            <div className="detail-item">
              <strong>Estimated Time of Arrival:</strong> {eta}
            </div>
          )}
        </div>

        <div className="map-container">
          <div ref={mapRef} className="google-map" />
          
          <div className="map-legend">
            <div className="legend-item">
              <Truck className="legend-icon driver" />
              <span>Driver</span>
            </div>
            <div className="legend-item">
              <MapPin className="legend-icon pickup" />
              <span>Pickup</span>
            </div>
            <div className="legend-item">
              <MapPin color="red" className="legend-icon dropoff" />
              <span>Drop-off</span>
            </div>
          </div>
        </div>

        <div className="location-details">
          <div className="location-item">
            <MapPin className="location-icon pickup" />
            <div>
              <h3>Pickup Location</h3>
              <p>{job.pickupLocation.text}</p>
            </div>
          </div>
          <div className="location-item">
            <Package className="location-icon dropoff" />
            <div>
              <h3>Drop-off Location</h3>
              <p>{job.dropLocation.text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;