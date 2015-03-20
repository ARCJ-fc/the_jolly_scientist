var Hapi 	= require("hapi");
var Bell 	= require("bell");
var cookie 	= require("hapi-auth-cookie");
var Good 	= require("good");
var routes 	= require("./router/router.js");
var config 	= require("./config.js");

var server 	= new Hapi.Server();

server.connection(config.server);

server.register([Bell, cookie, {
	register: Good,
	options: {
	    opsInterval: 1000,
	    reporters: [{
	        reporter: require("good-console"),
	        args:[{ log: "*", error: "*" }]
	    }, {
	        reporter: require("good-file"),
	        args: [__dirname + "/../test/fixtures/the_log", { error: "*", log: "*", response: "*"}]
	    }]
	}
}], function(err) {
	if (err) throw err;
	server.auth.strategy("session", "cookie", config.session);
    server.auth.strategy("google", "bell", config.google);

	server.route(routes);
});


module.exports = server;