// Variable para guardar los datos del JSON
let datos = [];
let carritoBtn = document.createElement("button");
    carritoBtn.classList.add("carrito");
    carritoBtn.textContent = "Agregar al carrito";
    carritoBtn.style.display = "none";
let carrito = [];

fetch('base-datos.json')
    .then(response => response.json())
    .then(data => {
        datos = data; // Guardamos los datos en la variable
        filtrarProductos(datos); // Mostramos todos los productos al inicio

        // Agregamos eventos
        document.getElementById("btn-buscar").addEventListener("click", filtrarProductos);
        document.getElementById("categoria").addEventListener("change", filtrarProductos);
        addEventListener("keypress", e => {
            if (e.key === "Enter") {
                filtrarProductos();
            }
        });
        vaciarBuscador();

        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("sumar")) {
                agregarProducto(e.target);
            }
            if (e.target.classList.contains("restar")) {
                quitarProducto(e.target);
            }
            if(e.target.classList.contains("carrito")){
                agregarCarrito();
            }
        });
        
    })
    .catch(error => console.error("Error al cargar el JSON:", error));

// Función para filtrar productos por búsqueda y categoría
function filtrarProductos() {
    let busqueda = document.getElementById("buscar").value.toLowerCase();
    let categoriaSeleccionada = document.getElementById("categoria").value;

    let resultados = datos.filter(producto => {
        let coincideBusqueda = 
            producto.parte.toLowerCase().includes(busqueda) ||
            producto.descripcion.toLowerCase().includes(busqueda);

        let coincideCategoria = categoriaSeleccionada === "OPCION" || producto.categoria.includes(categoriaSeleccionada);

        return coincideBusqueda && coincideCategoria && producto.marca.toLowerCase().includes("sampa");
    });

    mostrarResultados(resultados);
}

// Función para mostrar los productos en la página
function mostrarResultados(productos) {
    let contenedor = document.getElementById('container');
    contenedor.innerHTML = ''; // Limpiar los resultados anteriores

    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos</p>";
        return;
    }

    productos.forEach(producto => {
        let div = document.createElement('div');
        div.classList.add('producto');

        let img = document.createElement('img');
        img.src = producto.img;
        img.alt = producto.parte;
        img.width = 150;
        img.height = 130;
        img.classList.add("imagen");
        img.style.objectFit = "cover";

        let h2 = document.createElement("h2");
        h2.classList.add('parte');
        h2.textContent = producto.parte;

        let p = document.createElement("p");
        p.classList.add('descripcion');
        let descripcion = producto.descripcion.toLowerCase();
        p.textContent = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);

        let menos = document.createElement("button");
        menos.classList.add("restar");
        menos.textContent = "-";
        menos.disabled = true; // Inicialmente deshabilitado

        let cantidadSpan = document.createElement("span");
        cantidadSpan.classList.add("cantidad");
        cantidadSpan.textContent = "0";
        cantidadSpan.style.display = "none";

        let mas = document.createElement("button");
        mas.classList.add("sumar");
        mas.textContent = "+";

        div.appendChild(img);
        div.appendChild(h2);
        div.appendChild(p);
        div.appendChild(menos);
        div.appendChild(cantidadSpan);
        div.appendChild(mas);
        contenedor.appendChild(div);
    });

    contenedor.appendChild(carritoBtn);
}

function vaciarBuscador() {
    document.getElementById("btn-borrar").addEventListener("click", () => {
        document.getElementById("buscar").value = '';
        filtrarProductos();
    });
}

function agregarProducto(boton) {
    let productoDiv = boton.closest(".producto");
    let cantidadSpan = productoDiv.querySelector(".cantidad");
    let menosBtn = productoDiv.querySelector(".restar");
    let cantidad = parseInt(cantidadSpan.textContent);

    cantidad += 1;
    cantidadSpan.textContent = cantidad;

    // Habilitar el botón "restar" si la cantidad es mayor a 0
    if (cantidad > 0) {
        menosBtn.disabled = false;
        cantidadSpan.style.display = "inline";
        carritoBtn.style.display = "inline"; // Mostrar el botón de agregar al carrito
    }

    let claveProducto = productoDiv.querySelector(".parte").textContent;
    console.log(`${claveProducto}: ${cantidad}`);
}

function quitarProducto(boton) {
    let productoDiv = boton.closest(".producto");
    let cantidadSpan = productoDiv.querySelector(".cantidad");
    let menosBtn = productoDiv.querySelector(".restar");
    let cantidad = parseInt(cantidadSpan.textContent);

    if (cantidad > 0) {
        cantidad -= 1;
        cantidadSpan.textContent = cantidad;
    }

    // Deshabilitar el botón "restar" si la cantidad llega a 0
    if (cantidad === 0) {
        menosBtn.disabled = true;
        cantidadSpan.style.display = "none";
        carritoBtn.style.display = "none";
    }

    let claveProducto = productoDiv.querySelector(".parte").textContent;
    console.log(`${claveProducto}: ${cantidad}`);
}

function agregarCarrito() {
    carrito = []; // Reiniciar el carrito

    document.querySelectorAll(".producto").forEach(productoDiv => {
        let cantidadSpan = productoDiv.querySelector(".cantidad");
        let cantidad = parseInt(productoDiv.querySelector(".cantidad").textContent);

        if (cantidad > 0) {
            let claveProducto = productoDiv.querySelector(".parte").textContent;
            carrito.push({ producto: claveProducto, cantidad: cantidad });
        }

        // Reiniciar la cantidad a 0 después de agregar al carrito
        cantidadSpan.textContent = 0;
        cantidadSpan.style.display = "none";

        // Deshabilitar el botón "restar" si la cantidad llega a 0
        let menosBtn = productoDiv.querySelector(".restar");
        menosBtn.disabled = true;
    });

    console.log("Carrito:", carrito);
    localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardar en localStorage

    // Ocultar el botón de "Agregar al carrito"
    carritoBtn.style.display = "none";
}