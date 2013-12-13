/* You'll need to have MongoDB and your Node archive server
 * running for these tests to pass. */

var mongojs = require("mongojs");
var request = require("request");

describe("Persistent Node Chat Server", function(done) {
  var mango = mongojs("127.0.0.1:27017", ["messages"]);

  expect("hello").toEqual("hello");

  it("Should store chat messages in Mongo", function(done) {

    var archiveServer = "http://127.0.0.1:8080/classes/room1";

    request({
      method: "POST",
      uri: archiveServer,
      form: {
        username: "Valjean",
        message: "24601"
      }
    }, function(error, response, body) {
      console.log("about to run client.open");
      var results = mango.messages.find().toArray();
      console.log("results are " + results);
      expect(results[0].username).toEqual("Valjean");
      expect(results[0].message).toEqual("24601");
      done();
    });
  });

  // it("Should retrieve documents from Mongo", function(done) {
  //   mongoClient.open(function(err, p_client) {
  //     /* TODO edit this variable to match the name of
  //      * the collection you're using: */
  //     var collectionName = "archive";
  //     client.createCollection(collectionName, function(err, collection) {

  //       /* We'll insert some fake page source data into
  //        * the collection to simulate an archived page. Edit this
  //        * to match the document field names that your code
  //        * actually uses.*/
  //       var document = {url: "jono.com",
  //                       pageSource: "<html><head><title>Jono's Awesome Blank Page</title></head><body></body></html>" };

  //       collection.insert(document, function(err, docs) {

  //         /* Now do a request to the archive server for this url
  //          *and expect it to return the document.
  //          * TODO edit these variables to match the interface of
  //          * your archive server. */
  //         var archivedPage = "http://127.0.0.1:8080/jono.com";

  //         request(archivedPage, function(error, response, body) {
  //           expect(body)
  //             .toMatch(/Jono's Awesome Blank Page/);
  //           done();
  //         }
  //       });
  //     });
  //   });
  // });
});
