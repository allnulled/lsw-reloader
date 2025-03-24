const serverUrl = 'http://127.0.0.1';
const serverPort = 3000;

if (process?.env?.NODE_ENV === "test") {
  const socket = io(`${serverUrl}:${serverPort}`);
  socket.on('refrescar', () => {
    console.log('Recibida la señal de refrescar desde el servidor');
    location.reload();
  });
}