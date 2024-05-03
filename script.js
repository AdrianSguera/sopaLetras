let tamaño = 20; // Tamaño de la sopa de letras
let cantidadPalabras = 5; // Cantidad de palabras que deseas obtener
const palabras = [];
let arrastre = false;
const palabrasEnTablero = {};

document.addEventListener('DOMContentLoaded', function () {
    const tabla_size = document.getElementById('tabla_size');
    const palabras_size = document.getElementById('palabras_size');
    const btn = document.getElementById('btn');

    function habilitarBoton() {
        if (tabla_size.value.trim() !== '' && palabras_size.value.trim() !== '') {
            btn.removeAttribute('disabled');
        } else {
            btn.setAttribute('disabled', 'disabled');
        }
    }
    document.getElementById('palabras-a-encontrar').style.display = 'none';
    document.getElementById('loading').style.display = 'none';

    tabla_size.addEventListener('input', habilitarBoton);
    palabras_size.addEventListener('input', habilitarBoton);
    document.addEventListener('mousedown', () => {
        arrastre = true;
    });
    document.addEventListener('mouseup', () => {
        arrastre = false;
    });
});

function nuevaSopa() {
    tamaño = document.getElementById('tabla_size').value;
    cantidadPalabras = document.getElementById('palabras_size').value;
    palabras.splice(0, palabras.length);
    if (document.querySelectorAll('table').length != 0) {
        document.querySelectorAll('table').forEach(tabla => {
            tabla.style.display = 'none';
        });
    }
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

function cargarPalabrasAleatoriasDesdeArchivo(rutaArchivo, cantidadPalabras) {
    return new Promise((resolve, reject) => {
        const palabrasAleatorias = [];
        const xhr = new XMLHttpRequest();
        xhr.open('GET', rutaArchivo);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const lineas = xhr.responseText.split('\n');
                    const totalPalabras = lineas.length;
                    for (let i = 0; i < cantidadPalabras; i++) {
                        const indiceAleatorio = Math.floor(Math.random() * totalPalabras);
                        const palabra = lineas[indiceAleatorio].trim();
                        if (palabra !== '' && palabra.length >= 4 && !palabrasAleatorias.includes(palabra)) {
                            palabrasAleatorias.push(palabra);
                        } else {
                            i--; // Intentar nuevamente si la palabra no cumple los criterios
                        }
                    }
                    resolve(palabrasAleatorias);
                } else {
                    reject(new Error('Error al cargar el archivo de palabras'));
                }
            }
        };
        xhr.send();
    });
}

function obtenerPalabras() {
    mostrarCargando();

    cargarPalabrasAleatoriasDesdeArchivo('spanish.txt', cantidadPalabras)
        .then(palabras => {
            for (let i = 0; i < palabras.length; i++) {
                palabras[i] = convertirPalabra(palabras[i]);
            }
            // Verificar si se cargaron palabras aleatorias
            if (palabras.length > 0) {
                // Agregar las palabras aleatorias a la lista
                palabras.forEach(palabra => agregarPalabra(palabra));

                // Si aún se necesitan más palabras, llamar recursivamente a la función
                if (palabras.length < cantidadPalabras) {
                    obtenerPalabras();
                } else {
                    generarSopa();
                    agregarEventoClicCeldas();

                    loading.style.display = 'none';
                    document.getElementById('palabras-a-encontrar').style.display = 'block';
                    agregarEventoClicSpan();
                }
            } else {
                console.error('No se cargaron palabras aleatorias válidas.');
            }
        })
        .catch(error => console.error('Error al cargar palabras aleatorias:', error));
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

    const listaPalabras = document.getElementById("lista-palabras");
    listaPalabras.textContent = '';

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
        let span = document.createElement('span');
        span.textContent = palabra;
        let space = document.createElement('span');
        space.textContent = ' - ';
        listaPalabras.appendChild(span);
        if(palabra !== palabras[palabras.length - 1]){
            listaPalabras.appendChild(space);
        }
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

function agregarEventoClicCeldas() {
    // Agregar evento de click a cada celda de la tabla
    const celdas = document.querySelectorAll('td');
    celdas.forEach(celda => {
        celda.addEventListener('mousedown', function () {
            marcarCelda(this); // Llamar a la función para marcar la celda
        });
        celda.addEventListener('mouseenter', function () {
            if (arrastre) {
                marcarCelda(celda);
            }
        });
    });
}

function agregarEventoClicSpan() {
    const spans = document.querySelectorAll('span');
    for (let i = 0; i <= spans.length; i += 2) {
        spans[i].addEventListener('click', () => {
            if (spans[i].style.textDecoration === 'line-through') {
                spans[i].style.textDecoration = 'none';
            } else {
                spans[i].style.textDecoration = 'line-through';
            }
        })
    }
}