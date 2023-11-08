let markers = []
let map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19,}).addTo(map);

// відслідковування в реальному часі
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        L.control
            .locate({locateOptions:{enableHighAccuracy: true, }})
            .addTo(map)
        map.setView([lat, lon], 10)
    }, displayError);
} else {
    alert('Геолокація не підтримується браузером.');
}
// функція обробки помилок
function displayError(error){
    const errorTypes = {
        0: 'Unknown error',
        1: 'Permission denied by user',
        2: 'Position is not available',
        3: 'Request times out'
    };
    const errorMessage = errorTypes[error.code];
    if (error.code == 0 || error.code == 2){
        let errorMessage = errorMessage + ' ' + error.message;
    }
    let div = document.getElementById('map')
    div.innerHTML = errorMessage
}

// метод відслідковування в реальному часі з маркерами
markUpdate()
setInterval('markUpdate()', 10000)
function markUpdate(){
    map.locate();
    if (navigator.geolocation){
    map.on("locationfound", function (e) {
        let popup = L.popup().setContent(`Lat: ${e.latlng.lat}, Lng: ${e.latlng.lng}, Timestamp: ${new Date(e.timestamp)}`);
        let marker = L.marker(e.latlng).bindPopup(popup);
        marker.addTo(map);
        markers.push(marker);
    });}
else{
    alert('Геолокація не підтримується браузером.');
}}


let go = document.getElementById('go');
go.addEventListener("click", () => {
    let ltt = parseFloat(document.getElementById('latitude').value);
    let lnt = parseFloat(document.getElementById('longitude').value);

    // Перевіряємо наявність маркера з такими координатами


    if (markers.find(marker => marker.getLatLng().lat === ltt && marker.getLatLng().lng === lnt)) {
        map.setView(existingMarker.getLatLng(), 10);
    } else {
        let marker = L.marker([ltt, lnt])
            .addTo(map)
            .bindPopup(`Позиція пункту призначення: ${ltt}, ${lnt}`)
            .openPopup();
        map.setView([ltt, lnt], 10);
        markers.push(marker);
    }
});

map.on('click', onMapClick);
function onMapClick(e){
    let div = document.getElementById('coords-info')
    let message = e.latlng.toString().slice(7, -1)
    div.innerText = `Ви натиснули на точку з координатами ${message}`
}
