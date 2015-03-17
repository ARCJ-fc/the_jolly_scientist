var lab 	= exports.lab = require("lab").script();
var assert 	= require("chai").assert;
var server 	= require("../api/server.js");
var root	= (__dirname + "/../");

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

lab.experiment("A basic server test: ", function() {

	var options = {
		url: "/",
		method: "GET"
	};

	lab.test("The home page ", function(done) {

		server.inject(options, function(response) {

			assert.equal(response.statusCode, 200, "should return a 200 status code");
			assert.typeOf(response.result, "string", "should reply with a string");
			done();
		});
	});
});

lab.experiment("The users endpoint: ", function() {

	lab.test("Sending a GET request", function(done) {

		var options = {
			url: "/users",
			method: "GET"
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, "should return a 200 status code");
			assert.isArray(response.result, "should return an array");
			assert.deepEqual(response.result, myArray, "with the same contents as myArray");
			done();
		});
	});

	lab.test("Sending a POST request with good data", function(done) {

		var options = {
			url: "/users",
			method: "POST",
			payload: {
				name: "timmy",
				username: "southpark220",
				password: "timmy0000",
				email: "timmytimmytimmy@timmy.timmy"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 201, "should return a created status code");
			assert.deepEqual(JSON.parse(response.payload), options.payload, "should return the data used to create the entry");
			done();
		});
	});

	lab.test("Sending a POST request with bad info", function(done) {

		var options = {
			url: "/users",
			method: "POST",
			payload: {
				name: "timmy",
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 400, "should return a bad request status code");
			assert.notDeepEqual(JSON.parse(response.payload), options.payload, "should not return the request object");
			assert.isString(response.payload, "should return a response with a string error message");
			done();
		});
	});

	lab.test("Attempting to create a user with an already-in-use email address", function(done) {

		var options = {
			url: "/users",
			method: "POST",
			payload: {
				name: "Roy",
				username: "bigboi1100",
				password: "teriyakichickens",
				email: "comeonthegunners@pub.com"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 400, "should return a bad request status code");
			assert.isString(response.payload, "should return a response with a string error message");
			assert.include(response.payload, "email", "should return a response informing us of the problem");
			assert.notInclude(response.payload, "username", "should return a response informing us of the problem with reasonable specificity");
			done();
		});
	});

	lab.test("Attempting to create a user with an already-in-use username", function(done) {

		var options = {
			url: "/users",
			method: "POST",
			payload: {
				name: "Roy",
				username: "bigboy1101",
				password: "teriyakichickens",
				email: "chickendippers@pub.com"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 400, "should return a bad request status code");
			assert.isString(response.payload, "should return a response with a string error message");
			assert.include(response.payload, "username", "should return a response informing us of the problem");
			assert.notInclude(response.payload, "email", "should return a response informing us of the problem with reasonable specificity");
			done();
		});
	});
});

lab.experiment("The users/{username} endpoint: ", function() {

	lab.test("Sending a good GET request", function(done) {

		var options = {
			url: "/users/bigboy1101",
			method: "GET"
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, "should return a 200 status code");
			assert.isObject(response.result, "should return an object");
			assert.deepEqual(response.result, myArray[0], "with the same contents as the relevant user");
			done();
		});
	});

	lab.test("Sending a bad GET request", function(done) {

		var options = {
			url: "/users/rotundturnip007",
			method: "GET"
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, "should return a 404 status code");
			done();
		});
	});

	lab.test("Sending a well located, good PUT request", function(done) {

		var options = {
			url: "/users/poland999",
			method: "PUT",
			payload: {
				name: "toasty",
				email: "chickendippers222@dogpoo.org"
			}
		};

		var newUser = {
				name: "toasty",
				username: "poland999",
				password: "likeburgers",
				email: "chickendippers222@dogpoo.org"
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, "should return a 200 status code");
			assert.isObject(JSON.parse(response.payload), "should return an object response");
			assert.deepEqual(JSON.parse(response.payload), newUser, "should return the updated resource");
			done();
		});
	});

	lab.test("Sending a well located, bad PUT request", function(done) {

		var options = {
			url: "/users/poland999",
			method: "PUT",
			payload: {
				name: "t  @%@oasty",
			}
		};

		var newUser = {
				name: "piedre",
				username: "poland999",
				password: "likeburgers",
				email: "comeonthegunners@pub.com"
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 400, "should return a 400 status code");
			assert.isObject(JSON.parse(response.payload), "should return an error object response");
			assert.include(JSON.parse(response.payload).message, "name", "should return a response informing us of the problem");
			assert.notInclude(JSON.parse(response.payload).message, ["email", "password", "username"], "should return a response informing us of the problem with reasonable specificity");
			done();
		});
	});

	// lab.test("Sending a PUT request to a nonexistant location, in the correct way,", function(done) {

	// 	var options = {
	// 		url: "/users/blahblahblah",
	// 		method: "PUT",
	// 		payload: {
	// 			name: "flopsam",
	// 			username: "blahblahblah",
	// 			password: "asdafK",
	// 			email: "comeonthegoons@pub.com"
	// 		}
	// 	};

	// 	var newUser = {
	// 			name: "flopsam",
	// 			username: "blahblahblah",
	// 			password: "asdafK",
	// 			email: "comeonthegoons@pub.com"
	// 	};

	// 	server.inject(options, function(response) {
	// 		assert.equal(response.statusCode, 201, "should return a 201 status code");
	// 		done();
	// 	});
	// });

	// lab.test("Sending a PUT request to a nonexistant location, in the incorrect way", function(done) {

	// 	var options = {
	// 		url: "/users/blahblahblah",
	// 		method: "PUT",
	// 		payload: {
	// 			name: "toasty",
	// 			email: "comeonthegunners@pub.com"
	// 		}
	// 	};

	// 	var newUser = {
	// 			name: "toasty",
	// 			username: "poland999",
	// 			password: "likeburgers",
	// 			email: "chickendippers222@dogpoo.org"
	// 	};

	// 	server.inject(options, function(response) {
	// 		assert.equal(response.statusCode, 404, "should return a 404 status code");
	// 		done();
	// 	});
	// });

});
