var mongoose = require("mongoose");
var Schema   = mongoose.schema;
var bcrypt   = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var User = new Schema({
    username    : { type: String, unique: true },
    password    : { type: String },
    name        : { type: String },
    description : { type: String }
});

var Post = new Schema({
    title       : { type: String, unique: true },
    content     : { type: String, unique: true },
    author      : { type: String },
    created     : { type: String },
    updated     : { type: String }
});

Post.methods.savePost = function(requestData, callback){
    var newPost = {
        title  : requestData.title,
        content: requestData.content,
        author : requestData.author,
        created: new Date(),
        updated: new Date()
    };
    
    var post = new this(newPost);
    post.save(callback);
};

Post.methods.updatePost = function(post, callback) {
    this.findOne({ title: post.title }, function (err, doc){
        doc.title = post.title || doc.title;
        doc.content = post.content || doc.content;
        doc.updated = new Date();
        doc.save(callback);
    });
};

Post.method.deletePost = function(post, callback) {
    this.remove({ title: post.title }, callback);
};


/////=====//////==========//////=========/////=========/////
//loging in

User.pre('save', function(next){
    var user = this;
    
    if (!user.isModified('password')) return next();
    
    //make it salty ;)
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if (err) return next(err);
        
        //get hashing
        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) return next(err);
            
            user.password = hash;
            next();
        });
    });
});

User.methods.comparePassoword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

//usage
var testUser = new User({
    username: "arcj",
    password: "we-are-arcj"
});

testUser.save(function(err){
    if (err) throw err;
});

User.findOne({ username: "arcj"}, function(err, user){
    if (err) throw err;
    
    user.comparePassword('we-are-arcj', function(err, isMatch){
        if (err) throw err;
        console.log("we-are-arcj:", isMatch);
    });
    
    user.comparePassword("we-are-fac4", function(err, isMatch){
        if (err) throw err;
        console.log("we-are-fac4:", isMatch);
    });
});


var post = mongoose.model('post', Post);
var user = mongoose.model('user', User);

module.exports = {
    Post: post
};