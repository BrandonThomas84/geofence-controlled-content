export async function initMap(): Promise<void> {
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const useMap = new Map(document.getElementById("required-location-map") as HTMLElement, {
    center: { lat: -149.88937704734846, lng: 61.21683034247154 },
    zoom: 8,
  });

  const coordinates = [
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
  ];

  var polygon = new google.maps.Polygon({
    paths: coordinates,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  });

  polygon.setMap(useMap);
};
