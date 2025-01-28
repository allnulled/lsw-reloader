module.exports = function (outterOptions = {}) {

  const options = Object.assign({
    directory: dir,
    port: port,
  }, outterOptions);

  const express = require('express');
  const http = require('http');
  const path = require('path');
  const socketIo = require('socket.io');
  const chokidar = require('chokidar');

  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: '*',
    }
  });

  io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    socket.on('refrescar', () => {
      console.log('El servidor ha recibido la señal de refrescar');
      io.emit('refrescar');
    });
    socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado');
    });
  });

  const directorioActual = options.directory;
  const patrones = ['**/*.js', '**/*.css', '**/*.xml', '**/*.html'];
  const patronesEscuchados = patrones.map(pat => path.join(directorioActual, pat));

  console.log("[*] Escuchando:", patronesEscuchados);

  const watcher = chokidar.watch(".", {
    persistent: true,
    ignoreInitial: false,
    depth: Infinity,
    cwd: directorioActual,
    recursive: true
  });
  
  watcher.on('change', (ruta) => {
    if (ruta.includes("/dist/")) {
      return;
    }
    console.log(`Cambios han habido en el archivo: ${ruta}`);
    io.emit("refrescar");
  });
  
  watcher.on('error', error => {
    console.error('Error en el observador:', error);
  });

  server.listen(options.port, () => {
    console.log(`Servidor escuchando en el puerto ${options.port}`);
  });

};