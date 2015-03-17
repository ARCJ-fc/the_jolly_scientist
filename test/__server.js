var lab 	= exports.lab = require("lab").script();
var assert 	= require("chai").assert;
var fs 		= require("fs");
var server 	= require("../api/server.js");


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


lab.experiment("JSON users tests: ", function() {

    lab.test("the /users endpoint", function(done) {

	    var options = {
			url: "/users",
			method: "GET"
		};

        server.inject(options, function(response) {

        	var resJSON = JSON.parse(response.result);

            assert.equal(response.statusCode, 200, "should return a status code of 200");
            assert.include(response.headers["content-type"], "application/json", "should return a json content-type");
            assert.isObject(resJSON, "should return a JSON object");
            assert.isArray(resJSON.users, "should contain a users array");

            fs.readFile(__dirname + "/../assets/users.json", function(err, contents) {
            	var origJSON = JSON.parse(contents);

            	assert.isNull(err, "doesn't throw an error");
            	assert.deepEqual(origJSON, resJSON, "testing is cool");
            	done();
            });

        });
    });

    lab.test("the /users/{id} endpoint", function(end) {

    	var options = {
    		url: "/users/timmy",
    		method: "GET"
    	};

    	server.inject(options, function(response) {
    		assert.equal(response.statusCode, 200, "should return a status code of 200");
    	});
    });

});

