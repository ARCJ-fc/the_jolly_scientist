var lab    		= exports.lab = require("lab").script();
var assert 		= require("chai").assert;
var Hapi   		= require("hapi");
var mongoose 	= require("mongoose");
var uriUtil  	= require("mongodb-uri");
var server 		= require("../api/server.js");
var testConfig 	= require("./testconfig.js").database;
var closeMe;


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
            url: "/logout",
            method: "GET"
        };

        server.inject(options, function(response) {

            assert.equal(response.statusCode, 302, "should return a status code of 302");
            assert.include(response.headers.location, "/login", "should redirect user to the login page");
            done();
        });
    });

    lab.test("GETting to the logout page if already logged in ", function(done) {

        var options = {
            url: "/logout",
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
            assert.include(response.headers["set-cookie"][0], "arcjcookie=;", "should wipe the user's cookie");
            assert.equal(response.headers.location, "/", "should redirect user to home page");
            done();
        });
    });
    // End logging out
});

lab.experiment("Database logic tests 1: ", function() {

	var mongodbUri = "mongodb://" + testConfig.username + ":" + testConfig.password + "@" + testConfig.host + ":" + testConfig.port + "/" + testConfig.db;
	var mongooseUri = uriUtil.formatMongoose(mongodbUri);

	var testArray = [];

	// Setting up our test post schema:
	var Post = mongoose.Schema({
	    title       : { type: String, unique: true },
	    content     : { type: String, unique: true },
	    author      : { type: String },
	    created     : { type: String },
	    updated     : { type: String }
	});

	var testPost = mongoose.model("testPost", Post, "Posts");

	// Connecting to our testing database instead of the real one - setting up the testing environment
	lab.before(function(done) {

		mongoose.connect(mongooseUri, function() {

			var db = mongoose.connection;

			db.once("open", function() {
			    console.log("Testing database connection succesful");
			});

			var newTestPost = function(title, content, author) {
				return {
					title: title,
					content: content,
					author: author,
					created: new Date(),
					updated: new Date()
				};
			};

			// Populating the database with dummy data
			console.log("Populating the database with dummy data");
			var testPostGET1 = newTestPost("The 1st Test Post", "This is the 1st test post m8", "Timmy Tester");
			var testPostGET2 = newTestPost("The 2nd Test Post", "This is the 2nd test post m8", "Timothy Testacular");
			var testPostPUT1 = newTestPost("The 3rd Test Post", "This is the 3rd test post m8", "Timmy Tester");
			var testPostPUT2 = newTestPost("The 4th Test Post", "This is the 4th test post m8", "Simmy Fester");

			var post1 = new testPost(testPostGET1);
			var post2 = new testPost(testPostGET2);
			var post3 = new testPost(testPostPUT1);
			var post4 = new testPost(testPostPUT2);

			post1.save(function(err, contents) {
				testArray.push(contents);
			});
			post2.save(function(err, contents) {
				testArray.push(contents);
			});
			post3.save(function(err, contents) {
				testArray.push(contents);
			});
			post4.save(function(err, contents) {
				testArray.push(contents);
			});
			done();
		});
	});

	// The /posts endpoint
	lab.test("GETting the /posts endpoint", function(done) {

		var options = {
			url: "/posts",
			method: "GET"
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, "should return a 200 status code");
			assert.include(response.headers["content-type"], "application/json", "should return a JSON response");
			assert.lengthOf(response.result, testArray.length, "should return an array of the same length as our test array");
			// assert.sameDeepMembers(response.result, testArray, "should return a complete array of only blog posts");
			done();
		});
	});

	lab.test("POSTing the /posts endpoint, not logged in, ", function(done) {
		var options = {
			url: "/posts",
			method: "POST",
			payload: {
				title: "Unauthorized test post",
				content: "This should not be written to the database",
				author: "The Unsuccessful Postman"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 302, "should return a 302 FOUND redirect status code");
			assert.equal(response.headers.location, "/login", "should redirect us to the login page");

			testPost.find({title: options.payload.title}, function(err, docs) {
				assert.deepEqual(docs, [], "should not add a post to the database");
				done();
			});
		});
	});

	lab.test("POSTing the /posts endpoint, logged in, with good data, ", function(done) {
		var options = {
			url: "/posts",
			method: "POST",
			credentials: {
                name: "Authorized Alice",
           		email: "AuthAlice999@securiteh.com",
		        picture: "www.lockandkey.com/me.jpg",
		        gender: "Female"
			},
			payload: {
				title: "Authorized & good data test post",
				content: "This should be successfully written to the database",
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 201, "should return a 201 status code");
			assert.deepEqual(response, options.payload, "should return to us the created post");

			testPost.find({title: options.payload.title}, function(err, docs) {
				assert.notDeepEqual(docs, [], "should add a post to the database");
				assert.lengthOf(docs, 1, "should add exactly one post to the database");
				assert.equal(docs[0].author, options.credentials.name, "should add our logged in user as the author");
				done();
			});
		});
	});

	lab.test("POSTing the /posts endpoint, duplicate title", function(done) {
		var options = {
			url: "/posts",
			method: "POST",
			credentials: {
				profile: {
	                name: "Copycat Charles",
	           		email: "plagiarised999@theft.com",
	           		raw: {
			            picture: "www.robinhood.co.uk/atthebeach.jpg",
			            gender: "Male"
			        }
            	}
			},
			payload: {
				title: "The 1st Test Post",
				content: "This should not be written to the database",
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 401, "should return a 401 Bad Content status code");
			assert.include(response, "error", "should return to us an error message");
			assert.include(response, "title", "should return to us an error message specifying what went wrong");

			testPost.find({title: options.payload.title}, function(err, docs) {
				assert.notDeepEqual(docs, [], "should add a post to the database");
				assert.lengthOf(docs, 1, "should add exactly one post to the database");
				assert.equal(docs[0].author, options.credentials.name, "should add our logged in user as the author");
				done();
			});
		});
	});

	lab.test("POSTing the /posts endpoint, duplicate contents", function(done) {
		var options = {
			url: "/posts",
			method: "POST",
			credentials: {
				profile: {
					name: "Timmy Tester",
					email: "plagiarised999@theft.com",
					raw: {
						picture: "",
						gender:"male"
					}
				}
			},
			payload: {
				title: "Copycat blog post",
				content: "This is the 1st test post m8"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 401, "should return a 401 Bad Content status code");
			assert.include(reponse, "error", "should return to us an error message");
			assert.include(response, "content", "should return to us an error message specifying what went wrong");
			done();
		});
	});

	lab.test("POSTing the /posts endpoint, duplicate author", function(done) {
		var options = {
			url: "/posts",
			method: "POST",
			credentials: {
				profile: {
					name: "Copycat Charles",
					email: "plagiarised999@theft.com",
					raw: {
						picture: "",
						gender:"male"
					}
				}
			},
			payload: {
				title: "Thug blog version 1",
				content: "I like to write blogs about cats and chocolate"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 201, "should return a 201 status code");
			assert.deepEqual(response, options.payload, "should return to us the created post");

			testPost.find({title: options.payload.title}, function(err, docs) {
				assert.notDeepEqual(docs, [], "should add a post to the database");
				assert.lengthOf(docs, 1, "should add exactly one post to the database");
				assert.equal(docs[0].author, options.credentials.name, "should add our logged in user as the author");
				done();
			});
		});
	});
	// -------------------

// The /posts/{id} endpoint
	lab.test("GETing the /posts/{id} endpoint, with a good location", function(done) {
		var options = {
			url: "/posts/The%201st%20Test%20Post",
			method: "GET"
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, "should return a 200 status code");
			assert.include(response.headers["content-type"], "application/json", "should return a JSON response");
			assert.equal(response.result[0].title, testArray[0].title, "should return a post with the same title as we put in");
			assert.equal(response.result[0].content, testArray[0].content, "should return a post with the same content as we put in");
			assert.equal(response.result.author, testArray[0].author, "should return a post with the same author as we put in");
			done();
		});
	});

	lab.test("GETing the /posts/{id} endpoint, with a bad location, ", function(done) {
		var options = {
			url: "/posts/The%201st%20Test%20Postblahlasd",
			method: "GET"
		};
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 404, "should return a 404 status code");
			done();
		});
	});

	lab.test("PUTing the /posts/{id} endpoint, not logged in, ", function(done) {
		var options = {
			url: "/posts/The%201st%20Test%20Post",
			method: "PUT",
			payload: {
				title: "Unauthorized test PUT post",
				content: "This should not be written to the database once again"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 302, "should return a 302 FOUND redirect status code");
			assert.equal(response.headers.location, "/login", "should redirect us to the login page");

			testPost.find({title: "The 1st Test Post"}, function(err, docs) {
				assert.deepEqual(docs, [], "should not add a post to the database");
				done();
			});
		});
	});

	lab.test("PUTing the /posts/{id} endpoint, your own post, ", function(done) {
		var options = {
			url: "/posts/The%203rd%20Test%20Post",
			method: "PUT",
			credentials: {
                name: "Timmy Tester"
			},
			payload: {
				content: "This should change on a successful PUT request"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, "should return a 200 ok status code");
			assert.equal(response.result.content, options.payload.content, "should return the updated post on success");

			testPost.find({title: "The 3rd Test Post"}, function(err, docs) {
				assert.equal(docs[0].content, options.payload.content, "should not add a post to the database");
				done();
			});
		});
	});

	lab.test("PUTing the /posts/{id} endpoint, your own post and duplicate title, ", function(done) {
		var options = {
			url: "/posts/The%203rd%20Test%20Post",
			method: "PUT",
			credentials: {
                name: "Timmy Tester",
			},
			payload: {
				title: "The 1st Test Post",
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, "should return a 200 status code");

			testPost.find({title: "The 3rd Test Post"}, function(err, docs) {
				assert.lengthOf(docs.length, 1, "should not modify our old post");
				done();
			});
		});
	});

	lab.test("PUTing the /posts/{id} endpoint, your own post and duplicate content, ", function(done) {
		var options = {
			url: "/posts/The%203rd%20Test%20Post",
			method: "PUT",
			credentials: {
                name: "Timmy Tester",
			},
			payload: {
				content: "This is the 1st test post m8",
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 302, "should return a 302 error status code");

			testPost.find({title: "The 3rd Test Post"}, function(err, docs) {
				assert.lengthOf(docs.length, 1, "should not modify our old post");
				done();
			});
		});
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
		mongoose.connection.db.dropCollection("Posts", function(err, result) {
			console.log(asdfasfasfasd);
			mongoose.disconnect();
			done();
		});
	});
});

// lab.experiment("Database logic tests 2: ", function() {

// 	// Connecting to our testing database instead of the real one - setting up the testing environment
// 	lab.before(function(done) {
// 		var mongodbUri = "mongodb://" + testConfig.username + ":" + testConfig.password + "@" + testConfig.host + ":" + testConfig.port + "/" + testConfig.db;
// 		var mongooseUri = uriUtil.formatMongoose(mongodbUri);

// 		mongoose.connect(mongooseUri, function() {

// 			var db = mongoose.connection;

// 			db.once("open", function() {
// 			    console.log("Testing database connection succesful");
// 			});

// 			// Populating the database with dummy data
// 			console.log("Populating the database with test items");
// 			var testUserGET1 = {};
// 			var testUserGET2 = {};
// 			var testUserPUT1 = {};
// 			var testUserPUT2 = {};
// 			var testUserDEL1 = {};
// 			var testUserDEL2 = {};

// 			done();
// 		});
// 	});

// // The /users endpoint
// 	lab.test("GETting the /users endpoint", function(done) {
// 		done();
// 	});

// 	lab.test("POSTing the /users endpoint, not logged in", function(done) {

// 		done();
// 	});

// 	lab.test("POSTing the /users endpoint, logged in", function(done) {

// 		done();
// 	});
// 	// -------------------

// // The /users/{name} endpoint
// 	lab.test("GETing the /users/{name} endpoint", function(done) {

// 		done();
// 	});

// 	lab.test("GETing the /users/{name} endpoint, with a bad location, ", function(done) {

// 		done();
// 	});

// 	lab.test("PUTing the /users/{name} endpoint, not logged in, ", function(done) {

// 		done();
// 	});

// 	lab.test("PUTing the /users/{name} endpoint, your own account, ", function(done) {

// 		done();
// 	});

// 	lab.test("PUTing the /users/{name} endpoint, your own account and duplicate title, ", function(done) {

// 		done();
// 	});

// 	lab.test("PUTing the /users/{name} endpoint, your own account and duplicate content, ", function(done) {

// 		done();
// 	});

// 	lab.test("PUTing the /users/{name} endpoint, someone else's account, ", function(done) {

// 		done();
// 	});

// 	lab.test("PUTing the /users/{name} endpoint, with a bad location, ", function(done) {

// 		done();
// 	});


// 	lab.test("DELETing the /users/{name} endpoint, not logged in, ", function(done) {

// 		done();
// 	});

// 	lab.test("DELETing the /users/{name} endpoint, your own account", function(done) {

// 		done();
// 	});

// 	lab.test("DELETing the /users/{name} endpoint, someone else's account", function(done) {

// 		done();
// 	});

// 	lab.test("DELETing the /users/{name} endpoint, with a bad location", function(done) {

// 		done();
// 	});
// 	// -------------------

// // Deleting the testing modifications - resetting the testing environment
// 	lab.after(function(done) {
// 		mongoose.connection.db.disconnect();
// 		done();
// 	});
// });