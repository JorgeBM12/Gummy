// src/app/vistas.js
const estrategias = {
  lista: (gummies) => `
    <h1>Catálogo de Gummies</h1>
    <ul>
      ${gummies.map(g => `
        <li>
          <strong>${g.titulo}</strong>: ${g.descripcion} 
          [${g.activa ? "Activo" : "Inactivo"}]
        </li>`).join("")}
    </ul>
  `,
  formulario: () => `
  <link rel="stylesheet" href="../styles/global.css">
  <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet">
    <h1>Nuevo Gummy</h1>
    <form method="POST" action="/guardar">
      <input name="titulo" placeholder="Título" required />
      <textarea name="descripcion" placeholder="Descripción"></textarea>
      <button type="submit" class="btn-verde">Guardar</button>
    </form>
  `
};

module.exports = {
  vistaFormularioNueva: () => estrategias.formulario(),
  vistaLista: (gummies) => estrategias.lista(gummies)
};
