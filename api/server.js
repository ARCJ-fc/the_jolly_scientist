var Hapi 	= require("hapi");
var fs 		= require("fs");
var server 	= new Hapi.Server();
var root 	= __dirname + "/../";

var dbOpts = {
    url : "mongodb://arcj:mongolab2@ds039211.mongolab.com:39211/hapiblog"
};

/* $lab:coverage:off$ */
server.connection({
	host: "localhost",
	port: process.env.PORT || 8080
});
/* $lab:coverage:on$ */

server.register({
    register: require("hapi-mongodb"),
    options: dbOpts
}, function (err) {
    if (err) {
        console.error(err);
        throw err;
    }
});

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
        // var db = request.server.plugins["hapi-mongodb"].db;
        console.log("Where is the database?", request.server.plugins.Db);
        // var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;

        // db.collection("users").find().toArray(function(err, doc) {
        //     if (err) return reply(err);
        //     reply(doc);
        // });
    }
});

server.route({
    path: "/users",
    method: "POST",
    handler: function(request, reply) {
        fs.write(root + "assets/users.json", request.payload, null, function(err, written) {
            if (err) return console.error(err);
            return reply(request.payload).code(201);
        });
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
			else return reply("That's not a real person.").code(404);
		});
	}
});

module.exports = server;
