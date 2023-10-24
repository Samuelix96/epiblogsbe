// const express = require("express");
// const validate = express.Router()
// require("dotenv").config();
// const jwt = require("jsonwebtoken")

// validate.post('/verifyToken', async(req, res) => {
//     const isTokenValid = jwt.verify(req.body.sessionToken, process.env.JWT_SECRET )
//     console.log(isTokenValid)
// })

// module.exports = validate

const express = require('express')
const validateToken = express.Router()


validateToken.post('/validateToken', async (req, res) =>{
    console.log('ciao')
})

module.exports = validateToken