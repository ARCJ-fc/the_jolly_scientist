var mongoose = require("mongoose");
var mongodburi = require("mongodb-uri");

module.exports = {
    server: {
        host: "localhost",
        port: Number(process.env.port) || 8080
    },
    database: {
        host: "127.0.0.1",
        port: "27017",
        db: "DatabaseName",
        username: "",
        password: ""
    },
    session: {
        password: "arcjrdabest",
        cookie: "arcjcookie",
        redirectTo: "/login",
        redirectOnTry: false,
        isSecure: false
    },
    google: {
        provider: "google",
        password: "justarandomstringissecure",
        isSecure: false,
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
        providerParams: {
            redirect_uri: server.info.uri + "/login"
        }
    }
};

