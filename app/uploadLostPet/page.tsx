// ... existing code ...

    mapRef.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;
      
      try {
        // Reverse geocoding to get human-readable location
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        
        // Get the most relevant place name from the response
        const placeName = data.features[0]?.place_name || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;

        setFormData((prev) => ({
          ...prev,
          lastSeen: placeName,
          location: { lat, lng },
        }));

        if (markerRef.current) markerRef.current.remove();
        markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
      } catch (error) {
        console.error('Error getting location name:', error);
        // Fallback to coordinates if reverse geocoding fails
        setFormData((prev) => ({
          ...prev,
          lastSeen: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`,
          location: { lat, lng },
        }));
      }
    });

// ... rest of the existing code ...