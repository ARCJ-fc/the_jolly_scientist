var mongoose = require("mongoose");
var bcrypt   = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var User = mongoose.Schema({
    username    : { type: String, unique: true },
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

// *** Authentication stuff:
// Commenting out for now just to avoid errors while trying to make tests
/////=====//////==========//////=========/////=========/////
//loging in

// User.pre('save', function(next){
//     var user = this;

//     if (!user.isModified('password')) return next();

//     //make it salty ;)
//     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
//         if (err) return next(err);

//         //get hashing
//         bcrypt.hash(user.password, salt, function(err, hash){
//             if (err) return next(err);

//             user.password = hash;
//             next();
//         });
//     });
// });

// User.methods.comparePassword = function(candidatePassword, callback){
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
//         if (err) return callback(err);
//         callback(null, isMatch);
//     });
// };

// //usage
// var testUser = new User({
//     username: "arcj",
//     password: "we-are-arcj"
// });

// testUser.save(function(err){
//     if (err) throw err;
// });

// User.findOne({ username: "arcj"}, function(err, user){
//     if (err) throw err;

//     user.comparePassword('we-are-arcj', function(err, isMatch){
//         if (err) throw err;
//         console.log("we-are-arcj:", isMatch);
//     });

//     user.comparePassword("we-are-fac4", function(err, isMatch){
//         if (err) throw err;
//         console.log("we-are-fac4:", isMatch);
//     });
// });
