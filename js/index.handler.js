//elements
let barraBusqueda = document.querySelector("#barraBusqueda");
let contenedorCarrito = document.querySelector("#carrito");
let contenedorProductos = document.getElementById("contenedorProducto");
//objects
var carrito = [];
var productos = [];

//api url
const API_URL = "http://localhost:3000/api/productos";

//fetch handlers + error handlers
const handleFetch = async (url, options) => {
    return await fetch(url, options).then(handleError);
};
const handleError = (res) => {
    if(!res.ok) throw new Error(res.statusText);
    return res;
};
     
//mostrar + obtener productos
const mostrarProductos = (array) => {
    console.log(`mostrarProductos: array:${array.length}`);
    console.table(array); // Recibimos correctamente en formato tabla los productos que nos manda la funcion obtenerProductos()
    
    let htmlProducto = "";
    array.forEach(producto => {
        htmlProducto += `
            <div class="card-producto">
                <img src="${producto.img_url}" alt="${producto.nombre}">
                <h5>${producto.nombre}</h5>
                <p>Id: ${producto.id}</p>
                <button onclick="agregarACarrito(${producto.id})">agregar</button>
                <p>$${producto.precio}</p>
            </div>
            `;
    });
    contenedorProductos.innerHTML = htmlProducto;
};
const obtenerProductos = async () => {
    try {
        let res = await handleFetch(API_URL);
        let data = await res.json();
        console.log(`obtenerProductos: ${JSON.stringify(data)}`);
        
        productos = data.payload; 
        mostrarProductos(productos);
    } 
    catch(error) {
        console.error(error);
    }
};

// filtrado de productos por nombre
function filtrarProducto() {
    let lectura = barraBusqueda.value;
    const array = productos.filter(producto => producto.nombre.includes(lectura));
    mostrarProductos(array);   
};
//se ejecutara cada vez que se presione una tecla
barraBusqueda.addEventListener("keyup",filtrarProducto)

// async function obtenerProductos() {
//     try {
//         let respuesta = await fetch(url); // Hacemos una peticion a nuestro nuevo endpoint en http://localhost:3000/productos
//         console.log("holaaaaaaaaa");
//         let data = await respuesta.json();

//         console.log(data); 

//         let productos = data.payload; 

//         mostrarProductos(productos);

//     } catch(error) {
//         console.error(error);
//     }
// }
        
// Mostramos los productos que se encutra en le array
// function mostrarProductos(array){
//     let cartaProducto= "";
//     array.forEach(element => {
//         cartaProducto += `
//         <div class="card-producto">
//             <img src="${producto.img_url}" alt="${producto.nombre_producto}">
//             <h5>${producto.nombre_producto}</h5>
//             <p>Id: ${producto.id}</p>
//             <p>$${producto.precio}</p>
//         </div> `;
//     });
//     contenedorProductos.innerHTML = cartaProducto;
// }

// carrito
// filtramos por id y pusheamos al carrito
function agregarACarrito(id) {
    carrito.push(productos.find(valor => valor.id == id))
    mostrarCarrito();
}
// carrito actualizado
// si el array carrito esta vacio lo borra de la memoria y muestra un mensaje
function mostrarCarrito() {
    let cartaCarrito = "";
    if(carrito.length > 0){
        cartaCarrito += "<ul>"
        carrito.forEach((element,indice) => {
            cartaCarrito+= `
            <li class= "bloque-carrito">
                <div>
                    <img src="${element.img_url}" alt="${element.nombre}">
                    <p class = "nombre-item">${element.nombre}-$${element.precio}-${indice}</p> 
                </div>
                <button class= "eliminar-bloque" onclick="eliminarCarrito(${element.indice})">Eliminar</button>
            </li>`;
        });
        guardarCarritoLocalStorage();
        cartaCarrito += `
            </ul>
                <button class= "eliminar-carrito" onclick="vaciarCarrito()">Vaciar carrito</button>
        `; 
    }
    else{
        borrarCarritoLocalStorage();
        cartaCarrito += `
        <h4 class="vacio">Agregue un producto al carrito</h4>
        `;
    }
    
    contenedorCarrito.innerHTML = cartaCarrito;
}

// varia array y lo actualiza
function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
}
// elimina producto por indice y actualiza
function eliminarCarrito(indice) {
    carrito.splice(indice,1);
    mostrarCarrito();
}
// permanencia de carrito en localStorage
function guardarCarritoLocalStorage() {
    if(carrito.length > 0) {
        localStorage.setItem("carrito",JSON.stringify(carrito));
    }
    else {
        borrarCarritoLocalStorage();
    }
}
// borra el localStorage si el carrito esta vacio 
function borrarCarritoLocalStorage(){
    if(carrito.length== 0){
        localStorage.removeItem("carrito");
    }
}
// lee key "carrito" para recuperar el array de objeto de carrito
function cargarCarrito() {
    if(localStorage.getItem("carrito") != null){
        let carritoAux = JSON.parse(localStorage.getItem("carrito"));
        if(carritoAux.length>0){
            carrito = carritoAux;
        }
     }
}

// Inicializamo el mostrar productos y mostrar carrito
function init() {
    // tenemos que leer el almacenamiento local antes de mostrarCarrito(), sino  entra al else de mostrar carrito y me borra la memoria

    cargarCarrito();
    obtenerProductos();
    mostrarCarrito();
}

init();