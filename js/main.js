// const productos= [
//     {id:1,nombre:"reel Curado 200DC",precio: 600000, rutaImg:"https://acdn-us.mitiendanube.com/stores/004/447/303/products/d_nq_np_2x_630790-mla50018082669_052022-f-320137128a760877ae17430238035506-1024-1024.jpg"},
//     {id:2,nombre:"caña slx 20lb",precio:240000, rutaImg:"https://www.devotocamping.com.ar/cache_images/7/6/2/4/6/76246f312da1cbe9fc4949bfce9a71d9043cd041--.jpg"},
//     {id:3,nombre:"caña mojo bass 20lb",precio: 450000, rutaImg:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA94A4kiu07ikZhB1UOd-K8l5PTTsg-A-9kw&s"},
//     {id:4,nombre:"reel legacy",precio:430000 ,rutaImg:"https://http2.mlstatic.com/D_NQ_NP_692009-MLA91374490147_082025-O.webp"},
//     {id:5,nombre:"caña curado brasil 20lb",precio: 500000, rutaImg:"https://http2.mlstatic.com/D_NQ_NP_819776-MLA75301393868_032024-O.webp"},
//     {id:6,nombre:"multifilamento power pro",precio:120000, rutaImg:"https://www.devotocamping.com.ar/cache_images/d/7/f/9/4/d7f94d65e7c0a8fcc51d967d3c970cf9adc23c4c--.jpg"},
//     {id:7,nombre:"señuelo rapala",precio:60000, rutaImg:"https://acdn-us.mitiendanube.com/stores/005/733/648/products/73-3541292ea09053404917398204050962-1024-1024.jpg"}
// ];
const contenedorName = document.getElementById("contenedor-name");
let nombreUsuario = sessionStorage.getItem("nombreUsuario");
if (!nombreUsuario) {
  window.location.href = "index.html";
} else {
  contenedorName.innerHTML = `<p">${nombreUsuario}</p>`;
}
const URL_BASE = "http://localhost:3000/";
let contenedorCarrito = document.querySelector("#carrito");
let contenedorProductos = document.getElementById("contenedorProducto");
const url = "http://localhost:3000/productos/paginacion";
let limit = 10;
let offset = 0;
let precioTotal = 0;
// const url = "http://localhost:3000/productos"; // Guardamos en una variable la url de nuestro endpoint
let productos = null;
let carrito = [];

//let contenedorProducto= document.querySelector("#contenedorProducto");
let barraBusqueda = document.querySelector("#barraBusqueda");
async function obtenerProductos() {
  try {
    let respuesta = await fetch(`${url}?limit=${limit}&offset=${offset}`); // Hacemos una peticion a nuestro nuevo endpoint en http://localhost:3000/products

    let data = await respuesta.json();

    productos = data.payload;
    if (data.total > limit) {
      mostrarBotonesPaginacion();
    }
    mostrarProductos(productos);
    if (offset === 0) {
      document.getElementById("btnVolver").style.display = "none";
    }

    // Ocultar "cargar más" si estamos al final
    if (offset + limit >= data.total) {
      document.getElementById("btnCargarMas").style.display = "none";
    }
  } catch (error) {
    console.error(error);
  }
}
function mostrarProductos(array) {
  // Recibimos correctamente en formato tabla los productos que nos manda la funcion obtenerProductos()

  let htmlProducto = "";

  array.forEach((producto) => {
    htmlProducto += `
                    <div class="card-producto">
                        <img src="${URL_BASE}${producto.img_url}" alt="${producto.nombre}">
                        <h5>${producto.nombre}</h5>
                       
                        <p>$${producto.precio}</p>
                        <button onclick = "agregarACarrito(${producto.id})">Agregar al carrito</button>
                    </div>
                `;
  });

  contenedorProductos.innerHTML = htmlProducto;
}

function agregarACarrito(id) {
  // let carrito= [];
  console.log(productos);
  carrito.push(productos.find((valor) => valor.id == id));
  console.table(carrito);
  mostrarCarrito();
}
// Muestra el carrito actualizado. Si el array carrito esta vacio lo borra de la memoria y muestra un mensaje
function mostrarCarrito() {
  let cartaCarrito = "";
  if (carrito.length > 0) {
    cartaCarrito += "<ul>";
    carrito.forEach((element, indice) => {
      precioTotal += element.precio;
      cartaCarrito += `<li class= "bloque-carrito">
            <div>
            <img src="${URL_BASE}${element.img_url}" alt="${element.nombre}">
            <p class = "nombre-item">${element.nombre}-$${element.precio}-${indice}</p> </div>
            
            <button class= "eliminar-bloque" onclick="eliminarCarrito(${indice})">Eliminar</button> </li>`;
    });
    guardarCarritoLocalStorage();
    cartaCarrito += `</ul><div class = "contenedor-precio">
    <p>precio Total: $${precioTotal} </p></div>
    <div class = "contenedorbutton">
    <button class= "button" onclick= "vaciarCarrito()">Vaciar carrito</button>
    <button class="button" id="btn-imprimir" onclick = "imprimirTicket()" >Imprimir ticket</button></div>`;
  } else {
    borrarMemoria();
    cartaCarrito += `<h4 class= "vacio">Agregue un producto al carrito</h4>`;
  }

  contenedorCarrito.innerHTML = cartaCarrito;
}

// Mostramos los productos que se encutra en le array
// function mostrarProductos(array) {
//   let cartaProducto = "";
//   array.forEach((element) => {
//     cartaProducto += `
//         <div class="card-producto">
//             <img src="${element.img_url}" alt="${element.nombre_producto}">
//             <h5>${element.nombre_producto}</h5>
//             <p>Id: ${element.id}</p>
//             <p>$${element.precio}</p>
//         </div> `;
//   });
//   contenedorProductos.innerHTML = cartaProducto;
// }
// Inicializamo el mostrar productos y mostrar carrito
function init() {
  // tenemos que leer el almacenamiento local antes de mostrarCarrito(), sino  entra al else de mostrar carrito y me borra la memoria

  cargarCarrito();
  obtenerProductos();
  mostrarCarrito();
}

init();
//cada vez que vaya presionando una tecla se va a ejecutar el addEventListener
barraBusqueda.addEventListener("keyup", filtrarPorducto);
// Filtramos los productos que tiene el string de la barra de busqueda incluido en el nombre del producto
function filtrarPorducto() {
  let lectura = barraBusqueda.value;
  const array = productos.filter((producto) =>
    producto.nombre.includes(lectura)
  );
  mostrarProductos(array);
}
// Al momento de presionar agregar carrito buscamos el producto por su id y hacemos un push al carrito con el producto
// function agregarACarrito(id) {
//   carrito.push(productos.find((valor) => valor.id == id));
//   mostrarCarrito();
// }
// Muestra el carrito actualizado. Si el array carrito esta vacio lo borra de la memoria y muestra un mensaje

// Si presiona  "vaciar carrito"  inicializa el array a vacio y actualiza el carrito
function vaciarCarrito() {
  carrito = [];
  mostrarCarrito();
}
// si presiona "eliminar" busca el indice del producto y lo elimina. luego actualiza carrito
function eliminarCarrito(indice) {
  carrito.splice(indice, 1);
  mostrarCarrito();
}
// guarda  el carrito al almacenamiento local
function guardarCarritoLocalStorage() {
  if (carrito.length > 0) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  } else {
    borrarMemoria();
  }
}
// borra el almacenamiento local si el carrito esta vacio
function borrarMemoria() {
  if (carrito.length == 0) {
    localStorage.removeItem("carrito");
  }
}
// lee key("carrito") que esta en JSON  parsea para recuperar el array de objeto de carrito
function cargarCarrito() {
  if (localStorage.getItem("carrito") != null) {
    let carritoAux = JSON.parse(localStorage.getItem("carrito"));
    if (carritoAux.length > 0) {
      carrito = carritoAux;
    }
  }
}
let contenedorBtn = document.getElementById("contonedorBTN");
function mostrarBotonesPaginacion() {
  contenedorBtn.innerHTML = `
    <button id="btnVolver" class="btn btn-secondary">Volver</button>
    <button id="btnCargarMas" class="btn btn-primary">Cargar más</button>
  `;

  document.getElementById("btnVolver").addEventListener("click", volverAtras);
  document
    .getElementById("btnCargarMas")
    .addEventListener("click", cargarMasProductos);
}
function volverAtras() {
  offset -= limit;

  if (offset < 0) offset = 0; // Para que nunca sea negativo

  obtenerProductos();
}

//  AVANZAR A LOS SIGUIENTES PRODUCTOS
function cargarMasProductos() {
  offset += limit;
  obtenerProductos();
}
function filtrarCategoria(tipo) {
  // Reinicia paginación
  offset = 0;

  const filtrados = productos.filter((producto) => producto.tipo === tipo);

  mostrarProductos(filtrados);

  // Ocultamos botones de paginación mientras filtramos
  document.getElementById("btnVolver").style.display = "none";
  document.getElementById("btnCargarMas").style.display = "none";
}
function quitarFiltros() {
  offset = 0; // reiniciar paginación
  barraBusqueda.value = ""; // limpiar búsqueda
  obtenerProductos(); // traer productos nuevamente
}

function imprimirTicket() {
  // Idealmente, primero se registra la venta, luego se imprime el ticket
  console.table(carrito); // Visualizamos el carrito

  // Para registrar las ventas a posteriori, guardaremos los ids de los productos del carrito
  let idProductos = []; // Array vacio de ids de producto

  // Gracias al CDN, extraemos la clase jspdf del objeto global window
  const { jsPDF } = window.jspdf;

  // Creamos una nueva instancia del documento pdf usando al clase jsPDF
  const doc = new jsPDF(); // Ahora doc tendra todos los metodos que le provee la herramienta jsPDF

  // Definimos el margen superior de 20px en el eje y -> eje vertical, el eje x será el eje horizontal
  let y = 20;

  // Establecemos el tamaño de 18px para el primer texto
  doc.setFontSize(18);

  // Escribimos el texto "Ticket compra" en la posicion x=10, y=10 del pdf
  doc.text("Llama-ticket de compra:", 20, y);

  // Aumentamos el espacio despues del titulo
  y += 15;

  // Cambiamos el tamaño de la fuente a 12px para los productos del ticket
  doc.setFontSize(12);

  // Iteramos el carrito e imprimimos nombre y precio
  carrito.forEach((producto) => {
    idProductos.push(producto.id); // Llenamos el array de ids de productos (necesario para la venta despues)

    doc.text(`${producto.nombre} - $${producto.precio}`, 30, y); // Creamos el texto por cada producto: nombre = $precio

    // Incrementamos la posicion vertical para evitar solapamiento
    y += 10;
  });

  // Calculamos el total del ticket usando reduce

  // Añadimos otro espacio de 5px en el eje vertical para separar el precio total de los productos
  y += 5;

  // Establecemos el tamaño de 15px para el precio total
  doc.setFontSize(14);

  // Escribimos el total del ticket en el PDF, despues del listado de productos
  doc.text(`Total: $${precioTotal}`, 20, y);

  // Imprimimos el ticket de venta
  doc.save("ticket.pdf");

  registrarVenta(precioTotal, idProductos);
}

async function registrarVenta(Total, idProductos) {
  const fechaAux = new Date()
    .toLocaleString("sv-SE", { hour12: false })
    .replace("T", " ");

  console.log(fechaAux);

  const data = {
    fecha: fechaAux,
    total: Total,
    nombre_usuario: nombreUsuario,
    products: idProductos,
  };
  console.log(data);

  const response = await fetch("http://localhost:3000/sales", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (response.ok) {
    console.log(response);
    alert(result.message);

    sessionStorage.removeItem("nombreUsuario");
    vaciarCarrito();
    window.location.href = "index.html";
  } else {
    alert(result.message);
  }
}
