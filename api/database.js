var Mongoose = require("mongoose");
var config   = require("./config").database;
var uriUtil  = require("mongodb-uri");

var mongodbUri = "mongodb://" + config.username + ":" + config.password + "@" + config.host + ":" + config.port + "/" + config.db;
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

Mongoose.connect(mongooseUri);

var db = Mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function() {
    console.log("database connection succesful");
});

exports.Mongoose = Mongoose;
exports.db = db;
