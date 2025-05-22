
async function getCsvContent() {
    console.log("Into getCsvContent");

    const fileInput = document.getElementById('csvFile');

    if (!fileInput || !fileInput.files.length) {
        console.log("No file found");
        return null;
    }

    const file = fileInput.files[0];

    const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function (event) {
            resolve(event.target.result);
        };

        reader.onerror = function (error) {
            reject(error);
        };
    });

    const csvMatrix = CsvToMatrix(fileContent);
    console.log("Matrix:", csvMatrix);
    return csvMatrix;
}


    function CsvToMatrix(csvContent) {

        const dataMatrix = [];
        const rows = csvContent.split('\n');  
    
        const cleanedRows = rows.filter(row => row.trim() !== '');
    
        const header = cleanedRows[0].split(',').map(col => col.trim()); 
    
        header.unshift('Id'); 
        dataMatrix.push(header);
    
       
        for (let i = 1; i < cleanedRows.length; i++) {
            const row = cleanedRows[i].trim(); 
            const columns = row.split(',').map(col => col.trim()); 
    
            columns.unshift(i); 
            dataMatrix.push(columns);
        }
    
        return dataMatrix;
    }
    



async function addSamplingMarkers()
{   
    let actualMatrix = await getCsvContent()
    console.log("matrice attuale",actualMatrix)
    console.log("siamo dentro addmark")
    console.log(actualMatrix)
    var sample = L.icon({
        iconUrl: 'icon/sample.png',
        iconSize: [35, 25],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
    });

    const header = actualMatrix[0]
    const columnIndexLat = header.indexOf('GPS_Lat'); 
    const columnIndexLon = header.indexOf('GPS_Lon');
   
    for(let i=1;i<actualMatrix.length;i++){
        let currLat = actualMatrix[i][columnIndexLat]
        let currLon = actualMatrix[i][columnIndexLon]
        let idSample = actualMatrix[i][0]

        console.log("latitude:",currLat)
        if (isNaN(currLat) || isNaN(currLon)) {
            console.log(`Errore nei dati: riga ${i}, latitudine: ${currLat}, longitudine: ${currLon}`);
            continue; // Salta questa iterazione se i dati non sono validi
        }
        var sampleMarker = L.marker([currLat,currLon], {icon: sample}).addTo(map);

        sampleMarker.on("mouseover", function(e){
                    var latlng = e.latlng;  
                    var popup = L.popup()
                    .setLatLng(latlng)   
                    .setContent(idSample + latlng)  
                    .openOn(map);       
            });
        
        sampleMarker.on("mouseout", function() {
        map.closePopup(); 
    });
    }
    
}
