const express = require("express");
const BlogModel = require("../Models/blogPosts")
const blogs = express.Router()
const multer = require("multer")
const crypto = require("crypto")
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage} = require("multer-storage-cloudinary");
require("dotenv").config();
const verifyToken = require("../middlewares/verifyToken")


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_APY_KEY,
    api_secret : process.env.CLOUDINARY_APY_SECRET,
})

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params : {
        folder: "CoverImage",
        format: async(req,file) => "png",
        public_id : (req, file) => file.name
    }
})



const internalStorage = multer.diskStorage({
    destination: (req, file, cb) =>
    {
        cb(null, './public')
    },
    filename: (req, file, cb) =>
    {

        //! Generiamo un suffisso unico per il nostro file
        const uniqueSuffix = `${ Date.now() }-${ crypto.randomUUID() }`

        //! Qui ci recuperiamo da tutto solo l estensione del file
        const fileExtension = file.originalname.split('.').pop()

        //! Eseguiamo la cb (CALLBACK) con il titolo Completo
        cb(null, `${ file.fieldname }-${ uniqueSuffix }.${ fileExtension }`)
    }
})

const upload = multer({ storage: internalStorage })
const cloudUpload = multer({ storage: cloudStorage})



blogs.post('/blogPosts/cloudUpload', cloudUpload.single("cover"), async(req, res) => {
    try {
        res.status(200).json({cover: req.file.path})
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Error internal server"
        })
    }
})

blogs.post('/blogPosts/uploads', upload.single("cover"), async (req, res) =>
{
    const url = `${ req.protocol }://${ req.get('host') }`; //http://localhost:7077
    console.log(req.file)
    try
    {
        const imgUrl = req.file.filename;
        
        res.status(200).json({ cover: `${ url }/public/${ imgUrl }` })
       
    } catch (error)
    {
        res.status(500).send({
            statusCode: 500,
            message: "Error internal server"
        })
    }

})

blogs.get('/blogPosts',async (req, res) =>
{
    const { page = 1, pageSize = 3} = req.query;
    try
    {
        const blog = await BlogModel.find()
            .populate("author")
            .skip((page - 1) * pageSize)
            .limit(pageSize)

        const totalPosts = await BlogModel.count()

        res.status(200).send({
            statusCode: 200,
            currentPage: Number(page),
            totalPosts,
            totalPages: Math.ceil(totalPosts / pageSize),
            blog
        })
    } catch (e)
    {
        res.status(500).send({
            statusCode: 500,
            message: "Error internal server"
        })
    }
})

blogs.get('/blogPosts/bytitle', async (req, res) =>
{
    const { title } = req.query;

    try
    {
        const blog = await BlogModel.find({
            title: {
                $regex: title,
                $options: "i"
            }
        })

        res.status(200).send({
            statusCode: 200,
            blog
        })
    } catch (e)
    {
        res.status(500).send({
            statusCode: 500,
            message: "Error internal server"
        })
    }
})

blogs.post('/blogPosts/newCreate', async (req, res) =>
{
    const newBlog = new BlogModel({
        category: req.body.category,
        title: req.body.title,
        cover: req.body.cover,
        readTime: req.body.readTime,
        author: req.body.author,
        content: req.body.content
    });
    try
    {
        const newBlogPost = await newBlog.save()

        res.status(201).send({
            statusCode: 201,
            message: "Post successfully",
            payload: newBlogPost
        })
    } catch (e)
    {
        res.status(500).send({
            statusCode: 500,
            message: "Error internal server"
        })
    }
})

blogs.patch('/blogPosts/update/:postId', async (req, res) =>
{
    const { postId } = req.params;

    const postExist = await BlogModel.findById(postId)
    if (!postExist)
    {
        return res.status(404).send({
            statusCode: 404,
            message: `Post not Found by Id ${ postId } `
        })
    }

    try
    {
        const UpdatePost = req.body
        const options = { new: true }
        const result = await BlogModel.findByIdAndUpdate(postId, UpdatePost, options)

        res.status(200).send({
            statusCode: 200,
            result
        })
    } catch (e)
    {
        res.status(500).send({
            statusCode: 500,
            message: "Error internal server"
        })
    }
})

blogs.delete('/blogPosts/delete/:postId', async (req, res) =>
{
    const { postId} = req.params


    try
    {
        const blogPost = await BlogModel.findByIdAndDelete(postId)
        if (!blogPost)
        {
            return res.status(404).send({
                statusCode: 404,
                message: `BlogPost non esiste o è gia stato eliminato con questo id ${ id }`
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: "BlogPost eliminato con successo"
        })
    } catch (e)
    {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno al server",
        })
    }
})

blogs.get('/blogPosts/byid/:id', async(req, res) => {
    const {id} = req.params;

    try{
        const blog = await BlogModel.findById(id)
        if(!blog) {
            return res.status(404).send({
                statusCode:404,
                message : `questo post non esiste con questo id ${id}`
            })
        }
        res.status(200).send({
            statusCode: 200,
            blog
        })
    } catch(error) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno con il server"
        })
    }
})

module.exports = blogs