async function searchGivenPlace(){

    const desiredPlace = document.getElementById('searchForm').value;

    if(!desiredPlace){
        alert("Please enter a place to search.");
        return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(desiredPlace)}`;
    
    try {
              const response = await fetch(url, {
                headers: {
                  'Accept': 'application/json',
                  'User-Agent': 'ImLearning/1.0 (ivandallaragions@gmail.com)'
                }
              });
              
              // convert the response to JSON
              const coordinates = await response.json();
          
              // the response is an array of objects, so chekc if is not empty
              if (coordinates.length > 0) {

                const { lat, lon } = coordinates[0];
                console.log(`Latitude: ${lat}, Longitude: ${lon}`);
                moveMap(lat,lon)
              }
              
              else {
                console.log("No results found");
                alert("No place found, please try again.");
              }
            } 
            
            catch (error) {
              console.error("Error during the request", error);
            }
        }


function moveMap(lat, lon) {

    map.setView([lat,lon],13)

}
