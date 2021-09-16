const express = require('express')
const ComentarioSchema = require('../models/ComentarioModel')
const appComentario = express.Router()

//hacer un comentario
appComentario.post('/postCommetaire/:cliente', async (req,res) =>{
    try {
        const {cliente} = req.params
        const {message} = req.body
        let newComentario = new ComentarioSchema({message,cliente})
        let postComentaire = await newComentario.save()
        return res.json({succes:true, postComentaire})
    } catch (error) {
        return res.json({succes:false, message: error.message})   
    }
})
// buscar comentario de un usuario
appComentario.get('/find/:id', async(req, res)=>{
   try {
    const {id} = req.params
    let getComentarioById = await ComentarioSchema.findById(id).populate('cliente')
    return res.json({succes: true, getComentarioById}) 
   } catch (error) {
    return res.json({succes: false, message: error.message})  
   }
})

//eliminar Comentario

appComentario.delete('/deleteComentario/:id', async(req,res)=>{
  try {
    const {id} = req.params
    let deleteObject = await ComentarioSchema.findByIdAndDelete(id)
    return res.json({succes:true, deleteObject})
  } catch (error) {
    return res.json({succes:false, message: error.message})
  }
})

// hacer un like a un comentario



module.exports = appComentario