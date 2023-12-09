import { initMap } from "./location";

import { isWithinGeofence, getUserLocation } from "./geofence";

// Function to load Google Maps API with your API key
export const loadGoogleMaps = (apiKey: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.defer = true;
    script.async = true;

    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps API failed to load.'));
      }
    };

    script.onerror = () => reject(new Error('Failed to load Google Maps API.'));
    document.head.appendChild(script);
  });
};

loadGoogleMaps('GOOGLE_API_KEY').then((googleMaps) => {
  // Initialize map
  initMap();

  // Function to check if the user's location is within the geofence
  document.getElementById("register-button")?.addEventListener("click", function () {
    // Fetch user's location and perform geofencing check
    getUserLocation()
      .then((userLocation) => {
        console.log('User location:', { userLocation, geofenceCoordinates });

        const isInside = isWithinGeofence(userLocation);

        if (isInside) {
          // Allow user to view registration form
          alert('You are within the valid zone.');
        } else {
          // Display message for users outside the valid zone
          alert('your are outside the valid zone.');
        }
      })
      .catch((error) => {
        console.error('Error fetching user location:', error);
        // Handle error fetching user location
      });
  });
}).catch((error) => {
  console.error('Error loading Google Maps API:', error);
  // Handle error loading Google Maps API
});