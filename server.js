const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const authorsRoute = require("./Routes/authors")
const loginRoute = require("./Routes/login")
const githubRoute = require("./Routes/github")
const PORT = 7077;
require("dotenv").config();
const blogsRoute = require("./Routes/blogPosts")
const path = require("path")




const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use(cors())
app.use(express.json())


app.use('/', blogsRoute)
app.use('/', authorsRoute)
app.use('/', loginRoute)
app.use('/', githubRoute)




mongoose.connect(`${process.env.MONGODB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on("error",  console.error.bind(console, "Error during db connection"))
db.once( "open" , (() => console.log("Database successfully connected")));
console.log(express.static(path.join(__dirname, '/uploads')))
app.listen( PORT,  () => console.log(`Server is running on port ${PORT}`));
