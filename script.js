const SHEET_ID = "1pQBlsj_3xrax9MlHGBjwgWeJ_Eg6AgkmRTPoe4R4Nvk";
const API_KEY = "AIzaSyCtwPcdEhj8Zb13yOc6NdKQTQQPT4Us4iM";
const SHEET_NAME = "MoroccoWebSheet"; // Cambia si tu hoja tiene otro nombre

async function cargarDatos() {
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    
    let response = await fetch(url);
    let data = await response.json();

    let tabla = document.querySelector("#tabla-viaje tbody");
    tabla.innerHTML = ""; 

    data.values.slice(1).forEach((fila, index) => {
        let filaHTML = `
            <tr>
                <td><a href="${fila[0]}" target="_blank">Ver Airbnb</a></td>
                <td>${fila[1]}</td>
                <td>${fila[2]}</td>
                <td>${fila[3]}</td>
                <td>${fila[4]}</td>
                <td><button onclick="votar(${index})">Votar</button> <span id="votos-${index}">0</span></td>
            </tr>
        `;
        tabla.innerHTML += filaHTML;
    });

    cargarVotos();
}

async function cargarVotos() {
    let votos = JSON.parse(localStorage.getItem("votos")) || {};
    Object.keys(votos).forEach(index => {
        document.querySelector(`#votos-${index}`).textContent = votos[index];
    });
}

function votar(index) {
    let votos = JSON.parse(localStorage.getItem("votos")) || {};
    votos[index] = (votos[index] || 0) + 1;
    localStorage.setItem("votos", JSON.stringify(votos));
    document.querySelector(`#votos-${index}`).textContent = votos[index];
}

// Cargar datos al abrir la web
cargarDatos();
