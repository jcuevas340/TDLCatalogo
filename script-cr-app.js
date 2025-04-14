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

        // Agregamos eventos
        document.getElementById("btn-buscar").addEventListener("click", filtrarProductos);
        addEventListener("keypress", e => {
            if (e.key === "Enter") {
                filtrarProductos();
            }
        });
        vaciarBuscador();
        
    })
    .catch(error => console.error("Error al cargar el JSON:", error));

// Función para filtrar productos por búsqueda y categoría
function filtrarProductos() {
    let busqueda = document.getElementById("buscar").value.toLowerCase();

    let resultados = datos.filter(producto => {
        let coincideBusqueda = 
        producto.parte.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda) ||
        (producto.conversiones && producto.conversiones.some(conv =>
            conv.parte.toLowerCase().includes(busqueda) ||
            conv.marca.toLowerCase().includes(busqueda)
        )) || 
        (producto.aplicaciones && producto.aplicaciones.some(app =>
            app.marca.toLowerCase().includes(busqueda) ||
            app.modelo.toLowerCase().includes(busqueda) ||
            app.años.toLowerCase().includes(busqueda)
        ));

        return coincideBusqueda;
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
        div.classList.add('tabla-producto');

        let h2 = document.createElement('h2');
        h2.textContent = producto.parte;

        let h4 = document.createElement('h4');
        h4.textContent = producto.marca;

        let table = document.createElement('table');
        table.classList.add('tabla-conversiones');

        let thead = document.createElement('thead');
        let tr = document.createElement('tr');
        let thNumero = document.createElement('th');
        let thMarca = document.createElement('th');
        thNumero.textContent = "Numero de parte";
        thMarca.textContent = "Marca";
        tr.appendChild(thNumero); // ✅ Usamos la variable correcta
        tr.appendChild(thMarca); // ✅ Usamos la variable correcta
        thead.appendChild(tr);
        table.appendChild(thead);

        let tbody = document.createElement('tbody');
        producto.conversiones.forEach(conversion => {
            let row = document.createElement('tr');
            let tdNumero = document.createElement('td');
            let tdMarca = document.createElement('td');
            tdNumero.textContent = conversion.parte;
            tdMarca.textContent = conversion.marca;
            row.appendChild(tdNumero);
            row.appendChild(tdMarca);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        div.appendChild(h2);
        div.appendChild(h4);
        div.appendChild(table);
        contenedor.appendChild(div);
    });
}


function vaciarBuscador() {
    document.getElementById("btn-borrar").addEventListener("click", () => {
        document.getElementById("buscar").value = '';
    });
}