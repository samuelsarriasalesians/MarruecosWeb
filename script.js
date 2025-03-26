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

        document.getElementById('precio-actividades').textContent = actividadPrecio;

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
    // Obtener los precios de la columna J (índice 9)
    const preciosJ = data.slice(1).map(row => parseFloat(row[9]?.replace('€', '').replace(',', '.') || 0));

    // Calcular el mínimo y el máximo de los precios de la columna J
    const minPrecioJ = Math.min(...preciosJ);
    const maxPrecioJ = Math.max(...preciosJ);

    // Calcular los precios de otras columnas (como el de los vuelos y comida)
    const minPrecio = Math.min(...data.slice(1).map(row => parseFloat(row[3]?.replace('€', '').replace(',', '.') || 0)));
    const maxPrecio = Math.max(...data.slice(1).map(row => parseFloat(row[3]?.replace('€', '').replace(',', '.') || 0)));

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

    // Mostrar el rango de alojamiento
    document.getElementById('rango-alojamiento').textContent = `${minPrecio.toFixed(2)} - ${maxPrecio.toFixed(2)}`;
    
    // Mostrar el rango total (con el mínimo y máximo de la columna J y los extras)
    document.getElementById('rango-total').textContent = `${(minPrecioJ + precioExtras).toFixed(2)} - ${(maxPrecioJ + precioExtras).toFixed(2)}`;
}


document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchData();
    displayAirbnbs(data);
    displayActividades(data);
    displayResumen(data);
});

function toggleSection(id) {
    const content = document.getElementById(id);
    content.classList.toggle('hidden'); // Alterna la clase 'hidden'
}

