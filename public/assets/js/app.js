$(document).ready(function(){
  var socket = io.connect('http://34.227.11.223:3000');


  var messageForm = $('#sendMessage');
  var message = $('#message');
  var chat = $('#chat');

  
  var nickname = $('#nickname');
  var setNick = $('#setNick');
  var users = $('#users');

  setNick.click(function(e) {
    /* Act on the event */
    e.preventDefault();
    socket.emit('newUser', nickname.val(), function(data){
      if (data) {
        $('#nickContainer').hide();
        $('#cont-chat').show();
      } else {
        $('#login-error').show();
      }
    });
  });

  messageForm.submit(function(e) {
    /* Act on the event */
    e.preventDefault();
    if(message.val() != '') socket.emit('sendMessage', message.val());
    message.val('');
  });
  socket.on('newMessage', function(data) {
    chat.append(data.nick + ' - ' + data.msg + '<br/>');
  });
  socket.on('usernames', function(data) {
  var usernamesString = '';
  for (var usernames in data) {
    usernamesString += usernames + '<br/>';
  } 
  users.html(usernamesString);
  });
});





