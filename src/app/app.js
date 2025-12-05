const http = require("http");
const fs = require("fs");
const path = require("path");
const modelo = require("./modeloGummy");
const vistas = require("./vistas");

const server = http.createServer(function (req, res) {
  const url = req.url;
  const metodo = req.method;

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  // --- GET ---
  if (metodo === "GET") {
    // intento servir archivos estáticos (imágenes, css, js, etc.)
    try {
      const safeUrl = decodeURIComponent(url).replace(/^\/+/, "");
      const requestedPath = path.join(__dirname, safeUrl);
      const resolvedPath = path.resolve(requestedPath);
      const basePath = path.resolve(__dirname);

      if (resolvedPath.startsWith(basePath) && fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
        const ext = path.extname(resolvedPath).toLowerCase();
        const mimeTypes = {
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.css': 'text/css',
          '.js': 'application/javascript',
          '.html': 'text/html'
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(resolvedPath);
        stream.on('error', () => {
          res.writeHead(500);
          res.end('Error leyendo archivo');
        });
        stream.pipe(res);
        return;
      }
    } catch (e) {
      // si algo falla aquí, solo continuamos con las rutas normales
    }
    // ruta raíz: servir index.html (archivo en la raíz del proyecto)
    if (url === "/" || url === "/index.html") {
      const filePath = path.join(__dirname, "index.html");
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Error leyendo index.html");
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
      return;
    }

    // ruta catálogo: servir src/app/components/catalogo/catalogo.html
if (url === "/catalogo" || url === "/components/catalogo/catalogo.html") {
  const filePath = path.join(__dirname, "components", "catalogo", "catalogo.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error leyendo catálogo");
      return;
    }

    // obtenemos los gummies del modelo
    const gummies = modelo.obtenerTodos();
    const listaHTML = vistas.vistaLista(gummies);

    // reemplazamos marcador en el HTML
    const paginaFinal = data.replace("{{contenido}}", listaHTML);

    res.writeHead(200);
    res.end(paginaFinal);
  });
  return;
}

    // mantengo rutas de ejemplo para tareas usando el modelo + vistas si se usan en el futuro
    const urlObj = new URL("http://localhost" + url);
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
  //cambios
  

  // Si no coincide con nada
  res.writeHead(404);
  res.end("Ruta no encontrada");
});

server.listen(3000, () => console.log("Servidor en http://localhost:3000"));