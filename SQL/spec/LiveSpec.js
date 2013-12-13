var mysql = require('mysql');
var request = require("request");

describe("Persistent Node Chat Server", function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: "root",
      database: "sequelizer"
    });
    dbConnection.connect();

    var tablename = "Message";

    dbConnection.query("DELETE FROM " + tablename, done);
  });

  afterEach(function() {
    dbConnection.end();
  });

  it("Should insert posted Message to the DB", function(done) {
    request({
      method: "POST",
      uri: "http://127.0.0.1:8080/classes/room1",
      form: {
        username: "Valjean",
        message: "In mercy's name, three days is all I need.",
        chatroom: "Nice"
      }
    }, function(error, response, body) {
      var queryString = "select * from Message";

      dbConnection.query("select * from Message",
      function(err, results, fields) {
        expect(results.length).toEqual(1);
        expect(results[0].text).toEqual("In mercy's name, three days is all I need.");


        done();
      });
    });
  });

  it("Should output all Message from the DB", function(done) {
    var queryString = "insert into Message (username, message) values (?, ?)";
    var queryArgs = ["Javert", "Men like you can never change!"];


    dbConnection.query( queryString, queryArgs,
      function(err, results, fields) {
        request("http://127.0.0.1:8080/classes/room1",
          function(error, response, body) {
            var messageLog = JSON.parse(body);
            expect(messageLog[0].username).toEqual("Javert");
            expect(messageLog[0].message).toEqual("Men like you can never change!");
            done();
          });
      });
  });
});
