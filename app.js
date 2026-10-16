// PIN de acceso a la app (puedes cambiarlo aquí cuando quieras)
const PIN_SECRETO = "1234";

let listaPerros = [];

// Elementos del DOM
const loginScreen = document.getElementById('login-screen');
const pinInput = document.getElementById('pin-input');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

const dogListContainer = document.getElementById('dog-list');
const searchInput = document.getElementById('search-input');

const modal = document.getElementById('dog-modal');
const closeModalBtn = document.getElementById('close-modal');

// --- 1. SISTEMA DE LOGIN / PIN ---
loginBtn.addEventListener('click', verificarPin);
pinInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verificarPin();
});

function verificarPin() {
    if (pinInput.value === PIN_SECRETO) {
        loginScreen.style.display = 'none';
        cargarDatosPerros();
    } else {
        loginError.style.display = 'block';
        pinInput.value = '';
    }
}

// --- 2. CARGAR DATOS DE PERROS.JSON ---
async function cargarDatosPerros() {
    try {
        const respuesta = await fetch('perros.json');
        listaPerros = await respuesta.json();
        mostrarPerros(listaPerros);
    } catch (error) {
        console.error("Error al cargar la base de datos de perros:", error);
        dogListContainer.innerHTML = '<p style="text-align:center; color:#ff3b30; margin-top:20px;">Error al cargar los datos.</p>';
    }
}

// --- 3. MOSTRAR LISTA DE PERROS ---
function mostrarPerros(perros) {
    dogListContainer.innerHTML = '';

    if (perros.length === 0) {
        dogListContainer.innerHTML = '<p style="text-align:center; color:#8e8e93; margin-top:20px;">No se encontraron perros.</p>';
        return;
    }

    perros.forEach(perro => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'dog-card';
        tarjeta.innerHTML = `
            <img src="${perro.foto}" alt="${perro.nombre}" onerror="this.src='https://via.placeholder.com/60?text=🐾'">
            <div class="dog-info">
                <h3>${perro.nombre}</h3>
                <p>Dueño: ${perro.dueno}</p>
            </div>
        `;

        // Al hacer clic, abrir modal con detalles
        tarjeta.addEventListener('click', () => abrirModal(perro));
        dogListContainer.appendChild(tarjeta);
    });
}

// --- 4. BUSCADOR EN TIEMPO REAL ---
searchInput.addEventListener('input', (e) => {
    const textoBusqueda = e.target.value.toLowerCase();
    const perrosFiltrados = listaPerros.filter(perro => 
        perro.nombre.toLowerCase().includes(textoBusqueda) ||
        perro.dueno.toLowerCase().includes(textoBusqueda)
    );
    mostrarPerros(perrosFiltrados);
});

// --- 5. MODAL DE DETALLES ---
function abrirModal(perro) {
    document.getElementById('modal-foto').src = perro.foto;
    document.getElementById('modal-nombre').textContent = perro.nombre;
    document.getElementById('modal-edad').textContent = perro.edad || '-';
    document.getElementById('modal-dueno').textContent = `${perro.dueno || '-'} (${perro.telefono || 'Sin teléfono'})`;
    document.getElementById('modal-castrado').textContent = perro.castrado || '-';
    document.getElementById('modal-puedequedarsolo').textContent = perro.puedequedarsolo || '-';
    document.getElementById('modal-sociableconperros').textContent = perro.sociableconperros || '-';
    document.getElementById('modal-alimentacion').textContent = perro.alimentacion || '-';
    document.getElementById('modal-saludyalergias').textContent = perro.saludyalergias || '-';
    document.getElementById('modal-advertencias').textContent = perro.advertencias || 'Ninguna';
    document.getElementById('modal-comentariosadicionales').textContent = perro.comentariosadicionales || 'Ninguno';

    modal.style.display = 'flex';
}

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar modal si se hace clic fuera del contenido
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// --- 6. REGISTRAR SERVICE WORKER PARA PWA ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log("Service Worker registrado con éxito"))
            .catch((err) => console.log("Error al registrar Service Worker", err));
    });
}