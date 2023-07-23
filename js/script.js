let libros = []
const urlLibros = 'js/libros.json'

fetch(urlLibros)
    .then(response => response.json())
    .then(data => {
        libros = data.libros
        mostrarLibros(libros)
        recuperarCarrito()
        actualizarCarrito()
        console.log(data)
    })

let carrito = []
function recuperarCarrito() {
    let carritoJSON = JSON.parse(localStorage.getItem('carrito'))
    if (carritoJSON) {
        carrito = carritoJSON
    }
}

let carritoVisible = false


// Función para mostrar los libros
function mostrarLibros(arrayLibros) {
    let container = document.getElementById('container')
    container.innerHTML = ''

    arrayLibros.forEach(libro => {
        let tarjetaLibro = document.createElement('div')
        tarjetaLibro.classList.add('tarjetaProducto')

        let libroEnCarrito = carrito.find(item => item.id === libro.id)

        if(libroEnCarrito) {
            tarjetaLibro.innerHTML = `
                <h2>${libro.titulo}</h2>
                <div class=imagen style='background-image: url(./images/${libro.rutaImagen})'></div>
                <h3>${libro.autor}</h3>
                <p>$${libro.precio}</p>
                <div class=contenedorVerCarrito>
                    <button id=verCarrito${libro.id} class=oculto btn>Ver carrito</button>
                    <p id=libroAgregado${libro.id} class=oculto btn>Libro agregado</p>
                </div>
            `
        }else {
            tarjetaLibro.innerHTML = `
                <h2>${libro.titulo}</h2>
                <div class=imagen style='background-image: url(./images/${libro.rutaImagen})'></div>
                <h3>${libro.autor}</h3>
                <p>$${libro.precio}</p>
                <button id=${libro.id} class=btnAgregarCarrito>Agregar al carrito</button>
                <div class=contenedorVerCarrito>
                    <button id=verCarrito${libro.id} class=oculto>Ver carrito</button>
                    <div id=contenedorLibroAgregado${libro.id} class=oculto>
                        <p><img src="./icon/icono-verificacion.png">¡Libro agregado!</p>
                    </div>
                </div>
            `
        }
        container.appendChild(tarjetaLibro)

        // Evento click para agregar al carrito
        let botonAgregarCarrito = document.getElementById(libro.id)
        if (botonAgregarCarrito){
            botonAgregarCarrito.onclick = agregarAlCarrito
        }
    })


    // Elementos del DOM y eventos click y keyup para filtrar búsqueda
    let botonBuscar = document.getElementById('botonBuscar')
    botonBuscar.onclick = () => filtrarYMostrar(libros, input.value)

    let inputBuscar = document.getElementById('input')
    inputBuscar.addEventListener('keyup', filtrarConEnter)

    let filtrosCategoria = document.getElementsByClassName('filtroCategoria')
    for (const filtroCategoria of filtrosCategoria) {
        filtroCategoria.addEventListener('click', filtrarCategoria)
    }

    let precioMinInput = document.getElementById('precioMin')
    let precioMaxInput = document.getElementById('precioMax')
    let botonFiltrarPrecio = document.getElementById('filtrarPrecio')
    botonFiltrarPrecio.onclick = () => filtrarPorPrecio(libros, parseInt(precioMinInput.value), parseInt(precioMaxInput.value))

    // Elemento DOM y evento para mostrar y ocultar el carrito
    let iconoCarrito = document.getElementById('iconoCarrito')
    iconoCarrito.addEventListener('click', () => {
        if(carritoVisible) {
            return
        }
        mostrarOcultar()
    })
}

// Función para filtrar por título o autor con click
function filtrarYMostrar(arrayLibros, valueFilter) {
    let librosFiltrados = arrayLibros.filter(libro => libro.titulo.toLowerCase().includes(valueFilter.toLowerCase()) || libro.autor.toLowerCase().includes(valueFilter.toLowerCase()))
    mostrarLibros(librosFiltrados)
}

// Función para filtrar por título o autor con enter
function filtrarConEnter(e) {
    if (e.keyCode === 13) {
        let librosFiltrados = libros.filter(libro => libro.titulo.toLowerCase().includes(input.value.toLowerCase()) || libro.autor.toLowerCase().includes(input.value.toLowerCase()))
        mostrarLibros(librosFiltrados)
    }
}

// Función para filtrar por categoría
function filtrarCategoria(e) {
    let categoriaFiltrada = libros.filter(libro => libro.categoria.toLowerCase() === e.target.value.toLowerCase())
    let inputBuscar = document.getElementById('input').value
    filtrarYMostrar(categoriaFiltrada, inputBuscar)
}

// Función para filtrar por precio
function filtrarPorPrecio(arrayLibros, minPrecio, maxPrecio) {
    let filtroPorPrecio = arrayLibros.filter(libro => libro.precio >= minPrecio && libro.precio <= maxPrecio)
    mostrarLibros(filtroPorPrecio)
}

// Función para mostrar y ocultar los libros y el carrito
function mostrarOcultar() {
    let padreContainer = document.getElementById('padreContainer')
    let carritoContenedor = document.getElementById('carritoContenedor')
    carritoVisible = !carritoVisible
    padreContainer.classList.toggle('oculto')
    carritoContenedor.classList.toggle('oculto')
}

function mostrarOcultarBotonAgregarCarrito(libroId) {
    let botonAgregarCarritoLibro = document.getElementById(libroId)
    let verCarrito = document.getElementById(`verCarrito${libroId}`)
    let contenedorLibroAgregado = document.getElementById(`contenedorLibroAgregado${libroId}`)
    botonAgregarCarritoLibro.classList.toggle('oculto')
    verCarrito.classList.toggle('oculto')
    contenedorLibroAgregado.classList.toggle('oculto')

    verCarrito.addEventListener('click', mostrarOcultar)
}

// ---------------------- SECCION CARRITO ----------------------

// Función para agregar al carrito y convertir un objeto JavaScript en cadena JSON
function agregarAlCarrito(e) {
    let libroBuscado = libros.find(libro => libro.id === Number(e.target.id))
    let libroEnCarrito = carrito.find(item => item.id === libroBuscado.id)

    if (libroEnCarrito) {
        if (libroEnCarrito.cantidad >= libroBuscado.stock) {
            Swal.fire({
                title: 'Falta de stock',
                text: 'No hay suficiente stock de este producto.',
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                    popup: 'alertCompra'
                }
            })
            return
        }

        libroEnCarrito.cantidad++
        libroEnCarrito.precio = libroEnCarrito.precioBase * libroEnCarrito.cantidad
        
    } else {
        if (1 > libroBuscado.stock) {
            Swal.fire({
                title: 'Falta de stock',
                text: 'No hay suficiente stock de este producto.',
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                    popup: 'alertCompra'
                }
            })
            return
        }
        carrito.push({
            id: libroBuscado.id,
            titulo: libroBuscado.titulo,
            autor: libroBuscado.autor,
            precioBase: libroBuscado.precio,
            precio: libroBuscado.precio,
            cantidad: 1,
            stock: libroBuscado.stock
        })
    }
    mostrarOcultarBotonAgregarCarrito(e.target.id)
    actualizarCarrito()
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

// Función para cambiar la cantidad de un libro en el carrito
function cambiarCantidad(libro, cambio) {
    let libroEnCarrito = carrito.find(item => item.id === libro.id);

    if (libroEnCarrito) {
        let nuevaCantidad = (libroEnCarrito.cantidad || 0) + cambio;

        if (nuevaCantidad > libro.stock) {
            Swal.fire({
                title: 'Falta de stock',
                text: 'No hay suficiente stock de este producto.',
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                    popup: 'alertCompra'
                }
            })
            return
        }

        if (nuevaCantidad <= 0) {
            return
        }

        libroEnCarrito.cantidad = nuevaCantidad
        libroEnCarrito.precio = libroEnCarrito.precioBase * nuevaCantidad

        actualizarCarrito()
        localStorage.setItem('carrito', JSON.stringify(carrito))
    }
}

// Función para actualizar carrito
function actualizarCarrito() {
    let carritoFisico = document.getElementById('carrito')
    carritoFisico.innerHTML = ''

    if (carrito.length >= 1) {
        carritoFisico.innerHTML = `
            <h2>Título</h2>
            <h2>Autor</h2>
            <h2>Subtotal</h2>
            <h2>Cantidad</h2>
        `
    }

    carrito.forEach(libro => {
        let subtotal = libro.precioBase * libro.cantidad
        carritoFisico.innerHTML += `
            <h3>${libro.titulo}</h3>
            <p>${libro.autor}</p>
            <p>$${subtotal}</p>
            <div class=contenedorPadreCantidad>
                <div class=contenedorAumentarRestar>
                    <button class=botonAumentarRestar id=botonMenos${libro.id}>-</button>
                    <p id=cantidad>${libro.cantidad}</p>
                    <button class=botonAumentarRestar id=botonMas${libro.id}>+</button>
                </div>
                <button class=eliminar id="eliminar${libro.id}">
                    <img class="btnEliminar" data-id=${libro.id} src="./icon/icons-eliminar.png"
                </button>
            </div>
        `
    })

    let total = calcularTotal()
    carritoFisico.innerHTML += `
    <h3>Total:</h3>
    <p></p>
    <p>$${total}</p>
    `

    // Evento click para los botones - y +
    carrito.forEach(libro => {
        let botonMenos = document.getElementById(`botonMenos${libro.id}`)
        botonMenos.onclick = () => cambiarCantidad(libro, -1);
    
        let botonMas = document.getElementById(`botonMas${libro.id}`)
        botonMas.onclick = () => cambiarCantidad(libro, 1)
    });

    // Evento click para finalizar compra
    let botonFinalizarCompra = document.getElementById('finalizarCompra')
    botonFinalizarCompra.addEventListener('click', finalizarCompra)

    // Evento click para eliminar producto del carrito
    let botonesEliminar = document.getElementsByClassName('btnEliminar')
    for (const botonEliminar of botonesEliminar) {
        botonEliminar.addEventListener('click', eliminarDelCarrito)
    }
}

function eliminarDelCarrito(e) {
    const libroId = parseInt(e.target.dataset.id)
    const index = carrito.findIndex(item => item.id === libroId)

    if(index !== -1) {
        carrito.splice(index, 1)
        actualizarCarrito()
        localStorage.setItem('carrito', JSON.stringify(carrito))
    }
}

// Función para finalizar compra
function finalizarCompra() {
    if (carrito.length > 0) {
        carrito = []
        actualizarCarrito()
        localStorage.removeItem("carrito")

        mostrarLibros(libros, carrito)

        Swal.fire({
            title: '¡Felicitaciones por su compra!',
            icon: 'success',
            confirmButtonText: 'Ok',
            customClass: {
                popup: 'alertCompra'
            }
        })
    }
}

// Función para calcular el total del carrito
function calcularTotal() {
    let total = 0
    for (let i = 0; i < carrito.length; i++) {
        total += carrito[i].precio
    }
    return total
}











































