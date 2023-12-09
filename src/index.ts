// the map that will be used to display the example
let map: google.maps.Map;

// map zoom level (higher is closer)
const mapZoomLevel = 15;

// geofences
const geofences: Map<string, google.maps.LatLngLiteral[]> = new Map();
geofences.set("Alaska", [
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
]);
geofences.set("Chico", [
  {
    lng: -121.8198209,
    lat: 39.7573026
  },
  {
    lng: -121.8141542,
    lat: 39.7574181
  },
  {
    lng: -121.8140566,
    lat: 39.7553479
  },
  {
    lng: -121.8198316,
    lat: 39.7551829
  },
  {
    lng: -121.8198209,
    lat: 39.7573026
  }
]);
geofences.set("Paradise", [
  {
    lng: -121.597248,
    lat: 39.7652903
  },
  {
    lng: -121.5960254,
    lat: 39.7652861
  },
  {
    lng: -121.5959772,
    lat: 39.7642821
  },
  {
    lng: -121.5972293,
    lat: 39.7643151
  },
  {
    lng: -121.597248,
    lat: 39.7652903
  }
]);

/**
 * Initializes the map
 * @returns A promise that resolves when the map is initialized
 */
async function initMap(): Promise<void> {
  getUserLocation().then((userLocation) => {
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: userLocation,
      zoom: mapZoomLevel,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    new google.maps.Marker({
      position: userLocation,
      label: {
        text: 'You are here',
        className: 'marker-label',
      },
      map: map,
    });

    geofences.forEach((geofence) => {
      // set color for polygon
      const color = getRandomColor();

      // add polygon to map
      new google.maps.Polygon({
        paths: geofence,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        map: map
      });
    });
  });
};

/**
 * Fetches the users location using the browser's geolocation API
 * @returns The users location
 */
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

/**
 * Generates a random color
 * @returns A random color
 */
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Checks if the user is within any of the geofences
 * @param userLocation The users location
 * @returns true if the user is within any of the geofences
 */
function isWithinGeofence(userLocation: google.maps.LatLngLiteral): boolean {
  let isInside = false;
  geofences.forEach((geofence, region) => {
    if (!isInside) {
      console.info(`checking if user is in region: ${region}`);
      isInside = google.maps.geometry.poly.containsLocation(
        userLocation,
        new google.maps.Polygon({ paths: geofence })
      );
    }
  });
  return isInside;
};

/**
 * Handles the button click. 
 * If you are copying this code, you will want to replace this with your own logic.
 */
function handleButtonClick(): void {
  const success = document.getElementById("success-message");
  success?.classList.add("hidden");

  const error = document.getElementById("error-message");
  error?.classList.add("hidden");

  getUserLocation().then((userLocation) => {
    if (isWithinGeofence(userLocation)) {
      success?.classList.remove("hidden");
    } else {
      error?.classList.remove("hidden");
    }
  }).catch((error) => {
    console.error('Error fetching user location:', error);
  });
};

/**
 * Fetches the users IP address from Amazon
 * This is only being used as a way to limit the API calls to the Google Maps API
 */
function setIPFromCloudflare(): void {
  fetch("https://www.cloudflare.com/cdn-cgi/trace").then((res) => {
    res.text().then((text) => {
      const ip = text.split("\n")[2].split("=")[1];
      const ipElement = document.getElementById("ip");
      if (ipElement) {
        ipElement.innerText = ip;
      }
      const ipOuterElement = document.getElementById("ip-outer");
      if (ipOuterElement) {
        ipOuterElement.classList.remove("hidden");
      }
    });
  }).catch((error) => {
    console.error('Failed to fetch the users IP', { error });
    const ipOuterElement = document.getElementById("ip-fail");
    if (ipOuterElement) {
      ipOuterElement.classList.remove("hidden");
    }
  });
};

// Add event listener to button
document.getElementById("button")?.addEventListener(
  "click", () => { handleButtonClick(); }
);

// Add callback to the window so that the Google Maps API can call it after it loads
window.initMap = initMap;

// Get the users IP address and display it to them
setIPFromCloudflare();