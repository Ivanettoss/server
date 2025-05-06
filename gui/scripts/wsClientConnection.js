
// Inizialize the connection to the Host
const socket = new WebSocket('ws://localhost:8080');

// Callable by the html file 
window.handleNewCoordinates = function(lat, lon) {
    if (!isNaN(lat) && !isNaN(lon)) {
        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`Lat: ${lat}<br>Lon: ${lon}`).openPopup();
    } else {
        console.error('Coordinate non valide:', lat, lon);
    }
};


// Every message sent from the server trigger the function 
socket.onmessage = function(event) {

    try {

        // try to parse the JSON and check if the data is valid
        const data = JSON.parse(event.data);
        if (data.Lat !== undefined && data.Lon !== undefined) {

            // iff the data is valid, add the marker to the map using the function
            window.handleNewCoordinates(data.Lat, data.Lon);
        }
    } catch (err) {
        console.error('Error detected during message parsing:', event.data);
    }
};

socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};

socket.onopen = function() {
    console.log('WebSocket conection established.');
};

socket.onclose = function() {
    console.log('WebSocket connecion closed.');
};
