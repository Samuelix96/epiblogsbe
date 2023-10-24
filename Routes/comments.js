const express = require("express");
const comments = express.Router();
const CommentsModel = require("../Models/comments")

comments.get('/blogPosts/:id/comments', async (req, res) =>
{
    const { id } = req.params;
    try
    {
        const commentBlogPost = await CommentsModel.find({ code: id })
            .populate("code")
        if (!commentBlogPost)
        {
            res.status(404).send({
                statusCode: 404,
                message: "Questo blog non esiste oppure errore con i commenti"
            })
        }

        res.status(200).send({
                statusCode: 200,
                commentBlogPost
            });
    } catch (e)
    {
        res.status(500).send(
            {
                statusCode: 500,
                message: 'Errore durante il recupero dei commenti.'
            });
    }
});

comments.get('/blogPosts/:id/comments/:commentid', async (req, res) => {
    const { id, commentid } = req.params;

    try {
        const comment = await CommentsModel.findOne({ _id: commentid, code: id });

        if (!comment) {
            return res.status(404).send({
                statusCode: 404,
                message: 'Commento non trovato per il post specificato.'
            });
        }

        res.status(200).send({
            statusCode: 200,
            comment
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: 'Errore durante il recupero del commento.'
        });
    }
});

comments.post('/blogPosts/:id/comments/create', async (req, res) =>
{
    const { id } = req.params;
    try
    {
        
        const newComment = new CommentsModel({
            userName: req.body.userName,
            content: req.body.content,
            code: id
        });

        const savedComment = await newComment.save();

        res.status(201).send(
            {
                statusCode: 201,
                message: "commento aggiunto con successo",
                 savedComment
            });
    } catch (e)
    {
        res.status(
            500).send({
                statusCode: 500,
                message: 'Errore durante l\'aggiunta del commento'
            });
    }
});

comments.put('/blogPosts/:id/comments/:commentsid', async (req, res) => {
    const { id, commentsid } = req.params;

    try {
        const updatedComment = await CommentsModel.findByIdAndUpdate(
            commentsid,
            {
                userName: req.body.userName,
                content: req.body.content,
                code: id
            },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).send({
                statusCode: 404,
                message: 'Commento non trovato.'
            });
        }

        res.status(200).send({
            statusCode: 200,
            message: 'Commento aggiornato con successo',
            updatedComment
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: 'Errore durante l\'aggiornamento del commento.'
        });
    }
});

comments.delete('/blogPosts/:id/comments/:commentsid', async (req, res) => {
    const { id, commentsid } = req.params;

    try {
        const deletedComment = await CommentsModel.findByIdAndDelete(commentsid);

        if (!deletedComment) {
            return res.status(404).send({
                statusCode: 404,
                message: 'Commento non trovato.'
            });
        }

        res.status(200).send({
            statusCode: 200,
            message: 'Commento eliminato con successo',
            
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: 'Errore durante l\'eliminazione del commento.'
        });
    }
});

module.exports = comments;