const express = require('express')
const appTchat = express.Router()
const TchatSchema = require('../models/TchatModel')

// crear tchat client
appTchat.post('/crearTchatclient', async (req,res) =>{
    try {
        const{message,client} = req.body
        let newTchat = new TchatSchema({message,client})
        let postTchatClient = await newTchat.save()
        return res.json({success: true, postTchatClient}) 
    } catch (error) {
        return res.json({success: false, message: error.message}) 
    }
})

//populate tchat with id cliente
appTchat.get('/getIdCliente/:id', async (req,res) => {
   try {
    const {id} = req.params
    const idClient = await TchatSchema.findById(id).populate('cliente')
    return res.json({success: true, idClient})
   } catch (error) {
    return res.json({success: false, message: error.message})  
   }
})

//
appTchat.post('/crearTchatProfesional', async (req,res) =>{
    try {
        const{message,profesional} = req.body
        let newTchat = new TchatSchema({message,profesional})
        let postTchatProfesional = await newTchat.save()
        return res.json({success: true, postTchatProfesional}) 
    } catch (error) {
        return res.json({success: false, message: error.message}) 
    }
})

// populateClient
appTchat.get('/getIdProfesional/:id', async(req,res) => {
    try {
        const {id} = req.params
        const idProfesional = await TchatSchema.findById(id).populate('profesional')
        return res.json({success: true, idProfesional}) 
    } catch (error) {
        return res.json({success: false, message: error.message}) 
    }
})

module.exports = appTchat