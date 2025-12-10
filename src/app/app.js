const http = require("http");
const fs = require("fs");
const path = require("path");
const modelo = require("./modeloGummy");
const vistas = require("./vistas");

const server = http.createServer(function (req, res) {
  const url = req.url;
  const metodo = req.method;

  // Por defecto devolvemos HTML utf-8
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  // --- GET ---
  if (metodo === "GET") {
    // servir archivos estáticos (imágenes, css, js) si existen bajo uno de los roots permitidos
    try {
      // normalizamos y limpiamos la url
      const safeUrl = decodeURIComponent(url).replace(/^\/+/, ""); // elimina slashes iniciales
      // carpetas donde buscamos archivos estáticos (app y su padre - src)
      const staticRoots = [
        path.resolve(__dirname),         // Gummy/src/app
        path.resolve(__dirname, "..")    // Gummy/src
      ];

      // intentamos resolver la petición en cada root
      for (const root of staticRoots) {
        const requestedPath = path.join(root, safeUrl);
        const resolvedPath = path.resolve(requestedPath);

        // seguridad: asegurarnos que está dentro del root, que existe y es archivo
        if (resolvedPath.startsWith(root) && fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
          const ext = path.extname(resolvedPath).toLowerCase();
          const mimeTypes = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.html': 'text/html; charset=utf-8'
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
      }
    } catch (e) {
      // si falla la lógica de archivos estáticos, seguimos con rutas normales
      // console.error('Error al servir estático:', e);
    }

    // ruta raíz: servir index.html (archivo en la carpeta app)
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

    // ruta nueva: servir src/app/components/nueva/nueva.html
if (url === "/nueva" || url === "/components/nueva/nueva.html") {
  const filePath = path.join(__dirname, "components", "nueva", "nueva.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error leyendo nueva.html");
      return;
    }

    // obtenemos el formulario desde vistas.js
    const formulario = vistas.vistaFormularioNueva();

    // reemplaze marcador en el HTML
    const paginaFinal = data.replace("{{contenido}}", formulario);

    res.writeHead(200);
    res.end(paginaFinal);
  });
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
        res.writeHead(302, { Location: "/catalogo" });
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
        res.writeHead(302, { Location: "/catalogo" });
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
