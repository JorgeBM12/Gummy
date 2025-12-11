// ==========================================
// 1. DATOS (Simulación de Base de Datos)
// ==========================================
const DB_PRODUCTOS = [
    { id: 1, nombre: "Picosillas", descripcion: "Gomitas enchiladas con el toque perfecto de picante y dulce.", precio: 50, imagen: "imagenesCatalogo/gummy_bone_1.png", peso: "100g", ingredientes: "Azúcar, gelatina, chile en polvo, sal, limón.", categoria: "Gomitas" },
    { id: 2, nombre: "Tropicales", descripcion: "Gomitas tropicales sabor a piña, frescura de verano.", precio: 60, imagen: "imagenesCatalogo/gummy_bone_2.png", peso: "150g", ingredientes: "Piña, azúcar, jarabe de glucosa, gelatina.", categoria: "Gomitas Ácidas" },
    { id: 3, nombre: "Mix Frutal", descripcion: "Mix de gomitas con diferentes sabores tropicales.", precio: 70, imagen: "imagenesCatalogo/gummy_bone_3.png", peso: "200g", ingredientes: "Azúcar, jarabe de maíz, gelatina, sabores naturales.", categoria: "Mix" },
    { id: 4, nombre: "Cereza Boom", descripcion: "Gomitas clásicas con sabor a cereza, un favorito de siempre.", precio: 55, imagen: "imagenesCatalogo/gummy_bone_4.png", peso: "120g", ingredientes: "Azúcar, jarabe de glucosa, gelatina, extracto de cereza.", categoria: "Gomitas" },
    { id: 5, nombre: "Chicle Pop", descripcion: "Gomitas sabor chicle, por temporada limitada.", precio: 40, imagen: "imagenesCatalogo/gummy_bone_5.png", peso: "100g", ingredientes: "Azúcar, jarabe de glucosa, gelatina, saborizante artificial chicle.", categoria: "Gomitas" },
    { id: 6, nombre: "Citrus X", descripcion: "Gomitas ácidas con explosión de sabor cítrico que te encantarán.", precio: 45, imagen: "imagenesCatalogo/gummy_bone_6.png", peso: "100g", ingredientes: "Azúcar, gelatina, sal, limón.", categoria: "Enchiladas" }
];

// ==========================================
// 2. MODELO (Pattern: Singleton)
// ==========================================
class CarritoModel {
    constructor() {
        // Lógica Singleton: Si ya existe una instancia, la devuelve.
        if (CarritoModel.instance) {
            return CarritoModel.instance;
        }
        
        // Inicialización única
        this.carrito = JSON.parse(localStorage.getItem('carritoGummy')) || [];
        CarritoModel.instance = this;
    }

    getCarrito() {
        return this.carrito;
    }

    guardar() {
        localStorage.setItem('carritoGummy', JSON.stringify(this.carrito));
    }

    agregarProducto(producto) {
        const existe = this.carrito.find(item => item.id === producto.id);
        if (existe) {
            existe.cantidad++;
        } else {
            this.carrito.push({ ...producto, cantidad: 1 });
        }
        this.guardar();
    }

    cambiarCantidad(index, delta) {
        if (!this.carrito[index]) return;
        
        this.carrito[index].cantidad += delta;
        if (this.carrito[index].cantidad <= 0) {
            this.eliminarProducto(index);
        } else {
            this.guardar();
        }
    }

    eliminarProducto(index) {
        this.carrito.splice(index, 1);
        this.guardar();
    }

    vaciar() {
        this.carrito = [];
        this.guardar();
    }

    obtenerTotal() {
        return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    obtenerCantidadTotal() {
        return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
    }
}

// ==========================================
// 3. VISTA (Manejo del DOM)
// ==========================================
class CatalogoView {
    constructor() {
        this.tabla = document.getElementById('tablaCatalogo');
        this.modalProducto = document.getElementById('miModal');
        this.modalCarrito = document.getElementById('modalCarrito');
        this.contadorCarrito = document.getElementById('cantidadCarrito');
        this.contenidoCarrito = document.getElementById('contenidoCarrito');
        this.totalCarrito = document.getElementById('totalCarrito');
    }

    renderizarCatalogo(productos) {
        let html = '';
        const columnas = 3;
        
        productos.forEach((p, index) => {
            if (index % columnas === 0) html += '<tr>';
            html += `
                <td style="padding: 15px; text-align: center; border: 1px solid #eee;">
                    <img src="${p.imagen}" style="width: 200px; height: 200px; object-fit: cover; cursor: pointer;" 
                        onclick="app.verDetalles(${p.id})">
                    <h3>${p.nombre}</h3>
                    <p style="color: #666;">${p.descripcion}</p>
                    <p style="color: #28a745; font-weight: bold; font-size: 1.2em;">$${p.precio}</p>
                    <button class="btn btn-green" onclick="app.agregar(${p.id})">Agregar al carrito</button>
                </td>
            `;
            if ((index + 1) % columnas === 0 || index === productos.length - 1) html += '</tr>';
        });
        this.tabla.innerHTML = html;
    }

    actualizarContador(cantidad) {
        this.contadorCarrito.textContent = cantidad;
    }

    mostrarModalDetalles(producto) {
        const contenido = document.getElementById("modalContenido");
        contenido.innerHTML = `
            <div style="text-align: center;">
                <img src="${producto.imagen}" style="width: 200px; border-radius: 10px;">
                <h2 style="color: #ff6b6b;">${producto.nombre}</h2>
                <p style="font-size: 24px; color: #28a745;">$${producto.precio}</p>
                <p>${producto.descripcion}</p>
                <p><strong>Ingredientes:</strong> ${producto.ingredientes}</p>
                <button class="btn btn-green" onclick="app.agregar(${producto.id}); app.cerrarDetalles()">
                    🛒 Agregar y Cerrar
                </button>
                <button class="btn btn-blue" onclick="app.cerrarDetalles()">Cerrar</button>
            </div>
        `;
        this.modalProducto.style.display = "block";
    }

    cerrarModalDetalles() {
        this.modalProducto.style.display = "none";
    }

    mostrarModalCarrito(items, total) {
        this.totalCarrito.textContent = total;
        
        if (items.length === 0) {
            this.contenidoCarrito.innerHTML = "<p style='text-align:center'>Tu carrito está vacío 😢</p>";
        } else {
            this.contenidoCarrito.innerHTML = items.map((item, index) => `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 10px;">
                    <div style="display: flex; align-items: center;">
                        <img src="${item.imagen}" width="50" style="margin-right: 10px;">
                        <div>
                            <strong>${item.nombre}</strong><br>
                            <small>$${item.precio} x ${item.cantidad}</small>
                        </div>
                    </div>
                    <div>
                        <button class="btn" style="background:orange; padding: 2px 8px;" onclick="app.cambiarCantidad(${index}, -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button class="btn" style="background:green; padding: 2px 8px;" onclick="app.cambiarCantidad(${index}, 1)">+</button>
                        <button class="btn" style="background:red; padding: 2px 8px; margin-left: 5px;" onclick="app.eliminar(${index})">🗑️</button>
                    </div>
                </div>
            `).join('');
        }
        this.modalCarrito.style.display = "block";
    }

    cerrarModalCarrito() {
        this.modalCarrito.style.display = "none";
    }
}

// ==========================================
// 4. CONTROLADOR (Coordina Todo)
// ==========================================
class CatalogoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Inicializar la aplicación
        this.init();
    }

    init() {
        // Cargar productos en la vista
        this.view.renderizarCatalogo(DB_PRODUCTOS);
        // Actualizar contador inicial
        this.view.actualizarContador(this.model.obtenerCantidadTotal());
        
        // Manejo de clicks fuera de los modales (Event Listener Global)
        window.onclick = (event) => {
            if (event.target == this.view.modalProducto) this.view.cerrarModalDetalles();
            if (event.target == this.view.modalCarrito) this.view.cerrarModalCarrito();
        };
    }

    // --- Acciones del Usuario ---

    agregar(idProducto) {
        const producto = DB_PRODUCTOS.find(p => p.id === idProducto);
        if (producto) {
            this.model.agregarProducto(producto);
            this.view.actualizarContador(this.model.obtenerCantidadTotal());
            // Feedback simple (podría mejorarse en la vista)
            // alert(`${producto.nombre} agregado!`); 
        }
    }

    verDetalles(idProducto) {
        const producto = DB_PRODUCTOS.find(p => p.id === idProducto);
        if (producto) this.view.mostrarModalDetalles(producto);
    }

    cerrarDetalles() {
        this.view.cerrarModalDetalles();
    }

    verCarrito() {
        const items = this.model.getCarrito();
        const total = this.model.obtenerTotal();
        this.view.mostrarModalCarrito(items, total);
    }

    cerrarCarrito() {
        this.view.cerrarModalCarrito();
    }

    cambiarCantidad(index, delta) {
        this.model.cambiarCantidad(index, delta);
        this.actualizarVistaCarrito();
    }

    eliminar(index) {
        this.model.eliminarProducto(index);
        this.actualizarVistaCarrito();
    }

    vaciarCarrito() {
        if (confirm("¿Vaciar carrito?")) {
            this.model.vaciar();
            this.actualizarVistaCarrito();
        }
    }

    comprarCarrito() {
        if (this.model.getCarrito().length === 0) {
            alert("Carrito vacío");
            return;
        }
        alert(`¡Compra realizada por $${this.model.obtenerTotal()}!`);
        this.model.vaciar();
        this.actualizarVistaCarrito();
        this.view.cerrarModalCarrito();
    }

    // Helper interno para refrescar todo lo relacionado al carrito
    actualizarVistaCarrito() {
        this.view.actualizarContador(this.model.obtenerCantidadTotal());
        // Si el modal está abierto, lo refrescamos
        if (this.view.modalCarrito.style.display === "block") {
            this.verCarrito();
        }
    }
}

// ==========================================
// 5. INICIALIZACIÓN
// ==========================================

// Instanciamos el Modelo (Singleton asegura que solo haya uno)
const modelo = new CarritoModel();
const vista = new CatalogoView();

// Instanciamos la App Global para que el HTML pueda acceder a ella
const app = new CatalogoController(modelo, vista);