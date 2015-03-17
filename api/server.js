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

var myPosts = [
{
	title: "My First Blog Post",
	content: "blah blah blah blah",
	date: "25/12/1861",
	author: "bigboy1101"
},
{
	title: "My Second Blog Post",
	content: "blahde blahde blahde blah",
	date: "25/12/1861",
	author: "poland999"
},
];

/* $lab:coverage:off$ */
server.connection({
	host: "localhost",
	port: process.env.PORT || 8080
});
/* $lab:coverage:on$ */


// *********************** /home
server.route({
	path: "/",
	method: "GET",
	handler: function(request, reply) {
		reply("Hi m8");
	}
});
// -----------------------


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
// -----------------------


// *********************** /users/{username}
server.route({
	path: "/users/{username}",
	method: "GET",
	handler: function(request, reply) {
		var result = myArray.filter(function(ele, ind) {
			return request.params.username === ele.username;
		});
		if (result.length !== 0) return reply(result[0]);
		else return reply("User not found").code(404);
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

server.route({
	path: "/users/{username}",
	method: "DELETE",
	handler: function(request, reply) {
		var result = [];
		myArray.forEach(function(ele) {
			if (request.params.username !== ele.username) {
				result.push(ele);
			}
			return false;
		});
		if (result.length !== myArray.length) {myArray = result; return reply(request.params.username + " has successfully been deleted!").code(200);}
		else {return reply("User not found").code(404);}
	}
});
// -----------------------


// *********************** /posts
server.route({
    path: "/posts",
    method: "GET",
    handler: function(request, reply) {
    	reply(myPosts);
    }
});

server.route({
    path: "/posts",
    method: "POST",
    handler: function(request, reply) {
    	if (myPosts.filter(function(ele) {
    		if (ele.title === request.payload.title) return reply("That title is already in use").code(400);
    		else if (ele.content === request.payload.content) return reply("That content is has already been submitted!").code(400);
    	}).length) {
    		return false;
    	}
    	myPosts.push(request.payload);
        return reply(request.payload).code(201);
    },
    config: {
    	validate: {
    		payload: Joi.object({
    			title: Joi.string().min(2).max(40).required(),
    			content: Joi.string().min(10).max(1000).required(),
    			date: Joi.date().format('DD/MM/YYYY').required(),
    			author: Joi.string().alphanum().required()
    		}).options({allowUnknown: true})
    	}
    }
});

// -----------------------


// *********************** /posts/{posttitle}



module.exports = server;
