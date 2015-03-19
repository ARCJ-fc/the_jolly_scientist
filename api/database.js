var Mongoose = require("mongoose");
var config   = require("./config");
var uriUtil  = require("mongodb-uri");

var mongodbUri = "mongodb://" + config.database.username + ":" + config.database.password + "@ds039211.mongolab.com:39211/hapiblog";
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

Mongoose.connect(mongooseUri);
var db = Mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function() {
    console.log("database connection succesful");
});

exports.Mongoose = Mongoose;
exports.db = db;
