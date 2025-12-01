//-------VARIABLES-------
let carrito = [];
let carritoContador = document.getElementById("carrito_contador");
const carritoButton = document.getElementById("carrito");
const seccionVinilos = document.querySelector(".prodvinilos");
const seccionAccesorios = document.querySelector(".prodaccesorios");
const modalCarrito = document.querySelector(".modal_carrito");
const contenidoModal = document.querySelector(".productos-carrito");
const vaciarCarrito = document.getElementById("vaciar-carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const totalMsg = document.getElementById("total-msg");
const botonConfirmar = document.getElementById("confirmar-carrito");

//------FUNCIONES-------
function inicializarCarrito() {
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  actualizarCarrito();
}

function actualizarCarrito() {
  if (carrito.length > 0) {
    let contador = 0;
    carrito.forEach((prod) => {
      contador += prod.cantidad;
    });
    carritoContador.textContent = contador;
    carritoContador.style.display = "inline";
  } else {
    carritoContador.style.display = "none";
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function insertarCarrito(e) {
  let producto = {
    id: e.target.getAttribute("data-id"),
    nombre: e.target.getAttribute("data-name"),
    precio: parseFloat(e.target.getAttribute("data-precio")),
    cantidad: 1,
  };
  if (carrito.some((item) => item.id === producto.id)) {
    let index = carrito.findIndex((item) => item.id === producto.id);
    carrito[index].cantidad++;
  } else {
    carrito.push(producto);
  }
  actualizarCarrito();
  alert("El producto fue añadido al carrito");
}

function renderizarCarrito() {
  let totalPrecio = 0;
  if (carrito.length > 0) {
    contenidoModal.innerHTML = "";
    carrito.forEach((prod, i) => {
      const subtotal = prod.cantidad * prod.precio;
      totalPrecio += subtotal;

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("carrito-item");
      itemDiv.innerHTML = `
                <div class="info-producto">
                    <strong>${prod.nombre}</strong>
                    <div class="controles-cantidad">
                        <button class="btn-cantidad" onclick="disminuirCantidad(${i})">-</button>
                        <span class="cantidad-numero">${prod.cantidad}</span>
                        <button class="btn-cantidad" onclick="aumentarCantidad(${i})">+</button>
                        <small class="precio-unitario"> x $${prod.precio.toLocaleString()}</small>
                    </div>
                </div>
                <div class="subtotal-eliminar">
                    <span>$${subtotal.toLocaleString()}</span>
                    <button class="btn-eliminar" onclick="eliminarDelCarrito(${i})">🗑️</button>
                </div>
            `;
      contenidoModal.appendChild(itemDiv);
    });
    totalMsg.innerHTML = `<p>Total a pagar: $${totalPrecio}</p>`;
  } else {
    contenidoModal.innerHTML = `<p id="carrito-vacio">El carrito esta vacio</p>`;
    totalMsg.innerHTML = "";
  }
}

function aumentarCantidad(i) {
  carrito[i].cantidad++;
  actualizarCarrito();
  renderizarCarrito();
}

function disminuirCantidad(i) {
  if (carrito[i].cantidad > 1) {
    carrito[i].cantidad--;
  } else {
    carrito.splice(i, 1);
  }
  actualizarCarrito();
  renderizarCarrito();
}

function eliminarDelCarrito(i) {
  carrito.splice(i, 1);
  actualizarCarrito();
  renderizarCarrito();
}
async function mostrarVinilos() {
  try {
    const respuesta = await fetch(
      "https://gist.githubusercontent.com/MatiSotelo2004/bd5f9f52005c8471e94ed49929b69f1d/raw/33a8fbf1f81bd65bbdbf297500e8c2af97fae45a/vinilos-pre-entrega.JSON"
    );
    const vinilos = await respuesta.json();

    seccionVinilos.innerHTML = "";
    vinilos.forEach((vinilo) => {
      const viniloCard = document.createElement("article");
      viniloCard.classList.add("producto-card");
      viniloCard.innerHTML = `
                <img src="${vinilo.imagen}" alt="Vinilo de ${vinilo.titulo}">
                <h4>${vinilo.titulo}</h4>
                <p class="Banda">${vinilo.artista}</p>
                <p class="Descripcion">${vinilo.descripcion}</p>
                <p class="Precio">$${vinilo.precio.toLocaleString()}</p> 
                <button class="Comprar-button" 
                  onclick="insertarCarrito(event)"
                  data-id="${vinilo.id}"
                  data-name="${vinilo.titulo}" 
                  data-precio="${vinilo.precio}"
                >Comprar 🛒</button>
            `;
      seccionVinilos.appendChild(viniloCard);
    });
  } catch (error) {
    console.log("Error al obtener los vinilos");
  }
}

//------EVENTOS--------
document.addEventListener("DOMContentLoaded", () => {
  inicializarCarrito();
  mostrarVinilos();
});

const botonesComprar = document.querySelectorAll(".Comprar-button");
botonesComprar.forEach((boton) => {
  boton.addEventListener("click", insertarCarrito);
});

carritoButton.addEventListener("click", () => {
  renderizarCarrito();
  modalCarrito.style.display = "block";
});

cerrarCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  modalCarrito.style.display = "none";
});

vaciarCarrito.addEventListener("click", (e) => {
  carrito = [];
  actualizarCarrito();
  renderizarCarrito();
});

botonConfirmar.addEventListener("click", (e) => {
  e.preventDefault();

  if (carrito.length == 0) {
    alert("No hay productos en el carrito");
  } else {
    location.href = "./gracias_por_comprar.html";
    carrito = [];
    actualizarCarrito();
  }
});
