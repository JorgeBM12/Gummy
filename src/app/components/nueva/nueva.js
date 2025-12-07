class NuevaView {
    constructor() {
        this.contenedor = document.getElementById('contenido');
    }

    renderFormulario(data = {}) {
        this.contenedor.innerHTML = `
            <form id="formNuevoGummy" class="form-nuevo" novalidate>
                <div>
                    <label for="nombre">Nombre</label>
                    <input id="nombre" name="nombre" type="text" required maxlength="100" value="${data.nombre || ''}">
                </div>
                <div>
                    <label for="descripcion">Descripción</label>
                    <textarea id="descripcion" name="descripcion" rows="3" maxlength="500">${data.descripcion || ''}</textarea>
                </div>
                <div>
                    <label for="precio">Precio (MXN)</label>
                    <input id="precio" name="precio" type="number" min="0" step="1" required value="${data.precio || ''}">
                </div>
                <div>
                    <label for="peso">Peso</label>
                    <input id="peso" name="peso" type="text" maxlength="20" value="${data.peso || ''}">
                </div>
                <div>
                    <label for="ingredientes">Ingredientes</label>
                    <input id="ingredientes" name="ingredientes" type="text" maxlength="250" value="${data.ingredientes || ''}">
                </div>
                <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
                    <button type="submit" class="btn btn-green">Guardar</button>
                    <button type="button" id="btnLimpiar" class="btn btn-red">Limpiar</button>
                </div>
                <div id="mensaje" style="margin-top:10px"></div>
            </form>
        `;
    }

    mostrarMensaje(text, tipo = 'info') {
        const msg = document.getElementById('mensaje');
        msg.textContent = text;
        msg.style.color = tipo === 'error' ? 'red' : (tipo === 'success' ? 'green' : '#333');
    }

    limpiarMensaje() {
        const msg = document.getElementById('mensaje');
        if (msg) msg.textContent = '';
    }
}

class NuevaModel {
    constructor() {
        // guardaremos los productos nuevos en localStorage 'gummiesNuevos'
        this.key = 'gummiesNuevos';
        this.items = JSON.parse(localStorage.getItem(this.key)) || [];
    }

    guardar(producto) {
        // asigna id incremental
        const nuevoId = (this.items.length ? Math.max(...this.items.map(i => i.id)) : 0) + 1;
        const registro = { id: nuevoId, ...producto };
        this.items.push(registro);
        localStorage.setItem(this.key, JSON.stringify(this.items));
        return registro;
    }

    obtenerTodos() {
        return this.items;
    }
}

class NuevaController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.renderFormulario();
        this.montarEventos();
    }

    montarEventos() {
        const form = document.getElementById('formNuevoGummy');
        const btnLimpiar = document.getElementById('btnLimpiar');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarDesdeFormulario();
        });

        btnLimpiar.addEventListener('click', () => {
            form.reset();
            this.view.limpiarMensaje();
        });
    }

    validar(datos) {
        if (!datos.nombre || datos.nombre.trim().length < 2) {
            return 'El nombre debe tener al menos 2 caracteres.';
        }
        if (isNaN(datos.precio) || Number(datos.precio) < 0) {
            return 'Precio inválido.';
        }
        return null;
    }

    guardarDesdeFormulario() {
        const nombre = document.getElementById('nombre').value.trim();
        const descripcion = document.getElementById('descripcion').value.trim();
        const precio = Number(document.getElementById('precio').value);
        const peso = document.getElementById('peso').value.trim();
        const ingredientes = document.getElementById('ingredientes').value.trim();

        const producto = { nombre, descripcion, precio, peso, ingredientes };

        const error = this.validar(producto);
        if (error) {
            this.view.mostrarMensaje(error, 'error');
            return;
        }

        const guardado = this.model.guardar(producto);
        this.view.mostrarMensaje(`Guardado con ID ${guardado.id}`, 'success');

        // opcional: limpiar formulario
        document.getElementById('formNuevoGummy').reset();
    }
}

// Inicialización igual que en catalogo.js
const modeloNueva = new NuevaModel();
const vistaNueva = new NuevaView();
const appNueva = new NuevaController(modeloNueva, vistaNueva);
