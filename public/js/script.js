const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (postion) => {
      const { latitude, longitude } = postion.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (err) => {
      console.error(err);
    },
    {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "G(ourav)Map",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data)=>{
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if(markers[id])
    {
        markers[id].setLatLng([latitude, longitude]);
    }
    else
    {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})