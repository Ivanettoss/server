function showFilterDropdown(){

    var dropdown = document.getElementById("filter-dropdown")

    if(dropdown.style.display == "none"){
         dropdown.style.display = "block"
    }
    else{
         dropdown.style.display = "none"
    }

}




hiddenBuoys=[]

function filterBy(type){

    for(id in actualBuoys){
        console.log(id)
        var buoy = actualBuoys[id]
        console.log("boa dentro filterby ")
        console.log(buoy)

        if (buoy.options.class != type)
        {
            map.removeLayer(buoy)
            hiddenBuoys.push(id)
        }

    }
}


function filterReset() {

    console.log(hiddenBuoys); // Verifica gli indici in hiddenBuoys
    if (hiddenBuoys.length > 0) {
        console.log("sono nell'if");
       
        hiddenBuoys.forEach(index => {
            
            var buoy = actualBuoys[index];
            console.log(buoy); 
            map.addLayer(buoy); // Aggiungi il layer alla mappa
            
        });
        hiddenBuoys = []; // Resetta hiddenBuoys dopo aver aggiunto gli oggetti alla mappa
    } else {
        alert("No filter selected");
    }
}

