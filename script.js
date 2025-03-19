const SHEET_ID = "1HUXwwCEkzyihwzO-pz_EFyUnME_9jpMzFFmdDWnxQ7E";
const API_KEY = "AIzaSyCtwPcdEhj8Zb13yOc6NdKQTQQPT4Us4iM";
const SHEET_NAME = "Hoja 1"; // Cambia si tu hoja tiene otro nombre

async function fetchData() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`);
    const data = await response.json();
    return data.values;
}

function displayAirbnbs(data) {
    const airbnbList = document.getElementById('airbnb-list');
    airbnbList.innerHTML = '';

    data.forEach((row, index) => {
        if (index === 0) return; // Omitir encabezados

        const airbnbDiv = document.createElement('div');
        airbnbDiv.classList.add('airbnb');
        airbnbDiv.innerHTML = `
            <a href="${row[0]}" target="_blank">
                <h3>${row[1]} - ${row[2]}</h3>
                <p>Precio por persona: ${row[3]}</p>
            </a>
        `;
        airbnbList.appendChild(airbnbDiv);
    });
}

function displayActividades(data) {
    const actividadList = document.getElementById('actividad-list');
    actividadList.innerHTML = '';

    data.forEach((row, index) => {
        if (index === 0) return; // Omitir encabezados

        const actividadNombre = row[5] || ""; // Nombre actividad (columna F)
        const actividadEnlace = row[6] || "#"; // Enlace actividad (columna E)
        const actividadPrecio = row[7] || "No especificado"; // Precio actividad (columna G)

        if (actividadNombre.trim() !== "") {
            const actividadDiv = document.createElement('div');
            actividadDiv.classList.add('actividad');
            actividadDiv.innerHTML = `
                <a href="${actividadEnlace}" target="_blank">
                    <h3>${actividadNombre}</h3>
                </a>
                <p>Precio por persona: ${actividadPrecio} €</p>
            `;
            actividadList.appendChild(actividadDiv);
        }
    });
}

function displayResumen(data) {
    const precios = data.slice(1).map(row => parseFloat(row[3]?.replace('€', '').replace(',', '.') || 0));
    const minPrecio = Math.min(...precios);
    const maxPrecio = Math.max(...precios);

    document.getElementById('precio-vuelos').textContent = (data.slice(1)
        .map(row => parseFloat(row[4]) || 0) // Convertir a número
        .filter(value => value > 0) // Filtrar solo los valores válidos
        .reduce((sum, value) => sum + value, 0) / (data.slice(1).filter(row => parseFloat(row[4]) > 0).length) // Calcular la media
    ).toFixed(2);
    document.getElementById('precio-comida').textContent = (data.slice(1)
        .map(row => parseFloat(row[8]) || 0)
        .filter(value => value > 0) // Filtrar solo los valores válidos
        .reduce((sum, value) => sum + value, 0) / (data.slice(1).filter(row => parseFloat(row[8]) > 0).length) // Calcular la media
    ).toFixed(2);
    const precioExtras = 40;

    // Actualizar el precio de los extras
    document.getElementById('precio-extras').textContent = precioExtras.toFixed(2);
    document.getElementById('rango-alojamiento').textContent = `${minPrecio.toFixed(2)} - ${maxPrecio.toFixed(2)}`;
    document.getElementById('rango-total').textContent = `${(minPrecio + 218 + precioExtras).toFixed(2)} - ${(maxPrecio + 218 + precioExtras).toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchData();
    displayAirbnbs(data);
    displayActividades(data);
    displayResumen(data);
});

function toggleSection(id) {
    const content = document.getElementById(id);
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
}
