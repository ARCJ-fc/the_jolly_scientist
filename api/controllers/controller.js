var Joi 	= require("joi");
var Boom 	= require("boom");
var Bell 	= require("Bell");
var cookie 	= require("hapi-auth-cookie");
var model 	= require("../models/model.js");

var User 	= model.User;
var Post 	= model.Post;

exports.home = {
	handler: function(request, reply) {

	}
};
exports.login = {
	auth: {
		mode: "try",
		strategy: "google"
	},
	handler: function(request, reply) {

	}
};
exports.logout = {
	auth: "session",
	handler: function(request, reply) {

	}
};


exports.getPosts = {
	handler: function(request, reply) {

	}
};
exports.createPost = {
	auth: "cookie",
	handler: function(request, reply) {

	},
	validate: {
		payload: Joi.object({
			title: Joi.string().required(),
			content: Joi.string().required()
		})
	}
};


exports.getSinglePost = {
	handler: function(request, reply) {

	}
};
exports.updateSinglePost = {
	auth: "cookie",
	handler: function(request, reply) {

	},
	validate: {
		payload: Joi.object({
			title: Joi.string(),
			content: Joi.string()
		}).or("title", "content")
	}
};
exports.deleteSinglePost = {
	auth: "cookie",
	handler: function(request, reply) {

	}
};

exports.getUsers = {
	handler: function(request, reply) {

	}
};

exports.createUser = {
	auth: "cookie",
	handler: function(request, reply) {

	},
	validate: {
		description: Joi.string()
	}
};

exports.getSingleUser = {
	handler: function(request, reply) {

	}
};
exports.updateSingleUser = {
	auth: "cookie",
	handler: function(request, reply) {

	},
	validate: {
		payload: Joi.object({
			description: Joi.string().required()
		})
	}
};
exports.deleteSingleUser = {
	auth: "cookie",
	handler: function(request, reply) {

	}
};
