
var
  http      = require('http'),
  url       = require('url'),
  port      = 8080,
  ip        = '127.0.0.1',
  qs        = require('qs'),
  mongodb   = require('mongodb');

//////////////////////////
////// MONGO STUFF ///////
//////////////////////////

var server = new mongodb.Server("127.0.0.1", 27017, {});
var client = new mongodb.Db('chatterBox', server);
var database;
var messages;
client.open(function(err, db) {
  console.log("opened connection to MongoDB");
  db.createCollection('messages', function(err, collection){
    messages = collection;
  });
  database = db;
});




//////////////////////
/// SERVER STUFF /////
//////////////////////



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
    body+= data;
  });
  var success = false;
  request.on('end', function() {
    messages.insert(qs.parse(body), function(err, docs) {
      if (err) {
        response.writeHead(80085);
        response.end('You Fail');
      } else {
        response.writeHead(200);
        response.end();
      }
    });
  });
};

chatRoomMethods.get = function(request, response) {
  messages.find().toArray(function(err, messages) {
    if (err) {
      response.writeHead(80085);
      response.end('You Fail');
    } else {
      response.writeHead(200);
      response.end(JSON.stringify(messages));
    }
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


