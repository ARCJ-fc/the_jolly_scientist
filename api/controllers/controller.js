var Joi 	= require("joi");
var Bell 	= require("bell");
var Boom 	= require("boom");
var model 	= require("../models/model.js");

var Post 	= model.Post;



exports.home = {
	handler: function(request, reply) {
		reply("home");
	}
};

exports.login = {
	auth: {
		mode: "try",
		strategy: "google"
	},
	handler: function(request, reply) {
		var g = request.auth.credentials;
        var profile = {
            name: g.profile.displayName,
            email: g.profile.email,
            picture: g.profile.raw.picture,
            gender: g.profile.raw.gender
        }
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
		reply("getPosts");
	}
};

exports.createPost = {
	auth: "session",
	handler: function(request, reply) {
		 Post.savePost(request.payload, function(err, contents) {
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
		reply("singlePost");
	}
};

exports.updateSinglePost = {
	auth: "session",
	handler: function(request, reply) {
		reply("updateSinglePost");
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
		reply("deleteSinglePost");
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
	}
};

exports.updateSingleUser = {
	auth: "session",
	handler: function(request, reply) {
		reply("updateSingleUser");
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
		reply("deleteSingleUser");
	}
};
