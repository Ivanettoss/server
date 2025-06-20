
// Inizialize the connection to the Host
const socket = new WebSocket('ws://localhost:8080');

// Callable by the html file to add a marker to the map
window.handleNewCoordinates = function(buoyid,lat, lon) {

        const newBuoy = L.circleMarker([lat, lon], {
            radius: 6, 
            color: '#0055aa', 
            fillColor: '#0055aa', 
            fillOpacity: 0.8,
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
    
        // Draw the pathline between the old and new position
        const traceLine = L.polyline([[oldBuoyData.lat,oldBuoyData.lon], [lat, lon]], {
            color: 'gray',
            weight: 2,
            dashArray: '5, 5',
            opacity: 0.7,
            className: 'trace-line'
        }).addTo(map);
    
        //  Create the marker for the new position
        const newMarker = L.circleMarker([lat, lon], {
            radius: 6,
            color: '#0055aa',       
            fillColor: '#0055aa',
            fillOpacity: 0.8,
            class: 'dynamic',
            id: buoyid
        }).addTo(map);
    
        // New marker events
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

        
        newMarker.on("click", function(e) {
            showBuoyInfo(buoyid, e.latlng);
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
