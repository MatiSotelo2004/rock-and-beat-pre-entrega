//-------VARIABLES-------
let carrito = [];
let carritoContador = document.getElementById("carrito_contador");
const carritoButton = document.getElementById("carrito");
const seccionVinilos = document.getElementById("seccion-vinilos");
const modalCarrito = document.querySelector(".modal_carrito");
const contenidoModal = document.querySelector(".productos-carrito");
const vaciarCarrito = document.getElementById("vaciar-carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");

//------FUNCIONES-------
function inicializarCarrito() {
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  actualizarCarrito();
}

function actualizarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  if (carrito.length > 0) {
    carritoContador.textContent = carrito.length;
    carritoContador.style.display = "inline";
  } else {
    carritoContador.style.display = "none";
    contenidoModal.innerHTML = `<p id="carrito-vacio">El carrito esta vacio</p>`;
  }
}
function insertarCarrito(e) {
  let producto = {
    id: e.target.getAttribute("data-id"),
    nombre: e.target.getAttribute("data-name"),
    precio: parseFloat(e.target.getAttribute("data-precio")),
    img: e.target.getAttribute("data-img"),
    cantidad: 1,
  };
  if (carrito.some((item) => item.id === producto.id)) {
    let index = carrito.findIndex((item) => item.id === producto.id);
    carrito[index].cantidad++;
  } else {
    carrito.push(producto);
  }
  actualizarCarrito();
}

//------EVENTOS--------
document.addEventListener("DOMContentLoaded", () => {
  inicializarCarrito();
});

const botonesComprar = document.querySelectorAll(".Comprar-button");
botonesComprar.forEach((boton) => {
  boton.addEventListener("click", insertarCarrito);
});

carritoButton.addEventListener("click", () => {
  modalCarrito.style.display = "block";
});

cerrarCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  modalCarrito.style.display = "none";
});

vaciarCarrito.addEventListener("click", (e) => {
  carrito = [];
  actualizarCarrito();  
});
