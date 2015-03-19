var Hapi 	= require("hapi");
var Bell 	= require("bell");
var cookie 	= require("hapi-auth-cookie");
var routes 	= require("./router/router.js");
var config 	= require("./config");

var server 	= new Hapi.Server();

server.connection(config.server);

server.register([Bell, cookie], function(err) {
	if (err) throw err;

	server.auth.strategy("session", "cookie", config.session);
    server.auth.strategy("google", "bell", config.google);

	server.route(routes);
});

module.exports = server;