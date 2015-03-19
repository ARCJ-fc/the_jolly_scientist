var lab    = exports.lab = require("lab").script();
var assert = require("chai").assert;
var Hapi   = require("hapi");
var server = require("../api/server.js");


lab.experiment("Authentication tests: ", function() {

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
                firstName: "Roy",
                image: "/assets/bigboyonthebeachwithbabes.png"
            }
        };

        server.inject(options, function(response) {
            assert.equal(response.statusCode, 302, "should return a status code of 302");
            assert.equal(response.headers.location, "/", "should redirect user to home page");
            done();
        });
    });
});
