function insertBuoyData(){

    const buoyId=prompt("Insert the buoyId")
    if (!buoyId){
        alert("Missing Id, you can't proceed")
    }

    const latitude=prompt("Insert the buoy latitude")
    const longitude=prompt("Insert the buoy longitude")

    console.log("latitude"+latitude)
    console.log("longitude"+longitude)

    const valid = checkCoordinates(latitude,longitude)

    if (!valid){
        return 
    }

    createNewBuoyOnMap(buoyId,latitude,longitude)
    alert("Buoy inserted successfully")




}

function checkCoordinates(lat,long){

    if (isNaN(lat) || lat < -90 || lat > 90) {
        alert("Latitude not valid");
        return false;
      }
    
    if (isNaN(long) || long < -180 || long > 180) {
        alert("Longitude not valid");
        return false;
      }
    
    return true 
    
}



function createNewBuoyOnMap(nid,lat,long)
{   
    var newBuoy = L.circleMarker([lat, long ], {
        id:nid,
        color: 'yellow',
        fillColor: 'yellow',
        fillOpacity:1,
        radius:6,
        class:'stationary'
    }).addTo(map);

    newBuoy.on("mouseover", function(e){
        var latlng = e.latlng;  // get the lat and long of the device 
        L.popup()
        .setLatLng(latlng)   
        .setContent("buoy id:"+nid) 
        .openOn(map);        
});

    newBuoy.on("mouseout", function() {
    map.closePopup(); 
});

  newBuoy.on("click", function(e) {
            showBuoyInfo(nid, e.latlng);
        });

window.actualBuoys[nid]={
        lat:lat,
        long:long,
        marker: newBuoy,
        type:"stationary"
     }
}