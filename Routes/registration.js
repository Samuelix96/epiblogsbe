const express = require("express");
const registration = express.Router();
const bcrypt = require('bcrypt');
const AuthorsModel = require('../Models/authors');
const jwt = require('jsonwebtoken');
require("dotenv").config();

registration.post('/registration', async (req, res) => {
  
  const existingUser = await AuthorsModel.findOne({ email: req.body.email });

  if (existingUser) {
    return res.status(400).send({
      message: 'L\'utente esiste già',
      statusCode: 400,
    });
  }

  try {
    // Genera un salt per l'hash della password
    const salt = await bcrypt.genSalt(10);
    // Hash della password
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Crea un nuovo utente in AuthorsModel
    const newUser = new AuthorsModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPassword,
      birth: req.body.birth,
      avatar: req.body.avatar
    });

    // Salva il nuovo utente nel database
    const addUser = await newUser.save();

    // Genera il token JWT per il nuovo utente
    const token = jwt.sign(
      {
        id: addUser._id,
        firstName: addUser.firstName,
        lastName: addUser.lastName,
        email: addUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '12h',
      }
    );

    res.header('Authorization', token).status(201).send({
      message: 'Utente registrato con successo',
      statusCode: 201,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Errore durante la registrazione',
      statusCode: 500,
    });
  }
});

module.exports = registration;
