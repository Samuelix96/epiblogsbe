const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
    userName : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    code : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogModel"
    }
}, { timestamps: true, strict: true});

module.exports = mongoose.model("CommentsModel", CommentsSchema, "comments")