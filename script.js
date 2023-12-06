let eventos = []; //Variable para guardar los eventos creados, en un formato json
let arr=[]; //Perimite enviarlos al local storage

const nombreEvento = document.querySelector("#nombreEvento"); //Almacenamos en una variable los datos que ingresa el usuario
const fechaEvento = document.querySelector("#fechaEvento");
const botonAgregar = document.querySelector("#agregar");
const listaEventos = document.querySelector("#listaEventos");

const json = cargar(); //Traemos los datos almacenados en el localstorage

try {
    arr = JSON.parse(json); //Carga los elementos existentes
} catch (error) {
    arr= []; //Sino el arreglo sera limpiado
}

eventos=arr?[...arr] : []; //Acumular y agregar los eventos o continuar en blanco

mostrarEventos();

document.querySelector("form").addEventListener("submit", e=>{ //Que atrape todo el elemento del formulario cuando el evento sea submit
    e.preventDefault();
    agregarEvento();
    
});

function agregarEvento(){ //La funcion que se ejecutara cada vez que se envie el form
    if (nombreEvento.value === "" || fechaEvento.value === ""){//Si envia campos vacios no se ejecutara el almacenado en eventos
        return;
    }

    if (diferenciaFecha(fechaEvento.value) < 0) { //Si ingresa una fecha que ya paso, no permitira agregarlo
        return;
    }

    const nuevoEvento = { //Aqui se almacenara nuevos eventos
        id: (Math.random() * 100).toString(36).slice(3), //Se genera un id que luego se convertira a string y solo tomara 3 numeros
        nombre: nombreEvento.value, //Almaceno el valor dentro de nombre, esto es hecho en formato json
        fecha: fechaEvento.value, //Almaceno el valor dentro de nombre, esto es hecho en formato json
    };

    eventos.unshift(nuevoEvento); //Toma el evento creado y se almacena en el evento

    guardar(JSON.stringify(eventos)); //Guardar los elemntos nuevos

    nombreEvento.value="";
    fechaEvento.value=""; //Limpiamos el evento

    mostrarEventos();//Funcion para mostrar eventos al usuario
}

function diferenciaFecha(destino) {//Funcion para traer la diferencia de fecha
    let fechaDestino = new Date(destino); //Traemos la fecha que es enviada y se pasa a fecha generada por date()
    let fechaActual = new Date(); //Traemos la fecha actual

    let diferencia = fechaDestino.getTime() - fechaActual.getTime(); //Restamos y traemosla diferencia
    let dias = Math.ceil(diferencia / (1000 * 3600 * 24)); //Conversion de la fecha para traer los dias que faltan

    return dias;
}

function mostrarEventos() {//Funcion para mostrar los eventos en HTML
    const eventosHtml = eventos.map((eventos) =>{ //Mapeamos los eventos queestan dentro del arreglo
        return `
        <div class="evento">
            <div class="dias">
                <span class="diasFaltantes"> ${diferenciaFecha(eventos.fecha)}</span>
                <span class="texto">días para</span>
            </div>
    
            <div class="nombreEvento">${eventos.nombre}</div>
            <div class="fechaEvento">${eventos.fecha}</div>
            <div class="acciones">
                <button data-id="${eventos.id}" class="eliminar">Eliminar</button>
            </div>
        </div>
    
        `;
    });

    listaEventos.innerHTML=eventosHtml.join("");  //Inserta los elementos de eventosHTML en ListaEventos, adjunta arrays

    //Seleccionamos todos los botones con la clase de eliminar y por cada uno se ejecuta una accion
    document.querySelectorAll(".eliminar").forEach(button =>{
        button.addEventListener("click", e=>{ //Añadimos un evento que se ejucuta en cada click
            const id = button.getAttribute('data-id'); //Traemos el dato que esta en el meta dato
            eventos = eventos.filter(evento => evento.id !== id); //Filtramos para que desaparezca el elemento con el id y no elimine todos

            guardar(JSON.stringify(eventos)); //Al momento de eliminar se actualiza sin en nuevo item

            mostrarEventos(); //Vuelve a mostrar los eventos
            //console.log("ESTA VIVOOO");
        });
    });
}

function guardar(datos) {
    localStorage.setItem("lista", datos); //Guardar los elemtos en el local storage
}

function cargar() {
    return localStorage.getItem("lista"); //Trae los elemntos del localstorage
}

