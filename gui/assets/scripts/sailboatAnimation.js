boatSteps=[
    [
        [42.035648, 11.882662], //start
        [42.036321, 11.886578],
        [42.037074, 11.890851],
        [42.038039, 11.895085],
        [42.039225, 11.899321],
        [42.040627, 11.903748],
        [42.042241, 11.908206],
        [42.044061, 11.912563],
        [42.046080, 11.916742],
        [42.048292, 11.920896],
        [42.050690, 11.924998],
        [42.053267, 11.929039],
        [42.056017, 11.933076],
        [42.058935, 11.937131],
        [42.062016, 11.941204],
        [42.065253, 11.945357],
        [42.068641, 11.949461],
        [42.072173, 11.953741],
        [42.075844, 11.957924],
        [42.079647, 11.962054], 
        [42.035648, 11.882662] //back to start 
      ]
    
]

// Animazione del marker
function moveMarker(marker,newLat,newLong) {
       setTimeout(function() {
        marker.setLatLng([newLat, newLong]);
    }, 2000); 
}

function animation(marker,position){
    for(let i=0;i<position.length;i++){

        for(let j=0;j<position[i].length;j++){

           let currentCoordinate=position[i][j]
           let currentLat=currentCoordinate[0]
           let currentLog=currentCoordinate[1]
            moveMarker(marker,currentLat,currentLog)
        }
    }
}


 animation(marker1,boatSteps)
