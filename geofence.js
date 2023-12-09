"use strict";
// geofencePlugin.ts
// Function to load Google Maps API with your API key
const loadGoogleMaps = (apiKey) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
        script.defer = true;
        script.async = true;
        script.onload = () => {
            if (window.google && window.google.maps) {
                resolve(window.google.maps);
            }
            else {
                reject(new Error('Google Maps API failed to load.'));
            }
        };
        script.onerror = () => reject(new Error('Failed to load Google Maps API.'));
        document.head.appendChild(script);
    });
};
// Define geofence coordinates
const geofenceCoordinates = [
    {
        lng: -149.9041557,
        lat: 61.2190324
    },
    {
        lng: -149.8588371,
        lat: 61.2187845
    },
    {
        lng: -149.8542023,
        lat: 61.1877758
    },
    {
        lng: -149.9093056,
        lat: 61.1876103
    },
    {
        lng: -149.9038124,
        lat: 61.2191977
    }
    // Add more coordinates as needed for your geofence zones
];
// Function to check if the user's location is within the geofence
const isWithinGeofence = (userLocation) => {
    const isWithin = geofenceCoordinates.some((coordinate) => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(userLocation.lat, userLocation.lng), new google.maps.LatLng(coordinate.lat, coordinate.lng));
        return distance <= 1000; // Example: Check if within 1000 meters (adjust as needed)
    });
    return isWithin;
};
// Function to fetch user's location
const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                resolve(userLocation);
            }, (error) => {
                reject(error);
            });
        }
        else {
            reject('Geolocation is not supported by this browser.');
        }
    });
};
// Usage example:
const apiKey = 'GOOGLE API KEY'; // Replace with your API key
loadGoogleMaps(apiKey)
    .then(() => {
    // Map loaded, perform additional actions if needed
    // Fetch user's location and perform geofencing check
    getUserLocation()
        .then((userLocation) => {
        const isInside = isWithinGeofence(userLocation);
        if (isInside) {
            // Allow user to view registration form
            alert('You are within the valid zone.');
            // Display registration form or relevant content
        }
        else {
            // Display message for users outside the valid zone
            alert('your are outside the valid zone.');
            // Display message for attendees only
        }
    })
        .catch((error) => {
        console.error('Error fetching user location:', error);
        // Handle error fetching user location
    });
})
    .catch((error) => {
    console.error('Error loading Google Maps:', error);
    // Handle error loading Google Maps
});
