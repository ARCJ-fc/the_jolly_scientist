var mongoose = require("mongoose");

var User = mongoose.Schema({
    Username    : { type: String, unique: true },
    password    : { type: String },
    name        : { type: String },
    description : { type: String }
});

var Post = mongoose.Schema({
    title       : { type: String, unique: true },
    content     : { type: String, unique: true },
    author      : { type: String },
    created     : { type: String },
    updated     : { type: String }
});

// Posts
exports.getPosts = function(callback){

    var blogPost = mongoose.model('post', Post, "Posts");

    blogPost.find({}, callback);
};

exports.createPost = function(requestData, callback){

    var blogPost = mongoose.model('post', Post, "Posts");

    var newPost = {
        title  : requestData.title,
        content: requestData.content,
        author : requestData.author,
        created: new Date(),
        updated: new Date()
    };

    var post = new blogPost(newPost);

    post.save(callback);
};

exports.getSinglePost = function(title, callback){

    var blogPost = mongoose.model('post', Post, "Posts");

    blogPost.find({title: title}, callback);
};

exports.updateSinglePost = function(post, user, callback) {

    var blogPost = mongoose.model('post', Post, "Posts");

    blogPost.findOne({ title: post.title }, function (err, doc){
        if (doc.author !== user) {return callback("You can't update that user's posts!");}
        doc.title = post.title || doc.title;
        doc.content = post.content || doc.content;
        doc.updated = new Date();
        doc.save(callback);
    });
};

exports.deleteSinglePost = function(title, user, callback) {

    var blogPost = mongoose.model('post', Post, "Posts");

    blogPost.findOne({ title: title }, function(err, doc) {
        if (doc.author !== user.author) {return callback("You can't delete that user's posts!");}
        blogPost.remove({title: doc.title}, callback);
    });
};

// Users

exports.getUsers = function(callback){

    var users = mongoose.model("user", User, "Users");

    users.find({}, callback);
};

exports.getSingleUser = function(title, callback){

    var users = mongoose.model("user", User, "Users");

    users.find({name: name}, callback);
};

exports.updateSingleUser = function(singleUser, user, callback) {

    var users = mongoose.model('user', User, "Users");

    users.findOne({ name: singleUser.name }, function (err, doc){
        if (doc.author !== user) {return callback("You can't update that user's posts!");}
        doc.description = singleUser.description;
        doc.save(callback);
    });
};

exports.deleteSingleUser = function(singleUserName, user, callback) {

    var users = mongoose.model("user", User, "Users");

    users.findOne({ name: singleUserName }, function(err, doc) {
        if (doc.author !== singleUserName) {return callback("You can't delete that user's posts!");}
        blogPost.remove({name: singleUserName}, callback);
    });
};