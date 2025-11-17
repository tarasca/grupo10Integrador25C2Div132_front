const productos= [
    {id:1,nombre:"reel Curado 200DC",precio: 600000, rutaImg:"https://acdn-us.mitiendanube.com/stores/004/447/303/products/d_nq_np_2x_630790-mla50018082669_052022-f-320137128a760877ae17430238035506-1024-1024.jpg"},
    {id:2,nombre:"caña slx 20lb",precio:240000, rutaImg:"https://www.devotocamping.com.ar/cache_images/7/6/2/4/6/76246f312da1cbe9fc4949bfce9a71d9043cd041--.jpg"},
    {id:3,nombre:"caña mojo bass 20lb",precio: 450000, rutaImg:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA94A4kiu07ikZhB1UOd-K8l5PTTsg-A-9kw&s"},
    {id:4,nombre:"reel legacy",precio:430000 ,rutaImg:"https://http2.mlstatic.com/D_NQ_NP_692009-MLA91374490147_082025-O.webp"},
    {id:5,nombre:"caña curado brasil 20lb",precio: 500000, rutaImg:"https://http2.mlstatic.com/D_NQ_NP_819776-MLA75301393868_032024-O.webp"},
    {id:6,nombre:"multifilamento power pro",precio:120000, rutaImg:"https://www.devotocamping.com.ar/cache_images/d/7/f/9/4/d7f94d65e7c0a8fcc51d967d3c970cf9adc23c4c--.jpg"},
    {id:7,nombre:"señuelo rapala",precio:60000, rutaImg:"https://acdn-us.mitiendanube.com/stores/005/733/648/products/73-3541292ea09053404917398204050962-1024-1024.jpg"}
];
//let contenedorProducto= document.querySelector("#contenedorProducto");
let barraBusqueda = document.querySelector("#barraBusqueda");
let contenedorCarrito= document.querySelector("#carrito");
let carrito =[];
let contenedorProductos = document.getElementById("contenedorProducto");
 const url = "http://localhost:3000/productos";

console.log("holaaaaaaaaaaaa")
async function obtenerProductos() {
    try {
        let respuesta = await fetch(url); // Hacemos una peticion a nuestro nuevo endpoint en http://localhost:3000/productos
        console.log("holaaaaaaaaa");
        let data = await respuesta.json();

        console.log(data); 

        let productos = data.payload; 

        mostrarProductos(productos);

    } catch(error) {
        console.error(error);
    }
}
        
// Mostramos los productos que se encutra en le array
function mostrarProductos(array){
    let cartaProducto= "";
    array.forEach(element => {
        cartaProducto += `
        <div class="card-producto">
            <img src="${producto.img_url}" alt="${producto.nombre_producto}">
            <h5>${producto.nombre_producto}</h5>
            <p>Id: ${producto.id}</p>
            <p>$${producto.precio}</p>
        </div> `;
    });
    contenedorProductos.innerHTML = cartaProducto;
}
// Inicializamo el mostrar productos y mostrar carrito
function init(){
    // tenemos que leer el almacenamiento local antes de mostrarCarrito(), sino  entra al else de mostrar carrito y me borra la memoria

    cargarCarrito();
   obtenerProductos();
    mostrarCarrito();
}


init();
//cada vez que vaya presionando una tecla se va a ejecutar el addEventListener
barraBusqueda.addEventListener("keyup",filtrarPorducto)
// Filtramos los productos que tiene el string de la barra de busqueda incluido en el nombre del producto
function filtrarPorducto()
{
    let lectura = barraBusqueda.value;
    const array = productos.filter(producto => producto.nombre.includes(lectura));
    mostrarProductos(array);
    
}
// Al momento de presionar agregar carrito buscamos el producto por su id y hacemos un push al carrito con el producto
function agregarACarrito(id){
    carrito.push(productos.find(valor => valor.id == id))
   mostrarCarrito();
   

}
// Muestra el carrito actualizado. Si el array carrito esta vacio lo borra de la memoria y muestra un mensaje
function mostrarCarrito(){
    let cartaCarrito = "";
    if(carrito.length>0)
    {
        cartaCarrito+= "<ul>"
        carrito.forEach((element,indice) => {
            cartaCarrito+= `<li class= "bloque-carrito">
            <div>
            <img src="${element.rutaImg}" alt="${element.nombre}">
            <p class = "nombre-item">${element.nombre}-$${element.precio}-${indice}</p> </div>
            
            <button class= "eliminar-bloque" onclick="eliminarCarrito(${element.indice})">Eliminar</button> </li>`;
        });
        guardarCarritoLocalStorage();
        cartaCarrito+=`</ul><button class= "eliminar-carrito" onclick= "vaciarCarrito()">Vaciar carrito</button>`; 
    }
    else{
        borrarMemoria();
        cartaCarrito+=`<h4 class= "vacio">Agregue un producto al carrito</h4>`
    }
    
    contenedorCarrito.innerHTML= cartaCarrito;
}




// Si presiona  "vaciar carrito"  inicializa el array a vacio y actualiza el carrito
function vaciarCarrito(){
    carrito= [];
    mostrarCarrito();
}
// si presiona "eliminar" busca el indice del producto y lo elimina. luego actualiza carrito
function eliminarCarrito(indice)
{
    carrito.splice(indice,1);
    mostrarCarrito();
}
// guarda  el carrito al almacenamiento local 
function guardarCarritoLocalStorage()
{
    if(carrito.length > 0){
        localStorage.setItem("carrito",JSON.stringify(carrito));
    }else{
         borrarMemoria();
    }
}
// borra el almacenamiento local si el carrito esta vacio 
function borrarMemoria(){
    if(carrito.length== 0){
        localStorage.removeItem("carrito");
    }
}
// lee key("carrito") que esta en JSON  parsea para recuperar el array de objeto de carrito
function cargarCarrito(){
    
    if(localStorage.getItem("carrito") != null){
        let carritoAux = JSON.parse(localStorage.getItem("carrito"));
        if(carritoAux.length>0){
            carrito = carritoAux;
        }
     }
}
