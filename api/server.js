var Hapi 	= require("hapi");
var fs 		= require("fs");
var server 	= new Hapi.Server();
var root 	= __dirname + "/../";

/* $lab:coverage:off$ */
server.connection({
	host: "localhost",
	port: process.env.PORT || 8080
});
/* $lab:coverage:on$ */

server.route({
	path: "/",
	method: "GET",
	handler: function(request, reply) {
		reply("Hi m8");
	}
});

server.route({
    path: "/users",
    method: "GET",
    handler: function(request, reply) {
    	reply.file(root + "assets/users.json");
    }
});

server.route({
	path: "/users/{id}",
	method: "GET",
	handler: function(request, reply) {
		fs.readFile(root + "assets/users.json", function(err, contents) {
			var theRealID = JSON.parse(contents).users.filter(function(ele) {
				return ele.name === request.params.id;
			})[0];
			if (theRealID !== undefined) return reply(theRealID);
			else return reply("That's not a real person.").code(201);
		});
	}
});

module.exports = server;