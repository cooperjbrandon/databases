var
  mysql   = require('mysql'),
  http    = require('http'),
  url     = require('url'),
  port    = 8080,
  ip      = '127.0.0.1',
  qs      = require('qs');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/

var dbConnection = mysql.createConnection({
  user: "root",
  database: "chat"
});

dbConnection.connect();



console.log("Listening on http://" + ip + ":" + port);

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



var rootMethods = function(request, response){
  response.writeHead(200, {location: 'http://www.google.com'});
  response.end();
};

var insertIntoSQL = function(obj, tableName){
  var columns = Object.keys(obj).join(', ');
  var values = [];
  for(var key in obj){
    values.push(JSON.stringify(obj[key]));
  }
  values = values.join(', ');
  var queryString = "INSERT INTO " + tableName + " (" + columns + ") VALUES (" + values + ")";
  // var queryArgs = [chat.message, chat.username];
  dbConnection.query(queryString, function(err, rows) {
    if (err) { throw err; }
    console.log('query saved: ', obj);
  });
};

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
  request.on('end', function() {
    insertIntoSQL(qs.parse(body), 'messages');
    response.writeHead(200);
    response.end();
  });
};

chatRoomMethods.get = function(request, response) {
  dbConnection.query('select * from messages', function (err, data) {
    if (err) {
      response.writeHead(80085);
      response.end('You Fail');
    }
    response.writeHead(200);
    response.end(JSON.stringify(data));
  });
};

var router = {
  '/': rootMethods,
  '/classes/room1': chatRoomMethods
};

var server = http.createServer(handleRequest);
server.listen(port, ip);


