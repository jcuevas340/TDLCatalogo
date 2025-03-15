// Variable para guardar los datos del JSON
let datos = [];

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
                filtrarProductos(datos);
            }
        });
        vaciarBuscador();
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

        return coincideBusqueda && coincideCategoria && producto.marca.toLowerCase().includes("fleetguard");
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
        img.classList.add("imagen");
        img.classList.add("fleetguard-img");
        img.style.objectFit = "cover";

        let h2 = document.createElement("h2");
        h2.classList.add('parte');
        h2.textContent = producto.parte;

        let p = document.createElement("p");
        p.classList.add('descripcion');
        p.textContent = producto.descripcion;

        div.appendChild(img);
        div.appendChild(h2);
        div.appendChild(p);
        contenedor.appendChild(div);
    });
}

function vaciarBuscador() {
    document.getElementById("btn-borrar").addEventListener("click", () => {
        document.getElementById("buscar").value = '';
        filtrarProductos();
    });
}
