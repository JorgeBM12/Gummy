// BASE DE DATOS DE PRODUCTOS (Array de objetos)
const productos = [
    {
        id: 1,
        nombre: "Dulce 1",
        descripcion: "Gomitas deliciosas con sabor a fresa, perfectas para cualquier ocasión.",
        precio: 50,
        imagen: "imagenesCatalogo/gomita1.png",
        peso: "100g",
        ingredientes: "Azúcar, jarabe de glucosa, gelatina, saborizantes naturales",
        categoria: "Gomitas"
    },
    {
        id: 2,
        nombre: "Dulce 2",
        descripcion: "Gomitas ácidas con explosión de sabor cítrico que te encantarán.",
        precio: 60,
        imagen: "imagenesCatalogo/gomita2.png",
        peso: "150g",
        ingredientes: "Azúcar, ácido cítrico, gelatina, colorantes naturales",
        categoria: "Gomitas Ácidas"
    },
    {
        id: 3,
        nombre: "Dulce 3",
        descripcion: "Gomitas suaves con forma de ositos, ideales para compartir.",
        precio: 70,
        imagen: "imagenesCatalogo/gomita3.png",
        peso: "200g",
        ingredientes: "Azúcar, jarabe de maíz, gelatina, sabores naturales",
        categoria: "Gomitas"
    },
    {
        id: 4,
        nombre: "Dulce 4",
        descripcion: "Mix de gomitas con diferentes sabores tropicales.",
        precio: 55,
        imagen: "imagenesCatalogo/gomita1.png",
        peso: "120g",
        ingredientes: "Azúcar, gelatina, saborizantes de frutas tropicales",
        categoria: "Mix"
    },
    {
        id: 5,
        nombre: "Dulce 5",
        descripcion: "Gomitas clásicas con sabor a cereza, un favorito de siempre.",
        precio: 40,
        imagen: "imagenesCatalogo/gomita2.png",
        peso: "100g",
        ingredientes: "Azúcar, jarabe de glucosa, gelatina, extracto de cereza",
        categoria: "Gomitas"
    },
    {
        id: 6,
        nombre: "Dulce 6",
        descripcion: "Gomitas enchiladas con el toque perfecto de picante y dulce.",
        precio: 45,
        imagen: "imagenesCatalogo/gomita3.png",
        peso: "100g",
        ingredientes: "Azúcar, gelatina, chile en polvo, sal, limón",
        categoria: "Gomitas Enchiladas"
    }
];

// Cargar el carrito desde LocalStorage al iniciar
let carrito = JSON.parse(localStorage.getItem('carritoGummy')) || [];

// Función para guardar el carrito en LocalStorage
function guardarCarrito() {
    localStorage.setItem('carritoGummy', JSON.stringify(carrito));
}

// Función para buscar un producto por ID
function obtenerProducto(id) {
    return productos.find(p => p.id === id);
}

// Función para abrir el modal con información del producto
function abrirModal(idProducto) {
    const producto = obtenerProducto(idProducto);
    
    if (!producto) {
        console.error("Producto no encontrado");
        return;
    }
    
    // Actualizar el contenido del modal
    const modalContenido = document.getElementById("modalContenido");
    modalContenido.innerHTML = `
        <div style="text-align: center;">
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 15px;">
            <h2 style="color: #ff6b6b; margin-bottom: 10px;">${producto.nombre}</h2>
            <p style="font-size: 24px; color: #28a745; font-weight: bold; margin: 10px 0;">$${producto.precio}</p>
        </div>
        
        <div style="margin-top: 20px; text-align: left;">
            <p style="margin-bottom: 15px; line-height: 1.6;"><strong>📝 Descripción:</strong><br>${producto.descripcion}</p>
            <p style="margin-bottom: 10px;"><strong>⚖️ Peso:</strong> ${producto.peso}</p>
            <p style="margin-bottom: 10px;"><strong>🏷️ Categoría:</strong> ${producto.categoria}</p>
            <p style="margin-bottom: 10px;"><strong>🧪 Ingredientes:</strong><br>${producto.ingredientes}</p>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
            <button onclick="agregarAlCarrito(${producto.id})" style="padding: 12px 30px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-right: 10px;">
                🛒 Agregar al Carrito
            </button>
            <button onclick="cerrarModal()" style="padding: 12px 30px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                Cerrar
            </button>
        </div>
    `;
    
    document.getElementById("miModal").style.display = "block";
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById("miModal").style.display = "none";
}

// Función para agregar productos al carrito (actualizada para usar ID)
function agregarAlCarrito(idProducto) {
    const producto = obtenerProducto(idProducto);
    
    if (!producto) {
        console.error("Producto no encontrado");
        return;
    }
    
    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
        // Si existe, aumentar la cantidad
        productoExistente.cantidad++;
    } else {
        // Si no existe, agregarlo como nuevo producto
        const productoCarrito = {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        };
        carrito.push(productoCarrito);
    }
    
    // Guardar en LocalStorage
    guardarCarrito();
    
    // Actualizar el contador del carrito
    actualizarContadorCarrito();
    
    // Mostrar mensaje de confirmación
    alert(`${producto.nombre} agregado al carrito!`);
    
    console.log("Carrito actual:", carrito);
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
    const elemento = document.getElementById("cantidadCarrito");
    if (elemento) {
        elemento.textContent = totalProductos;
    }
}

// Función para ver el carrito
function verCarrito() {
    const modalCarrito = document.getElementById("modalCarrito");
    const contenidoCarrito = document.getElementById("contenidoCarrito");
    
    if (carrito.length === 0) {
        contenidoCarrito.innerHTML = "<p style='text-align: center; color: #6c757d;'>Tu carrito está vacío 🛒</p>";
        document.getElementById("totalCarrito").textContent = "0";
    } else {
        let html = "";
        let total = 0;
        
        carrito.forEach((producto, index) => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;
            
            html += `
                <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center;">
                        <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px; margin-right: 10px; object-fit: cover; border-radius: 5px;">
                        <div>
                            <strong>${producto.nombre}</strong><br>
                            <span style="color: #28a745;">$${producto.precio}</span> x ${producto.cantidad} = <strong>$${subtotal}</strong>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <button onclick="cambiarCantidad(${index}, -1)" style="padding: 5px 10px; margin: 0 5px; cursor: pointer; background: #ffc107; border: none; border-radius: 3px;">-</button>
                        <span style="margin: 0 10px; font-weight: bold;">${producto.cantidad}</span>
                        <button onclick="cambiarCantidad(${index}, 1)" style="padding: 5px 10px; margin: 0 5px; cursor: pointer; background: #28a745; color: white; border: none; border-radius: 3px;">+</button>
                        <button onclick="eliminarDelCarrito(${index})" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; margin-left: 10px;">🗑️</button>
                    </div>
                </div>
            `;
        });
        
        contenidoCarrito.innerHTML = html;
        document.getElementById("totalCarrito").textContent = total;
    }
    
    modalCarrito.style.display = "block";
}

// Función para cerrar el carrito
function cerrarCarrito() {
    document.getElementById("modalCarrito").style.display = "none";
}

// Función para cambiar la cantidad de un producto
function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    
    // Guardar en LocalStorage
    guardarCarrito();
    
    actualizarContadorCarrito();
    verCarrito();
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    
    // Guardar en LocalStorage
    guardarCarrito();
    
    actualizarContadorCarrito();
    verCarrito();
}

// Función para vaciar todo el carrito
function vaciarCarrito() {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        carrito = [];
        
        // Guardar en LocalStorage
        guardarCarrito();
        
        actualizarContadorCarrito();
        verCarrito();
    }
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById("miModal");
    const modalCarrito = document.getElementById("modalCarrito");
    
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == modalCarrito) {
        modalCarrito.style.display = "none";
    }
}

// Actualizar contador cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarContadorCarrito();
    console.log("Carrito cargado desde LocalStorage:", carrito);
    console.log("Productos disponibles:", productos);
});