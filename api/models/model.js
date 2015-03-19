var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var User = new Schema({
    Username    : { type: String, unique: true },
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


var post = mongoose.model('post', Post);

module.exports = {
    Post: post
};
