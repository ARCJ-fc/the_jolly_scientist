var lab 	= exports.lab = require("lab").script();
var assert 	= require("chai").assert;
var server 	= require("../api/server.js");

lab.experiment("A basic server test: ", function() {

	var options = {
		url: "/",
		method: "GET"
	};

	lab.test("The home page ", function(done) {

		server.inject(options, function(response) {

			assert.equal(response.statusCode, 200, "should return a 200 status code");
			assert.equal(typeof response.result, "string", "should reply with a string");
			done();
		});
	});
});

lab.experiment("The users endpoint", function() {
    
    var options = {
		url: "/users",
		method: "GET"
	};
    
    lab.test("should return an array of objects", function(done) {
        server.inject(options, function(response) {
            assert.equal(response.statusCode, 200, "should return a status code of 200");
            assert.equal(Object.prototype.toString.call(response.result), "[object Array]", "should return an array");
            done();
        });
    });
});
