const SHEET_ID = "1HUXwwCEkzyihwzO-pz_EFyUnME_9jpMzFFmdDWnxQ7E";
const API_KEY = "AIzaSyCtwPcdEhj8Zb13yOc6NdKQTQQPT4Us4iM";
const SHEET_NAME = "Hoja 1"; // Cambia si tu hoja tiene otro nombre

// Función para mostrar la sección seleccionada
function mostrarSeccion(seccion) {
    // Oculta todas las secciones
    document.querySelectorAll('.section').forEach((section) => {
        section.style.display = 'none';
    });

    // Muestra la sección correspondiente
    document.getElementById(seccion).style.display = 'block';
}

// Cargar los datos desde la hoja de Google Sheets
async function cargarDatos() {
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    
    let response = await fetch(url);
    let data = await response.json();

    // Limpia el contenido de cada sección antes de cargar los nuevos datos
    document.querySelector("#airbnb-content").innerHTML = "";
    document.querySelector("#actividades-content").innerHTML = "";
    document.querySelector("#vuelos-content").innerHTML = "";

    // Procesa cada fila de datos
    data.values.slice(1).forEach((fila) => {
        // Mostrar Airbnb
        let airbnbHTML = `
            <div class="card">
                <h3>${fila[0]}</h3>
                <p><strong>Ciudad:</strong> ${fila[1]}</p>
                <p><strong>Precio Total:</strong> €${fila[2]}</p>
                <p><strong>Precio por persona:</strong> €${fila[3]}</p>
                <a href="${fila[0]}" target="_blank" class="button">Ver Airbnb</a>
                <button class="button" onclick="votar('airbnb')">Votar</button>
            </div>
        `;
        document.querySelector("#airbnb-content").innerHTML += airbnbHTML;

        // Mostrar Actividades
        let actividadHTML = `
            <div class="card">
                <h3>${fila[5]}</h3>
                <p><strong>Precio por persona:</strong> €${fila[6]}</p>
                <button class="button" onclick="votar('actividad')">Votar</button>
            </div>
        `;
        document.querySelector("#actividades-content").innerHTML += actividadHTML;

        // Mostrar Vuelos
        let vueloHTML = `
            <div class="card">
                <h3>Vuelo</h3>
                <p><strong>Precio:</strong> €${fila[4]}</p>
                <button class="button" onclick="votar('vuelo')">Votar</button>
            </div>
        `;
        document.querySelector("#vuelos-content").innerHTML += vueloHTML;
    });
}

// Función para manejar los votos
function votar(tipo) {
    alert(`Has votado en la sección de ${tipo}`);
}

// Cargar los datos al abrir la página
cargarDatos();

// Mostrar la sección de Airbnb por defecto
mostrarSeccion('airbnb');
