// Function to check if the user's location is within the geofence
export const isWithinGeofence = (userLocation: { lat: number; lng: number }): boolean => {
  const isWithin = geofenceCoordinates.every((coordinate) => {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(userLocation.lat, userLocation.lng),
      new google.maps.LatLng(coordinate.lat, coordinate.lng)
    );

    console.log('Distance:', distance);
    return distance <= maxDistance; // Example: Check if within 1000 meters (adjust as needed)
  });

  return isWithin;
};

// Function to fetch user's location
export const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(userLocation);
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject('Geolocation is not supported by this browser.');
    }
  });
};