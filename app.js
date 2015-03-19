var Mongoose 	= require("mongoose");
var server 		= require("./api/server.js");
var database 	= require("./api/database.js");

server.start(function() {
	console.log("Server running at " + server.info.uri);

	Mongoose.connect(database.mongooseUri, function() {

		var db = Mongoose.connection;

		db.on("error", console.error.bind(console, "connection error"));
		db.once("open", function() {
		    console.log("database connection succesful");
		});
	});
});
