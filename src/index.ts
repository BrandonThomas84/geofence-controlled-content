// the max distance in meters that the user can be from the geofence
const maxDistance = 50;

// map zoom level (higher is closer)
const mapZoomLevel = 12;

// Define map center
// Alaska
// const validCenter: google.maps.LatLngLiteral = {
//   lng: -149.88937704734846,
//   lat: 61.21683034247154
// };
// Chico
const validCenter: google.maps.LatLngLiteral = {
  lng: -121.81460576381872,
  lat: 39.75632866893142
};

// Define geofence coordinates
//Alasks
// const mapCoordinates: google.maps.LatLngLiteral[] = [
//   {
//     lng: -149.9041557,
//     lat: 61.2190324
//   },
//   {
//     lng: -149.8588371,
//     lat: 61.2187845
//   },
//   {
//     lng: -149.8542023,
//     lat: 61.1877758
//   },
//   {
//     lng: -149.9093056,
//     lat: 61.1876103
//   },
//   {
//     lng: -149.9041557,
//     lat: 61.2190324
//   }
// ];
// Chico
const mapCoordinates: google.maps.LatLngLiteral[] = [
  {
    lng: -121.8198209,
    lat: 39.7573026
  },
  {
    lng: -121.8166841,
    lat: 39.7573109
  },
  {
    lng: -121.816491,
    lat: 39.7553726
  },
  {
    lng: -121.8166464,
    lat: 39.7553231
  },
  {
    lng: -121.8198316,
    lat: 39.7551829
  },
  {
    lng: -121.8198531,
    lat: 39.7572944
  }
];

let map: google.maps.Map;

async function initMap(): Promise<void> {
  getUserLocation().then((userLocation) => {
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: userLocation,
      zoom: mapZoomLevel,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    new google.maps.Polygon({
      paths: mapCoordinates,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map
    });

    new google.maps.Marker({
      position: userLocation,
      label: {
        text: 'You are here',
        className: 'marker-label',
      },
      map: map,
    });
  });
};

async function getUserLocation(): Promise<google.maps.LatLngLiteral> {
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

function isWithinGeofence(userLocation: google.maps.LatLngLiteral): boolean {
  return google.maps.geometry.poly.containsLocation(
    userLocation,
    new google.maps.Polygon({ paths: mapCoordinates })
  );
};

function handleRegisterClick(): void {
  getUserLocation().then((userLocation) => {
    const isInside = isWithinGeofence(userLocation);

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

document.getElementById("register-button")?.addEventListener(
  "click", () => { handleRegisterClick(); }
);

window.initMap = initMap;