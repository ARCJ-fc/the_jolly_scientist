var lab 	= exports.lab = require("lab").script();
var assert 	= require("chai").assert;
var fs 		= require("fs");
var server 	= require("../api/server.js");
var root	= (__dirname + "/../");


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

    var origFile = fs.readFileSync(root + "assets/users.json");
    var origJSON = JSON.parse(origFile);

    lab.test("GETting the /users endpoint", function(done) {

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
        	assert.deepEqual(origJSON, resJSON, "testing is cool");
        	done();
            });

        });

    lab.test("POSTing to the /users endpoint", function(done) {

        var options = {
            url: "/users",
            method: "POST",
            payload: {
                name    : "bob",
                username: "thebuilder101",
                password: "il0vek4t13pr1c3",
                email   : "builderscraic@yahoo.com"
            }
        };

        server.inject(options, function(response) {
            assert.equal(response.statusCode, 201, "should return a status code of 201");
            done();
        });
    });

    lab.test("the /users/{id} endpoint", function(done) {

    	var user 		= "Rory";
    	var origUsers 	= origJSON.users;
    	var options 	= {
    		url: "/users/" + user,
    		method: "GET"
    	};

    	server.inject(options, function(response) {
    		var resJSON  = response.result;
    		var timmyObj = origUsers.filter(function(ele, ind) {
    			return ele.name === user;
    		})[0];

    		assert.equal(response.statusCode, 200, "should return a status code of 200");
    		assert.deepEqual(timmyObj, resJSON, "should return the same user object as was requested if they exist");

    	});

    	options = {
    		url: "/users/billie",
    		method: "GET"
    	};

    	server.inject(options, function(response) {
			assert.equal(response.statusCode, 404, "should return a status code of 404 for a nonexistent user");
			done();
    	});
    });
});

