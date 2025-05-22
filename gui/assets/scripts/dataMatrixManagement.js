let actualMatrix = [];  // Dichiariamo actualMatrix come variabile globale
let currentPage = 1;  // Imposta la pagina iniziale
let rPP = 100;  // Numero di righe per pagina

// Funzione per caricare il CSV e renderizzare la tabella e la paginazione
async function generateMatrix() {
    actualMatrix = await getCsvContent(); // Popola la matrice
    console.log("Matrice attuale:", actualMatrix); // Log per vedere cosa contiene

    if (!actualMatrix || actualMatrix.length === 0) {
        console.error("La matrice è vuota o non valida");
        return; // Se la matrice è vuota o non valida, non continuare
    }

    renderTable();
    renderPagination();
}

// Funzione per renderizzare la tabella
function renderTable() {
    const table = document.querySelector(".container");
    table.innerHTML = "";  // Pulisce la tabella esistente

   

    const [headers, ...rows] = actualMatrix; // Estrai intestazione e righe
    const start = (currentPage - 1) * rPP;
    const end = start + rPP;

    let tableHTML = "<thead><tr>";
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += "</tr></thead><tbody>";

    for (let i = start; i < end && i < rows.length; i++) {
        const rowData = rows[i];
        tableHTML += "<tr>";
        rowData.forEach(cell => {
            tableHTML += `<td>${cell}</td>`;
        });
        tableHTML += "</tr>";
    }

    tableHTML += "</tbody>";
    table.innerHTML = tableHTML;
}

// Funzione per renderizzare la paginazione
function renderPagination() {
    const paginationContainer = document.getElementById("pagination") || createPaginationContainer();

    // Calcola il numero totale di pagine
    const totalPages = Math.ceil((actualMatrix.length - 1) / rPP);

    // Se il totale delle pagine è 1, non serve mostrare la paginazione
    if (totalPages <= 1) return;

    // Svuota il contenuto della paginazione
    paginationContainer.innerHTML = '';

    // Aggiungi il pulsante "Precedente" se non siamo sulla prima pagina
    if (currentPage > 1) {
        addPaginationButton(paginationContainer, "← Precedente", currentPage - 1);
    }

    // Aggiungi l'informazione della pagina attuale
    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Pagina ${currentPage} di ${totalPages}`;
    paginationContainer.appendChild(pageInfo);

    // Aggiungi il pulsante "Successiva" se non siamo sull'ultima pagina
    if (currentPage < totalPages) {
        addPaginationButton(paginationContainer, "Successiva →", currentPage + 1);
    }
}

// Funzione per creare il container di paginazione se non esiste
function createPaginationContainer() {
    const container = document.createElement("div");
    container.id = "pagination";
    document.body.appendChild(container);
    return container;
}

// Funzione per aggiungere un pulsante di paginazione
function addPaginationButton(container, text, page) {
    const button = document.createElement("button");
    button.textContent = text;
    button.onclick = () => {
        currentPage = page; // Cambia la pagina corrente
        renderTable();  // Rende la tabella con la nuova pagina
        renderPagination();  // Rende la paginazione aggiornata
    };
    container.appendChild(button);
}

    

   

