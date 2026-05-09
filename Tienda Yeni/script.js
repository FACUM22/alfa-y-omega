function cargarProductos(categoria){

  db.ref("productos").on("value", snap => {

    const data = snap.val() || {};
    const cont = document.getElementById("productos");

    cont.innerHTML = "";

    Object.keys(data).forEach(id => {

      const p = data[id];

      if(categoria === "todos" || p.categoria === categoria){

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <img src="${p.img}">
          <h3>${p.nombre}</h3>
          <p>$${p.precio}</p>
        `;

        // 🛒 BOTÓN AGREGAR
        const btnAgregar = document.createElement("button");
        btnAgregar.textContent = "🛒 Agregar";
        btnAgregar.addEventListener("click", () => {
          agregarAlCarrito(p.nombre, p.precio);
        });

        // 📲 BOTÓN COMPRAR
        const btnComprar = document.createElement("button");
        btnComprar.textContent = "📲 Comprar";
        btnComprar.addEventListener("click", () => {
          comprar(p.nombre, p.precio);
        });

        card.appendChild(btnAgregar);
        card.appendChild(btnComprar);

        cont.appendChild(card);
      }

    });

  });

}
// 🛒 AGREGAR AL CARRITO
function agregarAlCarrito(nombre, precio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  let index = carrito.findIndex(p => p.nombre === nombre);

  if (index !== -1) {
    carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
  } else {
    carrito.push({
      nombre: nombre,
      precio: precio,
      cantidad: 1
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  mostrarCarrito();
}
// 🧾 MOSTRAR CARRITO + TOTAL + ELIMINAR
function mostrarCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let contenedor = document.getElementById("carrito");

  if (!contenedor) return;

  contenedor.innerHTML = "";

  let total = 0;

  carrito.forEach((prod, index) => {
    let subtotal = prod.precio * prod.cantidad;
    total += subtotal;

    contenedor.innerHTML += `
      <div>
        ${prod.nombre} x${prod.cantidad} - $${subtotal}
        <button onclick="eliminarProducto(${index})">❌</button>
      </div>
    `;
  });

  contenedor.innerHTML += `<h3>Total: $${total}</h3>`;
}

// ❌ ELIMINAR PRODUCTO
function eliminarProducto(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  carrito.splice(index, 1);

  localStorage.setItem("carrito", JSON.stringify(carrito));

  mostrarCarrito();
}

// 📲 COMPRAR POR WHATSAPP
async function checkout(){

  let carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];

  if(carrito.length === 0){
    alert("El carrito está vacío");
    return;
  }

  try {

    const respuesta = await fetch(
      "http://localhost:3000/crear-preferencia",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: carrito
        })
      }
    );

    const data = await respuesta.json();

    // 🔥 REDIRECCIÓN A MERCADO PAGO
    window.location.href = data.init_point;

  } catch(error){

    console.log(error);

    alert("Error al iniciar pago");
  }
}
async function comprar(producto, precio){

  try {

    const respuesta = await fetch(
      "http://localhost:3000/crear-preferencia",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: [
            {
              nombre: producto,
              precio: precio,
              cantidad: 1
            }
          ]
        })
      }
    );

    const data = await respuesta.json();

    window.location.href = data.init_point;

  } catch(error){

    console.log(error);

    alert("Error al iniciar pago");
  }
}
function cargarDestacados(){

  db.ref("productos").once("value").then(snap => {

    const data = snap.val() || {};

    const cont =
      document.getElementById("preview");

    if(!cont) return;

    cont.innerHTML = "";

    Object.keys(data).forEach(id => {

      const p = data[id];

      // 🔥 MOSTRAR SOLO DESTACADOS
      if(p.destacado === true){

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
          <img src="${p.img}">
          <h3>${p.nombre}</h3>
          <p>$${p.precio}</p>

          <button onclick="agregarAlCarrito('${p.nombre}', ${p.precio})">
            🛒 Agregar
          </button>

          <button onclick="comprar('${p.nombre}', ${p.precio})">
            💳 Comprar
          </button>
        `;

        cont.appendChild(card);
      }

    });

  });

}
