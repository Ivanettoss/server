
function showBuoyInfo(buoyNumber, latlng) {
    var buoyInfoDiv = document.getElementById('buoyInfo');
    
    if (!buoyInfoDiv) {
        console.error('Elemento con id "buoyInfo" non trovato.');
        return;
    }

    if (latlng && typeof latlng.lat === 'number' && typeof latlng.lng === 'number') {
        document.getElementById('buoyId').textContent = buoyNumber;
        document.getElementById('lat').textContent = latlng.lat.toFixed(6); 
        document.getElementById('long').textContent = latlng.lng.toFixed(6); 

        buoyInfoDiv.style.display = 'block'; 
    } else {
        console.error('Latitudine e longitudine non valide');
    }
}


function hideBuoyInfo() {
    var buoyInfoDiv = document.getElementById('buoyInfo');
    buoyInfoDiv.style.display = 'none'; // Nascondi il div
}
