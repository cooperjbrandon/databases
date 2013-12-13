// var mongodb = require('mongodb');
// var request = require("request");

// describe("Persistent Node Chat Server", function() {
//   var dbConnection;

//   beforeEach(function(done) {
//     var messages;
//     var server = new mongodb.Server("127.0.0.1", 27017, {});
//     var client = new mongodb.Db('chatterBox', server);
//     client.open(function(err, db) {
//       dbConnection = db;
//       dbConnection.messages.remove();
//       dbConnection.createCollection('messages', function(err, collection){
//         messages = collection;
//       });
//       done();
//     });
//   });

//   afterEach(function() {
//     dbConnection.close();
//   });

//   it("Should insert posted messages to the DB", function(done) {
//     request({method: "POST",
//              uri: "http://127.0.0.1:8080/classes/room1",
//              form: {username: "Valjean",
//                     message: "In mercy's name, three days is all I need."}
//             },
//             function(error, response, body) {

//               var queryString = "select * from messages where username = ?";
//               var queryArgs = ["Valjean"];

//               dbConnection.query("select * from messages",
//                 function(err, results, fields) {
//                   expect(results.length).toEqual(1);
//                   expect(results[0].username).toEqual("Valjean");
//                   expect(results[0].message).toEqual("In mercy's name, three days is all I need.");


//                   done();
//                 });
//             });
//   });

//   it("Should output all messages from the DB", function(done) {
//     var queryString = "insert into messages (username, message) values (?, ?)";
//     var queryArgs = ["Javert", "Men like you can never change!"];


//     dbConnection.query( queryString, queryArgs,
//       function(err, results, fields) {
//         request("http://127.0.0.1:8080/classes/room1",
//           function(error, response, body) {
//             var messageLog = JSON.parse(body);
//             expect(messageLog[0].username).toEqual("Javert");
//             expect(messageLog[0].message).toEqual("Men like you can never change!");
//             done();
//           });
//       });
//   });
// });
