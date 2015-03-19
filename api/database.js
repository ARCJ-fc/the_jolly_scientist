var config   = require("./config").database;
var uriUtil  = require("mongodb-uri");

var mongodbUri = "mongodb://" + config.username + ":" + config.password + "@" + config.host + ":" + config.port + "/" + config.db;
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

module.exports = {
	mongooseUri : mongooseUri
};
