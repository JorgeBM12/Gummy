// src/app/modeloGummy.js
class Gummy {
  constructor(id, titulo, descripcion) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.activa = true;
  }

  cambiarEstado() {
    this.activa = !this.activa;
  }
}

class GummyFactory {
  static crear(titulo, descripcion) {
    const id = Date.now().toString();
    return new Gummy(id, titulo, descripcion);
  }
}

// "base de datos" en memoria
const baseDatos = [];

module.exports = {
  crear: (titulo, descripcion) => {
    const nuevo = GummyFactory.crear(titulo, descripcion);
    baseDatos.push(nuevo);
  },
  cambiarEstado: (id) => {
    const gummy = baseDatos.find(g => g.id === id);
    if (gummy) {
      gummy.cambiarEstado();
      return true;
    }
    return false;
  },
  obtenerTodos: () => baseDatos
};
