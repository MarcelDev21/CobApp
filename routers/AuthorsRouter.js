const express = require('express')
const appAuthor = express.Router()
const AuthorSchema = require('../models/AuthorsModels')

appAuthor.get('/', async(req,res) =>{
    try {
        let getAll = await AuthorSchema.find({})
        return res.json({success: true, getAll})  
    } catch (error) {
        return res.json({success: false, message: error.message})   
    }
})

appAuthor.post('/', async(req,res) =>{
    try {
        const {name,description,age} = req.body
        let newAuthor = new AuthorSchema({name,description,age})
        let addAll = await newAuthor.save()
        return res.json({success: true, addAll})  
    } catch (error) {
        return res.json({success: false, message: error.message})   
    }
})



module.exports = appAuthor