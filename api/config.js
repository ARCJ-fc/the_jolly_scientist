var credentials = require("./credentials.js");

module.exports = {
    server: {
        host: "localhost",
        port: Number(process.env.port) || 8080
    },
    database: {
        host: "ds039211.mongolab.com",
        port: "39211",
        db: "hapiblog",
        username: "arcj",
        password: "mongolab2"
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
            redirect_uri: "http://localhost:8080/login"
        }
    }
};
