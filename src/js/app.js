let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
})

function iniciarApp() {
    
    mostrarSeccion(); //Muestra y oculta las secciones
    tabs(); // Cambia la seccion cuando se precionen los tabs
    botonesPaginador(); //Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); //Consulta la API en el backend de PHP

    idCliente(); //Anade el id del cliente al objeto de cita
    nombreCliente(); //Anade el nombre del cliente al objeto de cita
    seleccionarFecha() //anade la fecha al objeto de cita
    seleccionarHora() //anade la hora al objeto de cita
}

function mostrarSeccion() {

    //Ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar')
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar')
    }


    //Selecionar la seccion con el paso
    const seccion = document.querySelector(`#paso-${paso}`)
    seccion.classList.add('mostrar')


    //Quita la clase acutal al tab anterior
    const tabAnterior = document.querySelector('.actual')
    if( tabAnterior ) {
        tabAnterior.classList.remove('actual')
    }

    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`)
    tab.classList.add('actual')
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach( boton => {
        boton.addEventListener('click', (e) => {
            paso = parseInt( e.target.dataset.paso );

            mostrarSeccion();
            botonesPaginador();
        })
    })
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior')
    const paginaSiguiente = document.querySelector('#siguiente')

    if(paso === 1) {
        paginaAnterior.classList.add('ocultar')
        paginaSiguiente.classList.remove('ocultar')
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar')
        paginaSiguiente.classList.add('ocultar')
        mostrarResuman()
    } else {
        paginaAnterior.classList.remove('ocultar')
        paginaSiguiente.classList.remove('ocultar')
    }

    mostrarSeccion();
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior')
    paginaAnterior.addEventListener('click', function() {

        if( paso <= pasoInicial ) return;
        paso--;
        
        botonesPaginador();
    })
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente')
    paginaSiguiente.addEventListener('click', function() {
        if( paso >= pasoFinal ) return
        paso++
        
        botonesPaginador();
    })
}

async function consultarAPI() {

    try {
        const url = '/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();

        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const {id, nombre, precio} = servicio
        
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV')
        servicioDiv.classList.add('servicio')
        servicioDiv.dataset.idServicio = id
        servicioDiv.onclick = () => {
            seleccionarServicio(servicio)
        }

        servicioDiv.appendChild(nombreServicio)
        servicioDiv.appendChild(precioServicio)
       
        document.querySelector('#servicios').appendChild(servicioDiv)
    })
}

function seleccionarServicio(servicio) {
    const {id} = servicio;
    const {servicios} = cita
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`)


    //Comprobar si un servicio ya fue agregado
    if( servicios.some( agregado => agregado.id === id) ) {
        //Eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id)
        divServicio.classList.remove('seleccionado')

    } else {
        //Agregarlo
        cita.servicios = [...servicios, servicio]
        divServicio.classList.add('seleccionado')
        
    }
}

function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}

function idCliente() {
    cita.id = document.querySelector('#id').value
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', (e) => {
        const dia = new Date(e.target.value).getUTCDay();

        if( [6,0].includes(dia) ) {
            e.target.value = '';
            mostrarAlerta('Fines de Semana estamos cerrados', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value
        }
    })
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 18) {
            e.target.value = ''
            mostrarAlerta('Hora no Valida', 'error', '.formulario')
        } else {
            cita.hora = horaCita
        }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {

    //Previene muchas alertas
    const alertaPrevia = document.querySelector('.alerta')
    if(alertaPrevia) {
        alertaPrevia.remove()
    }


    //Crear alerta
    const alerta = document.createElement('DIV')
    alerta.textContent = mensaje
    alerta.classList.add('alerta')
    alerta.classList.add(tipo)
    
    //mostrar alerta en HTML
    const lugar = document.querySelector(elemento)
    lugar.appendChild(alerta)

    if(desaparece) {
        //Eliminar alerta
        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }


}

function mostrarResuman() {
    const resumen = document.querySelector('.contenido-resumen')

    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild)
    }

    if( Object.values(cita).includes('') || cita.servicios.length === 0 ) {
        mostrarAlerta('Faltan datos o servicios', 'error', '.contenido-resumen', false)

        return
    }

    //Formatear el dic de resumen
    const {nombre, fecha, hora, servicios} = cita

    //Heading para servicios resumen
    const headingServicios = document.createElement('H3')
    headingServicios.textContent = 'Resumen de Servicios'
    resumen.appendChild(headingServicios)

    servicios.forEach( servicio => {
        const {id, nombre, precio} = servicio
        const contenedorServicio = document.createElement('DIV')
        contenedorServicio.classList.add('contenedor-servicio')

        const textoServicio = document.createElement('P')
        textoServicio.textContent = nombre

        const precioServicio = document.createElement('P')
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`

        contenedorServicio.appendChild(textoServicio)
        contenedorServicio.appendChild(precioServicio)

        resumen.appendChild(contenedorServicio)
    })

    //Heading para cita resumen
    const headingCita = document.createElement('H3')
    headingCita.textContent = 'Resumen de Cita'
    resumen.appendChild(headingCita)

    const nombreCliente = document.createElement('P')
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`


    //formatear fecha
    const fechaObj = new Date(fecha)
    const mes = fechaObj.getMonth()
    const dia = fechaObj.getDate() + 2
    const year = fechaObj.getFullYear()

    const fechaUTC = new Date( Date.UTC(year, mes, dia))

    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
    const fechaFormateda = fechaUTC.toLocaleDateString('es-MX', opciones)

    const fechaCita = document.createElement('P')
    fechaCita.innerHTML = `<span>Fecha: </span>${fechaFormateda}`

    const horaCita = document.createElement('P')
    horaCita.innerHTML = `<span>Hora: </span>${hora}`


    //boton para crear una cita
    const botonReservar = document.createElement('BUTTON')
    botonReservar.classList.add('boton')
    botonReservar.textContent = 'Reservar Cita'
    botonReservar.onclick = reservarCita

    resumen.appendChild(nombreCliente)
    resumen.appendChild(fechaCita)
    resumen.appendChild(horaCita)

    resumen.appendChild(botonReservar)
}

async function reservarCita() {
    const {id, fecha, hora, servicios} = cita
    const idServicios = servicios.map( servicio => servicio.id)

    const datos = new FormData();
    datos.append('usuarioId', id)
    datos.append('fecha', fecha)
    datos.append('hora', hora)
    datos.append('servicios', idServicios)

    //Peticion hacia la API
    try {
        // Petición hacia la api
        const url = '/api/citas'
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();

        console.log(resultado);
        
        if(resultado.resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Cita Creada',
                text: 'Tu cita fue creada correctamente',
                button: 'OK'
            }).then( () => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita'
        })
    }

    
    // console.log([...datos]);

}