var Joi 	= require("joi");
var Bell 	= require("bell");
var Boom 	= require("boom");
var path 	= require("path");
var model 	= require("../models/model.js");

exports.home = {
	handler: function(request, reply) {
		reply("home");
	}
};

exports.login = {
	auth: {
		strategy: "google"
	},
	handler: function(request, reply) {
		var g = request.auth.credentials;
        var profile = {
            name: g.profile.displayName,
            email: g.profile.email,
            picture: g.profile.raw.picture,
            gender: g.profile.raw.gender
        };
        request.auth.session.set(profile);
    	return reply.redirect("/");
	}
};

exports.logout = {
	auth: "session",
	handler: function(request, reply) {
		request.auth.session.clear();
		return reply.redirect("/");
	}
};



exports.getPosts = {
	handler: function(request, reply) {
		model.getPosts(function(err, contents) {
			if (err) return reply(err);
			return reply(contents);
		});
	}
};

exports.createPost = {
	auth: "session",
	handler: function(request, reply) {
		request.payload.author = request.auth.credentials.name;
		model.createPost(request.payload, function(err, contents) {
		 	if (err) {
		 		if (err.code === 11000 || err.code === 11001) {
                    return reply(Boom.forbidden("please provide another title or different content"));
                }
                return reply(Boom.forbidden(err));
		 	}
		 	return reply(contents).code(201);
		});
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
		model.getSinglePost(request.params.title, function(err, contents) {
			if (err) return reply(err);
			return reply(contents);
		});
	}
};

exports.updateSinglePost = {
	auth: "session",
	handler: function(request, reply) {
		var user = request.auth.credentials.name;
		model.updateSinglePost(request.payload, user, function(err, contents) {
			if (err) return reply(err);
			return reply(contents);
		});
	},
	validate: {
		payload: Joi.object({
			title: Joi.string(),
			content: Joi.string()
		}).or("title", "content")
	}
};

exports.deleteSinglePost = {
	auth: "session",
	handler: function(request, reply) {
		var user = request.auth.credentials.name;
		model.deleteSinglePost(request.params.title, user, function(err, contents) {
			if (err) return reply(err);
			return reply(contents);
		});
	}
};



exports.getUsers = {
	handler: function(request, reply) {
		reply("getUsers");
	}
};

exports.createUser = {
	auth: "session",
	handler: function(request, reply) {
		reply("createUser");
	},
	validate: {
		payload: Joi.object({
			description: Joi.string()
		})
	}
};



exports.getSingleUser = {
	handler: function(request, reply) {
	model.getSingleUser(request.params.name, function(err, contents) {
			if (err) return reply(err);
			return reply(contents);
		});
	}
};

exports.updateSingleUser = {
	auth: "session",
	handler: function(request, reply) {
		var user = request.auth.credentials.name;
		request.payload.name = request.params.name;
		model.updateSingleUser(request.payload, user, function(err, contents) {
			if (err) return reply(err);
			return reply(contents);
		});
	},
	validate: {
		payload: Joi.object({
			description: Joi.string().required()
		})
	}
};

exports.deleteSingleUser = {
	auth: "session",
	handler: function(request, reply) {
		var user = request.auth.credentials.name;
		model.deleteSinglePost(request.params.name, user, function(err, contents) {
			if (err) return reply(err);
			return reply(contents);
		});
	}
};

exports.testPosting = {
	auth: "session",
	handler: function(request, reply) {
		var root = path.resolve(__dirname + "/../../");
		reply.file(root + "/views/index.html");
	}
};
