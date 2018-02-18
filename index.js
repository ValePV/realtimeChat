var express = require('express');
var app = express();
// cargar el sevidor de http
var http = require('http').Server(app);
// le pasamos el http o servidor a socket.. para que io sepa con que va a trabajar
var io = require('socket.io')(http);
nicknames={};
var PORT = 3000;
app.use(express.static('public'));
// Definimos un controlador de ruta / que se llama cuando llegamos a
// nuestro sitio web
app.get('/', function(req, res){
  // request(req): son cabeceras y datos que nos envía el navegador.
  // response(res): son todo lo que enviamos desde el servidor.
  res.sendFile(__dirname + '/public/index.html');
});
//cada vez que alguien se conecte, se creara un nuevo socket
io.sockets.on('connection', function(socket) {
  //%s for a String value
  console.log('usuario id:%s', socket.id);
  socket.on('sendMessage', function(data){
    io.sockets.emit('newMessage', {msg:data, nick:socket.nickname});
  });

  socket.on('newUser', function(data, callback) {
    if(data in nicknames) {
      callback(false);
    } else {
      callback(true);
      socket.nickname = data;
      nicknames[socket.nickname] = 1;
      updateNickNames();
    }
  });

  socket.on('disconnect', function(data) {
    console.log('desconectado: %s', socket.id);
    if(!socket.nickname) return;
    delete nicknames [socket.nickname];
    updateNickNames();
  });
//usuarios almacenados
  function updateNickNames(){
    io.sockets.emit('usernames', nicknames);
    };
  });

http.listen(PORT,function(){
  console.log('El servidor esta escuchando el puerto %s', PORT);
});




