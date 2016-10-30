var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

//initializing db variable outside of routes, so they all have access to it
var db;
console.log("this is connection url:", process.env.MONGODB_URI)
//connect to DB 1st, then start the app, preventing connection churn
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database;
  console.log("Database connection ready");

  var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

//DONTACT API ROUTES BELOW

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/contacts", function(req, res) {
  var newContact = req.body;
  newContact.createDate = new Date();

  if(!(req.body.firstName || req.body.lastName)) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.post("/constacts", function(req, res) {

});

app.get("/contact/:id", function(req, res) {

});

app.put("/contacts/:id", function(req, res) {

});

app.delete("/contacts/:id", function(req, res) {

});
