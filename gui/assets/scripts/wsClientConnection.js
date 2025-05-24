
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
   
    };


window.handleUpdateCoordinates = function(buoyid,lat, lon){

    
}


// Every message sent from the server trigger the function 
socket.onmessage = function(event) {

    try {

        // try to parse the JSON and check if the data is valid
        const data = JSON.parse(event.data);

        if (data.BuoyId!== undefined && data.Lat !== undefined && data.Lon !== undefined) {

            if (window.actualBuoys.includes(BuoyId)){

                handleUpdateCoordinates(data.BuoyId, data.Lat, data.Lon);

            }else{

                 // iff the data is valid, add the new buoy marker to the map using the function
                window.handleNewCoordinates(data.BuoyId, data.Lat, data.Lon);

            }
        }
    } catch (err) {
        console.error('Error detected during message parsing:', event.data);
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
