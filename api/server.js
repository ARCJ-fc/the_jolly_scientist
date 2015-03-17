var Hapi 	= require("hapi");
var fs 		= require("fs");
var server 	= new Hapi.Server();

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
    	reply.file(__dirname + "/../assets/users.json");
    }
});

module.exports = server;