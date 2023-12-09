// the max distance in meters that the user can be from the geofence
const maxDistance = 100;

const mapCenter: google.maps.LatLngLiteral = {
  lng: -149.88937704734846,
  lat: 61.21683034247154
};

// Define geofence coordinates
const mapCoordinates: google.maps.LatLngLiteral[] = [
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
    lng: -149.9041557,
    lat: 61.2190324
  }
];

export class ExampleMapControl {
  constructor() {
    document.getElementById("register-button")?.addEventListener(
      "click", () => { this.handleRegisterClick(); }
    );
  }

  isWithinGeofence = (userLocation: google.maps.LatLngLiteral): boolean => {
    const isWithin = mapCoordinates.every((coordinate) => {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(userLocation.lat, userLocation.lng),
        new google.maps.LatLng(coordinate.lat, coordinate.lng)
      );

      console.log('Distance:', distance);
      return distance <= maxDistance; // Example: Check if within 1000 meters (adjust as needed)
    });

    return isWithin;
  };

  getUserLocation = (): Promise<google.maps.LatLngLiteral> => {
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

  handleRegisterClick = (): void => {
    this.getUserLocation().then((userLocation) => {
      const isInside = this.isWithinGeofence(userLocation);

      console.log('User location:', { userLocation, mapCoordinates, isInside });

      const output = document.getElementById("info-content");

      if (isInside) {
        output ? output.innerText = "You are within the valid zone." : null;
        alert('You are within the valid zone.');
      } else {
        output ? output.innerText = "You are NOT WITHIN the valid zone." : null;
        alert('your are outside the valid zone.');
      }
    })
      .catch((error) => {
        console.error('Error fetching user location:', error);
      });
  };
}

async function initMap(): Promise<void> {
  const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    center: mapCenter,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  var polygon = new google.maps.Polygon({
    paths: mapCoordinates,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  });

  polygon.setMap(map);

  new ExampleMapControl();
};

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;