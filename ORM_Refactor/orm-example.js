/* You'll need to
 * npm install sequelize
 * before running this example. Documentation is at http://sequelizejs.com/
 */

var
  Sequelize = require("sequelize"),
  http      = require('http'),
  url       = require('url'),
  port      = 8080,
  ip        = '127.0.0.1',
  qs        = require('qs');

/////////////////////////////
///// MODEL DEFINITIONS /////
/////////////////////////////


var sequelize = new Sequelize("sequelizer", "root", null);

var User = sequelize.define('User', {
  username: Sequelize.STRING
});

var Message = sequelize.define('Message', {
  text: Sequelize.STRING
});

var Chatroom = sequelize.define('Chatroom', {
  name: Sequelize.STRING
});

//////////////////////////
///// RELATIONSHIPS  /////
//////////////////////////

User.belongsTo(Chatroom);
Chatroom.hasMany(User);

Message.belongsTo(User);
User.hasMany(Message);

Chatroom.hasMany(Message);
Message.belongsTo(Chatroom);


User.sync();
Message.sync();
Chatroom.sync();


////////////////////////
///// SERVER STUFF /////
////////////////////////



var handleRequest = function(request, response){
  console.log("Serving request type " + request.method + " for url " + request.url);
  var pathname = url.parse(request.url).pathname;
  if(router[pathname]){
    var handler = router[pathname];
    handler(request, response);
  } else {
    // 404
  }
};

////////////////////////
///// ROOT METHODS /////
////////////////////////

var rootMethods = function(request, response){
  response.writeHead(200, {location: 'http://www.google.com'});
  response.end();
};

////////////////////////
///// CHATROOM API /////
////////////////////////

var chatRoomMethods = function(request, response){
  switch(request.method){
    case "GET":
      chatRoomMethods.get(request, response);
      break;
    case "POST":
      chatRoomMethods.post(request, response);
      break;
    case "OPTIONS":
      chatRoomMethods.options(request, response);
      break;
  }
};

chatRoomMethods.post = function(request, response) {
  var body = '';

  request.on('data', function(data) {
    body += data;
  });


  request.on('end', function() {
    var responsething = qs.parse(body);

    User.findOrCreate({ username: responsething.username }).success(function(user){
      var message = Message.build({
        text: responsething.message
      });
      message.setUser(user);
      message.save().success(function(){
        response.writeHead(200);
        response.end();
      }).error(function(){
        response.writeHead(80085);
        response.end('You Fail');
      });
    });
  });
};


//now you can call User.find(3).getMessages() to get array of messages from the third user

chatRoomMethods.get = function(request, response) {
  Messages.findAll().success(function(messages){
    response.writeHead(200);
    response.end(JSON.stringify(messages));
  }).error(function(){
    response.writeHead(80085);
    response.end('You Fail');
  });
};



//////////////////
///// SERVER /////
//////////////////

var router = {
  '/': rootMethods,
  '/classes/room1': chatRoomMethods
};

console.log("Listening on http://" + ip + ":" + port);

var server = http.createServer(handleRequest);
server.listen(port, ip);


