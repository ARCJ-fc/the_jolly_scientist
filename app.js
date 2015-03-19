var server = require("./api/server.js");
var database = require("./api/database.js");

server.start(function() {
	console.log("Server running at " + server.info.uri);
});
