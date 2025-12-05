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
    <h1>Nuevo Gummy</h1>
    <form method="POST" action="/guardar">
      <input name="titulo" placeholder="Título" required />
      <textarea name="descripcion" placeholder="Descripción"></textarea>
      <button type="submit">Guardar</button>
    </form>
  `
};

module.exports = {
  vistaFormularioNueva: () => estrategias.formulario(),
  vistaLista: (gummies) => estrategias.lista(gummies)
};
