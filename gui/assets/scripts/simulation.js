// Define 2 personalized icon and add them to the map 

function startSimulation(){

    var titanic = L.icon({
        iconUrl: 'assets/icon/ship.png',
        iconSize: [60, 55],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
    });
    
    var marker1 = L.marker([42.011880, 11.927482], {icon: titanic}).addTo(map);
    marker1.on("mouseover", function(e){
                var latlng = e.latlng;  
                var popup4 = L.popup()
                .setLatLng(latlng)   
                .setContent('titanic ' + latlng)  
                .openOn(map);       
        });
    
        marker1.on("mouseout", function() {
        map.closePopup(); 
    });



    var iceberg = L.icon({
        iconUrl: 'assets/icon/iceberg.png',
        iconSize: [40, 35],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
    });
    
    var marker2 = L.marker([42.012851, 11.881017], {icon: iceberg}).addTo(map);
    marker2.on("mouseover", function(e){
                var latlng = e.latlng;  
                var popup4 = L.popup()
                .setLatLng(latlng)   
                .setContent('iceberg ' + latlng)  
                .openOn(map);       
        });
    
        marker2.on("mouseout", function() {
        map.closePopup(); 
    });

    document.getElementById("distance-p").style.display = "block";

    let cTitanic = marker1.latlng
    let cIceberg = marker2.latlng

    animateTitanic(marker1,marker2);



}


function animateTitanic(marker1,marker2) {
    
    var startLatLng = marker1.getLatLng();  // Posizione di partenza
    var endLatLng = marker2.getLatLng();    // Posizione di arrivo

    // Calcola il numero di passiassets/scripts/ per il movimento (per esempio, 100 passi)

    var steps = 100;
    var stepLat = (endLatLng.lat - startLatLng.lat) / steps;
    var stepLng = (endLatLng.lng - startLatLng.lng) / steps;

    var currentStep = 0;

    let liveDistance = distanceCalculation(startLatLng,endLatLng).toFixed(4)
    
    function moveTitanic() {
        
        document.getElementById('distance-live').textContent = liveDistance;

        if (currentStep <= steps) {
            var newLat = startLatLng.lat + (stepLat * currentStep);
            var newLng = startLatLng.lng + (stepLng * currentStep);
            marker1.setLatLng([newLat, newLng]);
            currentStep++;
        } else {

            clearInterval(animationInterval);
            console.log('Titanic ha raggiunto l\'iceberg!');
        }
        currentLatLng=marker1.getLatLng()
        console.log("pre-live distanc eupdate")
        console.log(currentLatLng)
        liveDistance = distanceCalculation(currentLatLng,endLatLng).toFixed(4)
    }



    // Imposta l'animazione per ogni 50ms (spostamenti più veloci o lenti)
    var animationInterval = setInterval(moveTitanic, 100);
}

