// Variable para guardar los datos del JSON
let datos = [];

fetch('base-datos.json')
    .then(response => response.json())
    .then(data => {
        datos = data; // Guardamos los datos
        mostrarResultados(datos); // Mostramos los datos iniciales

        // Evento de búsqueda
        document.getElementById("btn-buscar").addEventListener("click", buscarProductos);

        // Evento de tecla "Enter" en el input de búsqueda
        document.getElementById("buscar").addEventListener("keypress", e => {
            if (e.key === "Enter") {
                buscarProductos();
            }
        });

        // Evento para vaciar el buscador
        document.getElementById("btn-borrar").addEventListener("click", () => {
            document.getElementById("buscar").value = '';
            mostrarResultados(datos);
        });
    })
    .catch(error => console.error("Error al cargar el JSON:", error));

// Función para buscar productos
function buscarProductos() {
    let busqueda = document.getElementById("buscar").value.toLowerCase().trim();
    
    if (busqueda === "") {
        mostrarResultados(datos);
        return;
    }

    let resultados = datos.filter(producto => 
        producto.parte.toLowerCase().includes(busqueda) || 
        producto.descripcion.toLowerCase().includes(busqueda)
    );

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
        img.height = 150;
        img.classList.add("imagen");
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
