var lab    		= exports.lab = require("lab").script();
var assert 		= require("chai").assert;
var Hapi   		= require("hapi");
var Mongoose 	= require("mongoose");
var uriUtil  	= require("mongodb-uri");
var server 		= require("../api/server.js");
var testConfig 	= require("./testconfig.js").database;


lab.experiment("Authentication logic tests: ", function() {

	// *** Logging in
    lab.test("GETting to the login page if not already logged in ", function(done) {

        var options = {
            url: "/login",
            method: "GET"
        };

        server.inject(options, function(response) {

            assert.equal(response.statusCode, 302, "should return a status code of 302");
            assert.include(response.headers.location, "google.com", "should redirect user to the google login page");
            done();
        });
    });

    lab.test("GETting to the login page if already logged in ", function(done) {

        var options = {
            url: "/login",
            method: "GET",
            credentials: {
            	profile: {
	                name: "Timmy Tester",
	           		email: "timmytester1101@bigboy.com",
	           		raw: {
			            picture: "www.gogglebox.togglebox.org.jpg",
			            gender: "Male"
			        }
            	}
            }
        };

        server.inject(options, function(response) {
            assert.equal(response.statusCode, 302, "should return a status code of 302");
            assert.equal(response.headers.location, "/", "should redirect user to home page");
            done();
        });
    });
    // --- End logging in


    // *** Logging out
    lab.test("GETting to the logout page if not already logged in ", function(done) {

        var options = {
            url: "/login",
            method: "GET"
        };

        server.inject(options, function(response) {

            assert.equal(response.statusCode, 302, "should return a status code of 302");
            assert.include(response.headers.location, "google.com", "should redirect user to the google login page");
            done();
        });
    });

    lab.test("GETting to the logout page if already logged in ", function(done) {

        var options = {
            url: "/login",
            method: "GET",
            credentials: {
            	profile: {
	                name: "Timmy Tester",
	           		email: "timmytester1101@bigboy.com",
	           		raw: {
			            picture: "www.gogglebox.togglebox.org.jpg",
			            gender: "Male"
			        }
            	}
            }
        };

        server.inject(options, function(response) {
        	console.log(response.auth, response.headers);
            assert.equal(response.statusCode, 302, "should return a status code of 302");
            assert.isBelow(response.headers["set-cookie"][0], 50, "should wipe the user's cookie");
            assert.equal(response.headers.location, "/", "should redirect user to home page");
            done();
        });
    });
    // End logging out
});

lab.experiment("Database logic tests 1: ", function() {

	// Connecting to our testing database instead of the real one - setting up the testing environment
	lab.before(function(done) {
		var mongodbUri = "mongodb://" + testConfig.username + ":" + testConfig.password + "@" + testConfig.host + ":" + testConfig.port + "/" + testConfig.db;
		var mongooseUri = uriUtil.formatMongoose(mongodbUri);

		Mongoose.connect(mongooseUri, function() {

			var db = Mongoose.connection;

			db.once("open", function() {
			    console.log("Testing database connection succesful");
			});

			// Populating the database with dummy data
			console.log("Populating the database with test items");
			var testPostGET1 = {};
			var testPostGET2 = {};
			var testPostPUT1 = {};
			var testPostPUT2 = {};

			done();
		});
	});

	// The /posts endpoint
	lab.test("GETting the /posts endpoint", function(done) {
		done();
	});

	lab.test("POSTing the /posts endpoint, not logged in", function(done) {

		done();
	});

	lab.test("POSTing the /posts endpoint, logged in", function(done) {

		done();
	});
	// -------------------

	// The /posts/{id} endpoint
	lab.test("GETing the /posts/{id} endpoint", function(done) {

		done();
	});

	lab.test("GETing the /posts/{id} endpoint, with a bad location, ", function(done) {

		done();
	});

	lab.test("PUTing the /posts/{id} endpoint, not logged in, ", function(done) {

		done();
	});

	lab.test("PUTing the /posts/{id} endpoint, your own post, ", function(done) {

		done();
	});

	lab.test("PUTing the /posts/{id} endpoint, your own post and duplicate title, ", function(done) {

		done();
	});

	lab.test("PUTing the /posts/{id} endpoint, your own post and duplicate content, ", function(done) {

		done();
	});

	lab.test("PUTing the /posts/{id} endpoint, someone else's post, ", function(done) {

		done();
	});

	lab.test("PUTing the /posts/{id} endpoint, with a bad location, ", function(done) {

		done();
	});


	lab.test("DELETing the /posts/{id} endpoint, not logged in, ", function(done) {

		done();
	});

	lab.test("DELETing the /posts/{id} endpoint, your own post", function(done) {

		done();
	});

	lab.test("DELETing the /posts/{id} endpoint, someone else's post", function(done) {

		done();
	});

	lab.test("DELETing the /posts/{id} endpoint, with a bad location", function(done) {

		done();
	});
	// -------------------

// Deleting the testing modifications - resetting the testing environment
	lab.after(function(done) {
		// Deleting
		console.log("Clearing out the database");
		done();
	});

});
