const fs = require('fs');
const path = require('path');

const logFileName = 'access_log.txt';

// Función para registrar la solicitud
function logRequest(req) {
  const now = new Date();
  const timestamp = now.toISOString();
  const requestMethod = req.method;
  const requestRoute = req.originalUrl;
  const logLine = `${timestamp} [${requestMethod}] [${req.route.path}] [${requestRoute}]\n`;

  // Escribe la línea de registro en el archivo
  fs.appendFile(path.join(__dirname, logFileName), logLine, (err) => {
    if (err) {
      console.error('Error al registrar la solicitud: ', err);
    }
  });
}
module.exports = logRequest;
