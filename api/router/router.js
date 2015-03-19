var controller = require("../controllers/controller.js");

module.exports = [
	{path: "/", 				method: "GET", 		config: controller.home},
	{path: "/login", 			method: "GET", 		config: controller.login },
	{path: "/logout", 			method: "GET", 		config: controller.logout },

	{path: "/posts", 			method: "GET", 		config: controller.getPosts },
	{path: "/posts", 			method: "POST", 	config: controller.createPost },

	{path: "/posts/{title}", 	method: "GET", 		config: controller.getSinglePost },
	{path: "/posts/{title}", 	method: "PUT", 		config: controller.updateSinglePost },
	{path: "/posts/{title}", 	method: "DELETE", 	config: controller.deleteSinglePost },

	{path: "/users", 			method: "GET", 		config: controller.getUsers},
	{path: "/users", 			method: "POST", 	config: controller.createUser},

	{path: "/users/{name}", 	method: "GET", 		config: controller.getSingleUser},
	{path: "/users/{name}", 	method: "PUT", 		config: controller.updateSingleUser},
	{path: "/users/{name}", 	method: "DELETE", 	config: controller.deleteSingleUser},

	{path: "/testposting",	 	method: "GET", 		config: controller.testPosting }
];