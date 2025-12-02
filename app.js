const http = require("http");
const modelo = require("./modeloTareas");
const vistas = require("./vistas");

const server = http.createServer(function (req, res) {
  const url = req.url;
  const metodo = req.method;

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  // --- GET ---
  if (metodo === "GET" && url.startsWith("/")) {
    const urlObj = new URL("http://localhost" + url);
    const orden = urlObj.searchParams.get("orden") || "porId";

    if (urlObj.pathname === "/") {
      const tareas = modelo.obtenerTodas();
      const html = vistas.vistaLista(tareas, orden);
      res.writeHead(200);
      res.end(html);
      return;
    }

    if (urlObj.pathname === "/nueva") {
      const html = vistas.vistaFormularioNueva();
      res.writeHead(200);
      res.end(html);
      return;
    }
  }

  // --- POST /guardar ---
  if (metodo === "POST" && url === "/guardar") {
    let body = "";

    req.on("data", chunk => (body += chunk.toString()));

    req.on("end", function () {
      const params = new URLSearchParams(body);
      const titulo = params.get("titulo");
      const descripcion = params.get("descripcion");

      try {
        modelo.crear(titulo, descripcion);
        res.writeHead(302, { Location: "/" });
        res.end();
      } catch (err) {
        res.writeHead(400);
        res.end("Error al guardar: " + err.message);
      }
    });
    return;
  }

  // --- POST /cambiar-estado ---
  if (metodo === "POST" && url === "/cambiar-estado") {
    let body = "";

    req.on("data", chunk => (body += chunk.toString()));

    req.on("end", function () {
      const params = new URLSearchParams(body);
      const id = params.get("id");

      if (modelo.cambiarEstado(id)) {
        res.writeHead(302, { Location: "/" }); // redirige a la lista
        res.end();
      } else {
        res.writeHead(400);
        res.end("Error: tarea no encontrada");
      }
    });
    return;
  }

  // Si no coincide con nada
  res.writeHead(404);
  res.end("Ruta no encontrada");
});

server.listen(3000, () => console.log("Servidor en http://localhost:3000"));
