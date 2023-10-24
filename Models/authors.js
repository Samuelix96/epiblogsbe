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

    birth: {
        type: String,
        required: true
    },
    avatar :{
        type: String,
        required: false,
        default: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
    },
}, { timestamps: true, strict: true });

module.exports = mongoose.model("AuthorsModel", AuthorsSchema, "newAuthors")