var lab    = exports.lab = require("lab").script();
var assert = require("chai").assert;
var Hapi   = require("hapi");
var server = require("../api/server.js");


lab.experiment("Authentication tests: ", function() {

    lab.test("GETting to the login page ", function(done) {

        var options = {
            url: "/login",
            method: "GET"
        };

        server.inject(options, function(response) {

            assert.equal(response.statusCode, 200, "should return a status code of 200");
            assert.include(response.headers["content-type"], "text/html", "should return an html page");
            assert.include(response.payload, "<form", "should return a form html element");
            done();
        });
    });

    lab.test("GETting to the login page if already logged in ", function(done) {

        var options = {
            url: "/login",
            method: "GET",
            isAuthenticated: true
            // credentials: {
            //     username: "bigboy1101",
            //     password: "teriyakichicken",
            // }
        };

        server.inject(options, function(response) {
            assert.equal(response.statusCode, 302, "should return a status code of 302");
            assert.equal(response.headers.location, "/", "should redirect user to home page");
            done();
        });
    });

    // lab.test("POSTing to the login page with good information ", function(done) {

    //     var options ={
    //         url: "/login",
    //         method: "POST",
    //         payload: {username: "bigboy1101", password: "teriyakichickens"}
    //     };

    //     server.inject(options, function(response) {

    //         assert.equal(response.statusCode, 303, "should return a status code of 303");
    //         done();
    //     });
    // });

});
