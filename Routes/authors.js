const express = require("express")
const mongoose = require("mongoose");
const authors = express.Router();
const AuthorsModel = require("../Models/authors")
const bcrypt = require("bcrypt")

authors.get('/authors' , async(req, res) => {
    try {
        const authors = await AuthorsModel.find()

        res.status(200).send({
            statusCode:200,
            authors
        })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "Errore interno nel server"
        })
    }
})

authors.get('/authors/:id', async(req, res) => {
    const {id} = req.params;

    try {
        const author = await AuthorsModel.findById(id)
        if (!author) {
            return res.status(404).send({
                statusCode:404,
                message: `Errore nella ricerca dell autore con questo id ${id}`
            })
        }
        res.status(200).send({
            statusCode:200,
            author
        })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "Errore interno nel server"
        })
    }
})

authors.post('/authors/create', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
  
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newAuthor = new AuthorsModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        birth: req.body.birth,
        avatar: req.body.avatar
    })

    try {
        const author = await newAuthor.save()
        if(!author) {
            return res.status(404).send({
                statusCode: 404,
                message: "Post non inviato correttamente"
            })
        }
        res.status(201).send({
            statusCode: 201,
            message:" Post inviato con successo",
            author
        })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "Errore interno nel server"
        })
    }
})

authors.patch('/authors/update/:id', async(req, res) => {
    const {id} = req.params;

    const authorsExist = await AuthorsModel.findById(id)
    if (!authorsExist) {
        return res.status(404).send({
            statusCode: 404,
            message: `Non esiste nessun autore con questo id ${id} per l update`
        })
    }

    try {
        const authorUpdate = req.body
        const options = { new: true }
        const author = await AuthorsModel.findByIdAndUpdate( id, authorUpdate, options)

        res.status(200).send({
            statusCode: 200,
            message : " Autore modificato con successo",
            author
        })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "Errore interno nel server"
        })
    }
})

authors.delete('/authors/delete/:id', async(req, res) => {
    const {id} = req.params;

    try {
        const author = await AuthorsModel.findByIdAndDelete(id)
        if (!author) {
            return res.status(404).send({
                statusCode: 404,
                message: `Errore nel trovare l autore con questo ${id} oppure è già stato eliminato`
            })
        }
        res.status(200).send({
            statusCode:200,
            message: 'Autore cancellato con successo',
            
        })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "Errore interno nel server"
        })
    }
})

module.exports = authors