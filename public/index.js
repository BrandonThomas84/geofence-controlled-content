"use strict";
// map zoom level (higher is closer)
const mapZoomLevel = 15;
// Define map center
// Alaska
// const mapCenter: google.maps.LatLngLiteral = {
//   lng: -149.88937704734846,
//   lat: 61.21683034247154
// };
// Chico
const mapCenter = {
    lng: -121.81460576381872,
    lat: 39.75632866893142
};
const geofences = new Map();
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
let map;
async function initMap() {
    getUserLocation().then((userLocation) => {
        map = new google.maps.Map(document.getElementById('map'), {
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
}
;
async function getUserLocation() {
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
}
;
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
;
function isWithinGeofence(userLocation) {
    let isInside = false;
    geofences.forEach((geofence, region) => {
        if (!isInside) {
            console.info(`checking if user is in region: ${region}`);
            isInside = google.maps.geometry.poly.containsLocation(userLocation, new google.maps.Polygon({ paths: geofence }));
        }
    });
    return isInside;
}
;
function handleRegisterClick() {
    const success = document.getElementById("success-message");
    success?.classList.add("hidden");
    const error = document.getElementById("error-message");
    error?.classList.add("hidden");
    getUserLocation().then((userLocation) => {
        if (isWithinGeofence(userLocation)) {
            success?.classList.remove("hidden");
        }
        else {
            error?.classList.remove("hidden");
        }
    }).catch((error) => {
        console.error('Error fetching user location:', error);
    });
}
;
document.getElementById("register-button")?.addEventListener("click", () => { handleRegisterClick(); });
window.initMap = initMap;
