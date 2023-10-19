const mongoose = require("mongoose")

const AuthorsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false,
        default: "user"
    },
    birth: {
        type: String,
        required: true
    },
    avatar :{
        type: String,
        type: String,
        required: true
    },
}, { timestamps: true, strict: true });

module.exports = mongoose.model("AuthorsModel", AuthorsSchema, "newAuthors")