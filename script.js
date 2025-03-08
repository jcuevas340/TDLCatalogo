//Variable para guardar los datos del JSON
let datos = [];

fetch('base-datos.json')
    .then(response => response.json())
    .then(data => {
        datos = data; //Guardamos los datos data en la variable data
        mostrarResultados(datos); //Llamamos a la función mostrarResultados y le pasamos los datos
        document.getElementById("btn-buscar").addEventListener("click", function(){
            let busqueda = document.getElementById("buscar").value.toLowerCase(); //Obtenemos el valor del input buscar
            let resultados = datos.filter(producto => producto.parte.toLowerCase().includes(busqueda) || producto.descripcion.toLowerCase().includes(busqueda)); //Filtramos los datos para obtener los productos que contengan la busqueda
            mostrarResultados(resultados); //Mostramos los resultados
        });
        addEventListener("keypress", e => {
            if (e.key === "Enter") {
                mostrarResultados(datos);
            }
        });
        vaciarBuscador();
    })
    .catch(error => console.error("Error al cargar el JSON:", error)); //En caso de un error al cargar el JSON, mostramos un mensaje en consola

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

function vaciarBuscador(){
    document.getElementById("btn-borrar").addEventListener("click", e => {
        document.getElementById("buscar").value = '';
        mostrarResultados(datos);
    });
}