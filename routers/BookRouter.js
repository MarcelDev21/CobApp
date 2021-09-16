const express = require('express')
const appBook = express.Router()
const BookSchema = require('../models/BookModel')

appBook.get('/', async (req,res) => {
    try {
       let gettAllBook = await BookSchema.find({})
       return res.json({success:true, gettAllBook})
    } catch (error) {
        return res.json({success:false, message: error.message}) 
    }
})

appBook.get('/find/:id', async (req,res) => {
    try {
        const {id} = req.params
       let gettAllBook = await BookSchema.findById(id).populate('author')
       return res.json({success:true, gettAllBook})
    } catch (error) {
        return res.json({success:false, message: error.message}) 
    }
})

appBook.get('/:author', async(req,res) => {
    try {
        const {author} = req.params 
        console.log(author)
        let findAuthor = await BookSchema.find({"author":author}).populate("author")
        return res.json({success:true, findAuthor})
    } catch (error) {
        return res.json({success:false, message: error.message}) 
    }
})

appBook.post('/', async (req,res) => {
    try {
       const {title,description,author} = req.body
       let newBook = new BookSchema({title,description,author})
       let postBook = await newBook.save()
       return res.json({success:true, postBook})
    } catch (error) {
        return res.json({success:false, message: error.message}) 
    }
})


appBook.put('/update/:id',async (req,res) => {
    try {
        const {id} = req.params
        const {title,description,author} = req.body
        //let valueUpdate = new BookSchema({title,description,author})
        let docDelete = await BookSchema.findOneAndUpdate(id,{title,description,author},{new:true})
        console.log(id)
        return res.json({success : true, docDelete})
    } catch (error) {
        return res.json({success : false, message: error.message}) 
    }
})


appBook.delete('/delete/:id', async(req,res)=>{
    try {
        const {id} = req.params
        let valueDelete = await BookSchema.findOneAndRemove(id)
        return res.json({success: true, valueDelete})
    } catch (error) {
        return res.json({success:false, message: error.message}) 
    }
})

module.exports = appBook