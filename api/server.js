var Hapi 	= require("hapi");
var Joi 	= require("joi");
var server 	= new Hapi.Server();
var root 	= __dirname + "/../";

var myArray = [
{
	name: "Roy",
	username: "bigboy1101",
	password: "teriyakichickens",
	email: "comeonthegunners@pub.com"
},
{
	name: "francois",
	username: "frenchboy1001",
	password: "lepoulet",
	email: "vivalafrance@frogslegs.fr"
},
{
	name: "piedre",
	username: "poland999",
	password: "likeburgers",
	email: "wheresmyhat@hockey.pl"
}
];

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


// *********************** /users

server.route({
    path: "/users",
    method: "GET",
    handler: function(request, reply) {
    	reply(myArray);
    }
});

server.route({
    path: "/users",
    method: "POST",
    handler: function(request, reply) {
    	if (myArray.filter(function(ele) {
    		if (ele.email === request.payload.email) return reply("That email is already in use").code(400);
    		else if (ele.username === request.payload.username) return reply("That username is already in use").code(400);
    	}).length) {
    		return false;
    	}
    	myArray.push(request.payload);
        return reply(request.payload).code(201);
    },
    config: {
    	validate: {
    		payload: Joi.object({
    			name: Joi.string().alphanum().min(3).max(15).required(),
    			username: Joi.string().alphanum().min(3).max(20).required(),
    			password: Joi.string().alphanum().min(5).max(40).required(),
    			email: Joi.string().email().required()
    		}).options({allowUnknown: true})
    	}
    }
});

// *********************** /users/{username}

server.route({
	path: "/users/{username}",
	method: "GET",
	handler: function(request, reply) {
		var result = myArray.filter(function(ele, ind) {
			return request.params.username === ele.username;
		})[0];
		reply(result);
	}
});

server.route({
	path: "/users/{username}",
	method: "PUT",
	handler: function(request, reply) {
		var updateKeys = Object.keys(request.payload);
		var updatedIndex;

		myArray = myArray.map(function(updateEle, ind) {
			if (request.params.username === updateEle.username) {
				updatedIndex = ind;
				updateKeys.forEach(function(keysEle) {
					updateEle[keysEle] = request.payload[keysEle];
				});
			}
			return updateEle;
		});
		reply(myArray[updatedIndex]);
		// NOTES - If the user makes a PUT request to a username that doesn't exist,
		// we should either respond with an error, OR perhaps more RESTfully, create
		// the resource at that location IF the user has included all of the fields required
		// of creating a new user (name, username, password, email), and the location that they
		// have made the put request to matches the username they have specified in the payload
	},
    config: {
    	validate: {
    		payload: Joi.object({
    			name: Joi.string().alphanum().min(3).max(15),
    			username: Joi.string().alphanum().min(3).max(20),
    			password: Joi.string().alphanum().min(5).max(40),
    			email: Joi.string().email()
    		}).options({allowUnknown: false})
    		.or("name", "username", "password", "email")
    	}
    }
});








module.exports = server;
