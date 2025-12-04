module.exports = {
  vistaLista(tareas = [], orden = 'porId') {
    const items = tareas.map(t => `
      <li>
        <strong>${t.titulo}</strong> - ${t.descripcion || ''} ${t.completada ? '(completada)' : ''}
      </li>
    `).join('\n');

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Lista de tareas</title>
</head>
<body>
  <h1>Lista de tareas</h1>
  <ul>
    ${items}
  </ul>
  <p><a href="/">Volver al inicio</a></p>
</body>
</html>`;
  },

  vistaFormularioNueva() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Nueva tarea</title>
</head>
<body>
  <h1>Nueva tarea</h1>
  <form action="/guardar" method="post">
    <label>Título: <input name="titulo" required></label><br>
    <label>Descripción: <textarea name="descripcion"></textarea></label><br>
    <button type="submit">Guardar</button>
  </form>
  <p><a href="/">Volver</a></p>
</body>
</html>`;
  }
};
