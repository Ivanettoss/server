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



function createNewBuoyOnMap(id,lat,long)
{   
    newcolor=getRandomColor()
    var newBuoy = L.circle([lat, long ], {
        color: newcolor,
        fillColor: newcolor,
        radius: 50    // radious of the circle in meters 
    }).addTo(map);

    newBuoy.on("mouseover", function(e){
        var latlng = e.latlng;  // get the lat and long of the device 
        var popup1 = L.popup()
        .setLatLng(latlng)   // set the Lat and Long of the popup
        .setContent(id+':' + latlng)  // Popup text
        .openOn(map);        
});

    newBuoy.on("mouseout", function() {
    map.closePopup(); 
});

}


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }