
// Inizialize the connection to the Host
const socket = new WebSocket('ws://localhost:8080');

// Callable by the html file to add a marker to the map
window.handleNewCoordinates = function(buoyid,lat, lon) {

        const newBuoy = L.circleMarker([lat, lon], {
            radius: 6, 
            color: '#001f3f', 
            fillColor: '#001f3f', 
            fillOpacity: 1,
            class:'dynamic',
            id:buoyid
        }).addTo(map);


        newBuoy.on("mouseover", function(e){
            var latlng = e.latlng;  // get the lat and long of the device 
            var popup1 = L.popup()
            .setLatLng(latlng)   // set the Lat and Long of the popup
            .setContent('Buoy 1')  // Popup text
            .openOn(map);        
        });

        newBuoy.on("mouseout", function() {
            map.closePopup(); 
        });

            // Store the buoy's coordinates
        window.actualBuoys[buoyid] = { lat: lat, lon: lon,marker:newBuoy, type:'dynamic' };
    };


window.handleUpdateCoordinates = function(buoyid,lat, lon){
    
            const oldBuoyData = window.actualBuoys[buoyid];
           

        if (oldBuoyData.marker) {
            map.removeLayer(oldBuoyData.marker);
        }
    
        // Disegna il "trattino" tra vecchia e nuova posizione
        const traceLine = L.polyline([[oldBuoyData.lat,oldBuoyData.lon], [lat, lon]], {
            color: 'gray',
            weight: 2,
            dashArray: '5, 5',
            opacity: 0.7,
            className: 'trace-line'
        }).addTo(map);
    
        // 🔹 Create the marker for the new position
        const newMarker = L.circleMarker([lat, lon], {
            radius: 6,
            color: '#FF4136',       // Rosso acceso per indicare l'attuale posizione
            fillColor: '#FF4136',
            fillOpacity: 1,
            class: 'dynamic',
            id: buoyid
        }).addTo(map);
    
        // Eventi del marker nuovo
        newMarker.on("mouseover", function(e) {
            const latlng = e.latlng;
            const popup = L.popup()
                .setLatLng(latlng)
                .setContent(`Buoy ${buoyid}`)
                .openOn(map);
        });
    
        newMarker.on("mouseout", function() {
            map.closePopup();
        });
    
        // update the position 
        window.actualBuoys[buoyid] = {
            lat: lat,
            lon: lon,
            marker: newMarker
        };
    };
    
 


// Every message sent from the server trigger the function 
socket.onmessage = function(event) {

    try {

        // try to parse the JSON and check if the data is valid
        const data = JSON.parse(event.data);

        if (data.BuoyId!== undefined && data.Lat !== undefined && data.Lon !== undefined) {

            if ( data.BuoyId in window.actualBuoys ){

                handleUpdateCoordinates(data.BuoyId, data.Lat, data.Lon);

            }else{

                 // iff the data is valid, add the new buoy marker to the map using the function
                window.handleNewCoordinates(data.BuoyId, data.Lat, data.Lon);

            }
        }
    } catch (err) {
        console.error('Error detected during message parsing:', event.data, err);
    }
};

socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};

socket.onopen = function() {
    console.log('WebSocket connection established.');
};

socket.onclose = function() {
    console.log('WebSocket connecion closed.');
};
