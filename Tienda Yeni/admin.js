

let editId = null;


// 🔐 LOGIN
function login(){

  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, pass)
  .then(() => {

    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";

    cargarAdmin();

  })
  .catch(err => {
    alert("Error login");
    console.log(err);
  });

}


// 📦 CARGAR PRODUCTOS

function cargarAdmin(){

  db.ref("productos").on("value", snap => {

    const data = snap.val() || {};
    const cont = document.getElementById("lista");

    cont.innerHTML = "";

    Object.keys(data).forEach(id => {

      const p = data[id];

      cont.innerHTML += `
        <div class="card">

          <img src="${p.img}" width="80">

          <h4>${p.nombre}</h4>
          <p>$${p.precio}</p>
          <small>${p.categoria}</small>

          <button onclick="editar('${id}')">
            ✏️ Editar
          </button>

          <button onclick="eliminarProducto('${id}')">
            🗑️ Eliminar
          </button>

        </div>
      `;
    });

  });

}


// ✏️ EDITAR

function editar(id){

  db.ref("productos/" + id).once("value").then(snap => {

    const p = snap.val();

    editId = id;

    document.getElementById("nombre").value = p.nombre;
    document.getElementById("precio").value = p.precio;
    document.getElementById("categoria").value = p.categoria;

  });

}

// 💾 GUARDAR / ACTUALIZAR

function subir(){

  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const categoria = document.getElementById("categoria").value;
  const file = document.getElementById("img").files[0];

  if(!nombre || !precio || !categoria){
    alert("Completa todo");
    return;
  }

  if(editId){

    if(file){

      const reader = new FileReader();

      reader.onload = function(){

        db.ref("productos/" + editId).update({
          nombre,
          precio,
          categoria,
          img: reader.result
        });


        editId = null;
        limpiar();
        alert("Editado ✔");

      };

      reader.readAsDataURL(file);

    } else {

      db.ref("productos/" + editId).update({
        nombre,
        precio,
        categoria
      });

      editId = null;
      limpiar();
      alert("Editado ✔");
    }

    return;
  }

  // nuevo producto
  const reader = new FileReader();

  reader.onload = function(){

    db.ref("productos").push({
      nombre,
      precio,
      categoria,
      img: reader.result
    });

    limpiar();
    alert("Creado ✔");

  };

  reader.readAsDataURL(file);
}


// 🗑️ ELIMINAR
function eliminarProducto(id){

  if(confirm("¿Seguro que quieres eliminar?")){

    db.ref("productos/" + id).remove()
      .then(() => {
        alert("Eliminado ✔");
      });

  }

}


// 🧹 LIMPIAR FORM
function limpiar(){

  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("img").value = "";

}