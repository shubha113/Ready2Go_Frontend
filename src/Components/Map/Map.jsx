import React, { useRef, useEffect, useState } from 'react';

const GoogleMap = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const searchRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const autocompleteInstance = useRef(null);
  
  const [mapLocation, setMapLocation] = useState({
    latestAddress: '',
    placeDetails: null,
    latLng: null
  });

  // Initialize the map and autocomplete
  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 52.52, lng: 13.405 },
      zoom: 10,
    });
    mapInstance.current = map;

    // Initialize autocomplete with specific fields
    const autocomplete = new window.google.maps.places.Autocomplete(searchRef.current, {
      fields: ['formatted_address', 'geometry', 'name', 'address_components']
    });
    autocomplete.bindTo('bounds', map);
    autocompleteInstance.current = autocomplete;

    // Autocomplete place changed listener
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;
      
      // Update the map view
      const location = place.geometry.location;
      map.setCenter(location);
      map.setZoom(15);

      // Update marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      markerRef.current = new window.google.maps.Marker({
        position: location,
        map: map,
        animation: window.google.maps.Animation.DROP
      });

      // Create formatted address with business name if available
      let formattedAddress = place.formatted_address;
      if (place.name && !formattedAddress.startsWith(place.name)) {
        formattedAddress = `${place.name}, ${formattedAddress}`;
      }

      // Update state with latest address
      setMapLocation({
        latestAddress: formattedAddress,
        placeDetails: place,
        latLng: {
          lat: location.lat(),
          lng: location.lng()
        }
      });
      
      searchRef.current.value = formattedAddress;
    });

    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
      if (autocompleteInstance.current) {
        window.google.maps.event.clearListeners(autocompleteInstance.current, 'place_changed');
      }
    };
  }, []);

  // Handle searching for an address
  const handleSearchLocation = () => {
    const searchInput = searchRef.current.value;
    if (!searchInput) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        
        mapInstance.current.setCenter(location);
        mapInstance.current.setZoom(15);

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        markerRef.current = new window.google.maps.Marker({
          position: location,
          map: mapInstance.current,
          animation: window.google.maps.Animation.DROP
        });

        // Create formatted address
        const formattedAddress = results[0].formatted_address;
        
        // Update state
        setMapLocation({
          latestAddress: formattedAddress,
          latLng: {
            lat: location.lat(),
            lng: location.lng()
          }
        });
        
        searchRef.current.value = formattedAddress;
      }
    });
  };

  // Handle map click for pinning location
  useEffect(() => {
    if (!mapInstance.current) return;

    const map = mapInstance.current;

    const handleMapClick = (event) => {
      const location = event.latLng;

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      markerRef.current = new window.google.maps.Marker({
        position: location,
        map,
        animation: window.google.maps.Animation.DROP
      });

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const mapClickedAddress = results[0].formatted_address;
          
          // Update state with map clicked address
          setMapLocation({
            latestAddress: mapClickedAddress,
            latLng: {
              lat: location.lat(),
              lng: location.lng()
            }
          });
          
          searchRef.current.value = mapClickedAddress;
        }
      });
    };

    map.addListener('click', handleMapClick);

    return () => {
      window.google.maps.event.clearListeners(map, 'click');
    };
  }, []);

  // Handle confirming the selected location
  const handleConfirmLocation = () => {
    const { latestAddress, placeDetails, latLng } = mapLocation;
    
    if (latestAddress) {
      // Prefer latest address 
      let finalAddress = latestAddress;
      
      // If there's a place name and it's not in the address, prepend it
      if (placeDetails?.name && !finalAddress.includes(placeDetails.name)) {
        finalAddress = `${placeDetails.name}, ${finalAddress}`;
      }
      
      // Pass both address and coordinates
      onLocationSelect(finalAddress, latLng);
    }
  };

  return (
    <div className="map-container1" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          ref={searchRef}
          placeholder="Search for a location"
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={handleSearchLocation}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>
      <div ref={mapRef} style={{ width: '100%', height: '400px', marginBottom: '10px' }} />
      <button
        onClick={handleConfirmLocation}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Confirm Location
      </button>
    </div>
  );
};

export default GoogleMap;