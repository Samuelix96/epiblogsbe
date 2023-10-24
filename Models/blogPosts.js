const mongoose = require("mongoose");

const BlogsSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    readTime: {
        type: String,
        required: false,
        default: "10 min fa"
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthorsModel"
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true, strict: true });

module.exports = mongoose.model("blogModel", BlogsSchema, "newBlogPost");