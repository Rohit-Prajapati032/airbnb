

let lat = listing.geometry.lat;
let lng = listing.geometry.lng;
console.log("lat", lat);

const map = L.map('map').setView([lat, lng], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

L.marker([lat, lng])
    .addTo(map)
    .bindPopup("Listing Location")
    .openPopup();

setTimeout(() => {
    map.invalidateSize();
}, 500);