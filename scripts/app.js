//Referencias a los elementos del DOM
const notesList = document.getElementById('notes-list');
const addNoteBtn = document.getElementById('add-note-btn');
const newNoteInput = document.getElementById('new-note');
const searchInput = document.getElementById('search');
const showCompletedCheckbox = document.getElementById('show-completed');

//Función para obtener notas del almacenamiento local
function obtenerNotas() {
    const notasGuardadas = localStorage.getItem('notas');
    return JSON.parse(notasGuardadas) || [];
}

//Función para guardar notas en el almacenamiento local
function guardarNotas(notas) {
    localStorage.setItem('notas', JSON.stringify(notas));
}

//Función para crear una nueva nota
function crearNota(texto) {
    return {
        texto: texto,
        completada: false,
        id: Date.now() //Devuelve el tiempo exacto de creación, obteniendo un ID único
    };
}

//Función para agregar una nueva nota
function agregarNota(texto) {
    const notas = obtenerNotas();         //Obtiene las notas guardadas
    const nuevaNota = crearNota(texto);   //Crea una nueva nota 
    notas.push(nuevaNota);                //Agrega la nueva nota al array de notas
    guardarNotas(notas);                  //Guarda el array nuevo en el almacenamiento local
    renderizarNotas();                    //Actualiza la lista de notas
}

//Función para eliminar una nota
function eliminarNota(id) {
    const notas = obtenerNotas().filter(function(nota) {
        return nota.id !== id;
    });
    guardarNotas(notas);
    renderizarNotas();
}

//Función para cambiar el estado "completada"
function alternarEstadoNota(id) {
    const notas = obtenerNotas().map(function(nota) {
        if (nota.id === id) {
            nota.completada = !nota.completada; //Se cambia el estado de la nota
        }
        return nota;
    });
    guardarNotas(notas);
    renderizarNotas();
}

function renderizarNotas() {
    const notas = obtenerNotas(); //Traigo todas las notas
    const textoBusqueda = searchInput.value.toLowerCase(); //Valor del input en minusculas
    const mostrarCompletadas = showCompletedCheckbox.checked; //Estado del checkbox 

    //Filtro para las notas por texto y completadas
    const notasFiltradas = notas.filter(function(nota) {
        const coincideTexto = nota.texto.toLowerCase().includes(textoBusqueda);
        const coincideEstado = mostrarCompletadas ? nota.completada : true;
        return coincideTexto && coincideEstado;
    });

    //Limpio la lista
    notesList.innerHTML = '';

    //Bucle para recorrer las notas filtradas para poder mostrarlas
    notasFiltradas.forEach(function(nota) {
        const li = document.createElement('li');
        li.className = nota.completada ? 'completed' : ''; //Sumo clase si está "completada"
        li.innerHTML = `
            <span>${nota.texto}</span>
            <div>
                <button class="toggle-complete-btn">${nota.completada ? 'Incompleta' : 'Completa'}</button>
                <button class="delete-btn">Eliminar</button>
            </div>
        `;

        //Evento para cambiar el estado de "completada"
        li.querySelector('.toggle-complete-btn').addEventListener('click', function() {
            alternarEstadoNota(nota.id);
        });

        //Evento para eliminar la nota
        li.querySelector('.delete-btn').addEventListener('click', function() {
            eliminarNota(nota.id);
        });

        notesList.appendChild(li);
    });
}

//Evento para agregar una nueva nota 
addNoteBtn.addEventListener('click', function() {
    const texto = newNoteInput.value.trim(); //Obtengo el texto del input y saco posibles espacios en blanco
    if (texto) { //Si el campo no está vacío
        agregarNota(texto); //Llamo función para agregar la nueva nota
        newNoteInput.value = ''; //Vacio el campo de texto
    }
});

//Eventos para filtrar las notas mientras se escribe o se marca el checkbox
searchInput.addEventListener('input', renderizarNotas);
showCompletedCheckbox.addEventListener('change', renderizarNotas);

//Renderizar las notas al cargar la página
document.addEventListener('DOMContentLoaded', renderizarNotas);

