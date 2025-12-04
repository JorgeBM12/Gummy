module.exports = {
  _tareas: [],

  obtenerTodas() {
    return this._tareas.slice();
  },

  crear(titulo, descripcion) {
    if (!titulo) throw new Error('El título es obligatorio');
    const id = this._tareas.length ? this._tareas[this._tareas.length - 1].id + 1 : 1;
    const tarea = { id, titulo, descripcion: descripcion || '', completada: false };
    this._tareas.push(tarea);
    return tarea;
  },

  cambiarEstado(id) {
    const nid = Number(id);
    const tarea = this._tareas.find(t => t.id === nid);
    if (!tarea) return false;
    tarea.completada = !tarea.completada;
    return true;
  }
};
