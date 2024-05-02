const tamaño = 20; // Tamaño de la sopa de letras
const cantidadPalabras = 5; // Cantidad de palabras que deseas obtener
const palabras = [];

function nuevaSopa() {
    palabras.splice(0, palabras.length);
    document.querySelectorAll('table').forEach(tabla => {
        tabla.style.display = 'none';
    });
    document.getElementById('palabras-a-encontrar').style.display = 'none';
    obtenerPalabras();
}

function convertirPalabra(palabra) {
    // Convertir la palabra a mayúsculas
    let palabraMayuscula = palabra.toUpperCase();

    // Reemplazar caracteres con tilde por sus equivalentes sin tilde
    palabraMayuscula = palabraMayuscula
        .replace(/Á/gi, 'A')
        .replace(/É/gi, 'E')
        .replace(/Í/gi, 'I')
        .replace(/Ó/gi, 'O')
        .replace(/Ú/gi, 'U');

    return palabraMayuscula;
}

function mostrarCargando() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
}

mostrarCargando();

function obtenerPalabras() {
    mostrarCargando();
    fetch('https://random-word-api.herokuapp.com/word?lang=es')
        .then(response => response.json()) // Parsear la respuesta JSON
        .then(data => {
            // Verificar si la respuesta es un array y si contiene palabras
            if (Array.isArray(data) && data.length > 0) {
                // Filtrar palabras que no contienen espacios en blanco
                const palabrasValidas = data.filter(palabra => !palabra.includes(' '));
                // Agregar las palabras válidas a la lista
                palabrasValidas.forEach(palabra => agregarPalabra(palabra));

                // Si aún se necesitan más palabras, llamar recursivamente a la función
                if (palabras.length < cantidadPalabras) {
                    obtenerPalabras();
                } else {
                    for (let i = 0; i < palabras.length; i++) {
                        palabras[i] = convertirPalabra(palabras[i]);
                    }
                    generarSopa();
                    agregarEventoClic();
                    loading.style.display = 'none';
                    document.getElementById('palabras-a-encontrar').style.display = 'block';
                }
            } else {
                console.error('La respuesta no es un array válido o está vacío.');
            }
        })
        .catch(error => console.error('Error al obtener la respuesta JSON:', error));
}

function agregarPalabra(palabra) {
    palabras.push(palabra);
}

function generarSopa() {
    const tabla = document.createElement("table");

    // Crear la matriz para la sopa de letras
    const sopaLetras = [];
    for (let i = 0; i < tamaño; i++) {
        sopaLetras[i] = [];
        for (let j = 0; j < tamaño; j++) {
            sopaLetras[i][j] = "";
        }
    }

    // Insertar palabras en la sopa de letras
    palabras.forEach(palabra => {
        let colocada = false;
        while (!colocada) {
            const direccion = Math.floor(Math.random() * 8); // 8 direcciones posibles
            const fila = Math.floor(Math.random() * tamaño);
            const columna = Math.floor(Math.random() * tamaño);
            if (direccion === 0 && columna + palabra.length <= tamaño) { // Horizontal derecha
                let valido = true;
                for (let i = 0; i < palabra.length; i++) {
                    if (sopaLetras[fila][columna + i] !== "" && sopaLetras[fila][columna + i] !== palabra[i]) {
                        valido = false;
                        break;
                    }
                }
                if (valido) {
                    for (let i = 0; i < palabra.length; i++) {
                        sopaLetras[fila][columna + i] = palabra[i];
                    }
                    colocada = true;
                }
            } else if (direccion === 1 && columna - palabra.length >= -1) { // Horizontal izquierda
                let valido = true;
                for (let i = 0; i < palabra.length; i++) {
                    if (sopaLetras[fila][columna - i] !== "" && sopaLetras[fila][columna - i] !== palabra[i]) {
                        valido = false;
                        break;
                    }
                }
                if (valido) {
                    for (let i = 0; i < palabra.length; i++) {
                        sopaLetras[fila][columna - i] = palabra[i];
                    }
                    colocada = true;
                }
            } else if (direccion === 2 && fila + palabra.length <= tamaño) { // Vertical abajo
                let valido = true;
                for (let i = 0; i < palabra.length; i++) {
                    if (sopaLetras[fila + i][columna] !== "" && sopaLetras[fila + i][columna] !== palabra[i]) {
                        valido = false;
                        break;
                    }
                }
                if (valido) {
                    for (let i = 0; i < palabra.length; i++) {
                        sopaLetras[fila + i][columna] = palabra[i];
                    }
                    colocada = true;
                }
            } else if (direccion === 3 && fila - palabra.length >= -1) { // Vertical arriba
                let valido = true;
                for (let i = 0; i < palabra.length; i++) {
                    if (sopaLetras[fila - i][columna] !== "" && sopaLetras[fila - i][columna] !== palabra[i]) {
                        valido = false;
                        break;
                    }
                }
                if (valido) {
                    for (let i = 0; i < palabra.length; i++) {
                        sopaLetras[fila - i][columna] = palabra[i];
                    }
                    colocada = true;
                }
            } else if (direccion === 4 && fila + palabra.length <= tamaño && columna + palabra.length <= tamaño) { // Diagonal abajo-derecha
                let valido = true;
                for (let i = 0; i < palabra.length; i++) {
                    if (sopaLetras[fila + i][columna + i] !== "" && sopaLetras[fila + i][columna + i] !== palabra[i]) {
                        valido = false;
                        break;
                    }
                }
                if (valido) {
                    for (let i = 0; i < palabra.length; i++) {
                        sopaLetras[fila + i][columna + i] = palabra[i];
                    }
                    colocada = true;
                }
            } else if (direccion === 5 && fila + palabra.length <= tamaño && columna - palabra.length >= -1) { // Diagonal abajo-izquierda
                let valido = true;
                for (let i = 0; i < palabra.length; i++) {
                    if (sopaLetras[fila + i][columna - i] !== "" && sopaLetras[fila + i][columna - i] !== palabra[i]) {
                        valido = false;
                        break;
                    }
                }
                if (valido) {
                    for (let i = 0; i < palabra.length; i++) {
                        sopaLetras[fila + i][columna - i] = palabra[i];
                    }
                    colocada = true;
                }
            } else if (direccion === 6 && fila - palabra.length >= -1 && columna + palabra.length <= tamaño) { // Diagonal arriba-derecha
                let valido = true;
                for (let i = 0; i < palabra.length; i++) {
                    if (sopaLetras[fila - i][columna + i] !== "" && sopaLetras[fila - i][columna + i] !== palabra[i]) {
                        valido = false;
                        break;
                    }
                }
                if (valido) {
                    for (let i = 0; i < palabra.length; i++) {
                        sopaLetras[fila - i][columna + i] = palabra[i];
                    }
                    colocada = true;
                }
            } else if (direccion === 7 && fila - palabra.length >= -1 && columna - palabra.length >= -1) { // Diagonal arriba-izquierda
                let valido = true;
                for (let i = 0; i < palabra.length; i++) {
                    if (sopaLetras[fila - i][columna - i] !== "" && sopaLetras[fila - i][columna - i] !== palabra[i]) {
                        valido = false;
                        break;
                    }
                }
                if (valido) {
                    for (let i = 0; i < palabra.length; i++) {
                        sopaLetras[fila - i][columna - i] = palabra[i];
                    }
                    colocada = true;
                }
            }
        }
        // Actualizar la lista de palabras a encontrar
        const listaPalabras = document.getElementById("lista-palabras");
        listaPalabras.textContent = palabras.join(" - ");
    });

    // Crear la tabla de la sopa de letras
    for (let i = 0; i < tamaño; i++) {
        const fila = document.createElement("tr");
        for (let j = 0; j < tamaño; j++) {
            const celda = document.createElement("td");
            celda.textContent = sopaLetras[i][j] || generarLetraAleatoria(); // Rellenar con letras aleatorias si está vacío
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }

    document.getElementById("sopa-letras").innerHTML = "";
    document.getElementById("sopa-letras").appendChild(tabla);
}

function generarLetraAleatoria() {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return caracteres.charAt(Math.floor(Math.random() * caracteres.length));
}

// Función para marcar una celda cuando se hace clic en ella
function marcarCelda(celda) {
    // Si la celda está marcada, desmarcarla
    if (celda.style.backgroundColor === 'yellow') {
        celda.style.backgroundColor = ''; // Eliminar el color de fondo
    } else {
        celda.style.backgroundColor = 'yellow'; // Si no está marcada, marcarla
    }
}

function agregarEventoClic() {
    // Agregar evento de click a cada celda de la tabla
    const celdas = document.querySelectorAll('td');
    celdas.forEach(celda => {
        celda.addEventListener('click', function () {
            marcarCelda(this); // Llamar a la función para marcar la celda
        });
    });
}

obtenerPalabras();