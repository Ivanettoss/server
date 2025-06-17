let markLine={}

function enableSelection() {

    const id1 = prompt("Insert the first buoy id ");
    const id2 = prompt("insert the second buoy id");

    let coupleId= id1 + '-' + id2

    const c1= getCoordById(id1)
    const c2=getCoordById(id2)
    console.log("ora stampo C1 e C2")
    console.log(c1)
    console.log(c2)
    let distance= distanceCalculation(c1,c2).toFixed(5)
    drawDistanceLine(c1,c2,distance,coupleId)
    alert(distance)
}

function drawDistanceLine(c1,c2,d,cId)
{   
    console.log("im drawing bae")
    let latlngs= [[c1[0],c1[1]],[c2[0],c2[1]]]
    var distline = L.polyline(latlngs, {
        color: 'grey', // puoi scegliere il colore della linea
        weight: 3,     // spessore della linea
        dashArray: '5, 5'
    }).addTo(map);


    var midLat = (c1[0] + c2[0]) / 2;
    var midLng = (c1[1] + c2[1]) / 2;
    var midPoint = L.latLng(midLat, midLng);
    console.log("mo te do er mid")
    console.log(midPoint)

    markerKm=L.marker(midPoint, { // Posiziona il marker al centro della linea
        icon: L.divIcon({
            className: 'text-line', // Classe CSS personalizzata
            html: `
            <div>
                <span>${d} km</span>
                <button class="popup-close-button" >
                    <img src="assets/icon/close-button.png" alt="Close" />
                </button>
            </div>
        `,
           
            iconSize: [100, 30] // Dimensioni dell'icona
        })
    }).addTo(map);


    markLine[cId] = {
        marker: markerKm,
        line: distline
    };
            const closeButton = markerKm._icon.querySelector('.popup-close-button'); 
            if (closeButton) {
                console.log("Close button found");
                
                // Associa l'evento click
                closeButton.addEventListener('click', function() {
                    console.log("Close button clicked");
                    removeLine(cId);  // Rimuovi il marker e la linea
                });
            } else {
                console.log("Close button not found");
            }
}




// Funzione per rimuovere la linea e il marker
function removeLine(cId) {
    console.log("delete")

    let coupleToRemove = markLine[cId]

    map.removeLayer(coupleToRemove.marker);
    map.removeLayer(coupleToRemove.line); 

    delete markLine[cId]

}


function getCoordById(idBuoy)
{
    console.log("im here")
    wantedBuoy= window.actualBuoys[idBuoy]
    if (wantedBuoy){
        console.log(wantedBuoy)
        return [wantedBuoy.lat,wantedBuoy.lon];
    }else 
    console.log("buoy not found")
}


function distanceCalculation(c1,c2){
console.log("estamos calcolando")
 lat1 = +c1[0]
 long1 = +c1[1]
 lat2 = +c2[0]
 long2 = +c2[1]
console.log(lat1)
console.log(long1)
 distance= vincenty(lat1,long1,lat2,long2)
 return distance
}


function vincenty(lat1, lon1, lat2, lon2) {
    // Parametri ellissoidali WGS-84
    const a = 6378137;  // semiasse maggiore in metri
    const f = 1 / 298.257223563;  // fattore di appiattimento
    const b = (1 - f) * a;  // semiasse minore

    // Converti le latitudini e longitudini in radianti
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const λ1 = lon1 * Math.PI / 180;
    const λ2 = lon2 * Math.PI / 180;

    // Differenza di longitudine
    const Δλ = λ2 - λ1;

    // U1 e U2 sono le latitudini ridotte
    const U1 = Math.atan((1 - f) * Math.tan(φ1));
    const U2 = Math.atan((1 - f) * Math.tan(φ2));

    // Inizializzazione per le iterazioni
    let sinσ, cosσ, σ, sinα, cos2α, cos2σm, C;
    let iterLimit = 100;
    let λ = Δλ;

    // Iterazione per ottenere la convergenza
    do {
        sinσ = Math.sqrt(Math.pow(Math.cos(U2) * Math.sin(λ), 2) +
                         Math.pow(Math.cos(U1) * Math.sin(U2) - Math.sin(U1) * Math.cos(U2) * Math.cos(λ), 2));
        cosσ = Math.sin(U1) * Math.sin(U2) + Math.cos(U1) * Math.cos(U2) * Math.cos(λ);
        σ = Math.atan2(sinσ, cosσ);
        sinα = Math.cos(U1) * Math.cos(U2) * Math.sin(λ) / sinσ;
        cos2α = 1 - sinα * sinα;  // Coseno del quadrato di alpha (cos^2(α)) → cos2α = 1 - sinα * sinα
        cos2σm = cosσ - 2 * Math.sin(U1) * Math.sin(U2) / cos2α;
        C = f / 16 * cos2α * (4 + f * (4 - 3 * cos2α));

        // Nuova longitudine
        λ = Δλ + (1 - C) * f * sinα * (σ + C * sinσ * (cos2σm + C * cosσ * (-1 + 2 * cos2σm * cos2σm)));
    } while (Math.abs(λ) > 1e-12 && --iterLimit > 0);

    // Distanza finale
    const u2 = cos2α * (a * a - b * b) / (b * b);  // Correzione della distanza
    const A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
    const B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
    const Δσ = u2 / 1024 * (64 + u2 * (-32 + u2 * (20 - 14 * u2)));

    const ΔσFinal = Δσ * Math.sin(σ) * (cos2σm + Δσ * cosσ * (-1 + 2 * cos2σm * cos2σm));
    const distance = b * A * (σ - ΔσFinal);

    
    return distance/1000;
}