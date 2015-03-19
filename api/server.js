var Hapi 	= require("hapi");
var Bell 	= require("Bell");
var cookie 	= require("hapi-auth-cookie");
var routes 	= require("/router/router.js");
var config 	= require("./config");
var Db 		= require("./database");

var server 	= new Hapi.server(config.server.host, config.server.port, {cors: true});

server.register([Bell, HAC], function(err) {
	if (err) throw err;

	server.auth.strategy("session", "cookie", config.session);
    server.auth.strategy("google", "bell", config.google);

	server.route(routes);
});

module.exports = server;