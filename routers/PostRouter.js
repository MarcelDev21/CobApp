const express = require('express')
const PostModel = require('../models/PostModel')
const LikeModel = require('../models/Likemodel')
const Likemodel = require('../models/Likemodel')
const appPost = express.Router()


//{"image":{"id":"test/slf9khfgsjwy3cdli7oj", "url":"http://res.cloudinary.com/dfaz1ez3h/image/upload/v1630152086/test/slf9khfgsjwy3cdli7oj.pnges"},"description":"descr ok"}

appPost.post('/Post', async(req, res)=> {
    try {
        let {image, description, fecha} = req.body
        fecha= new Date().toDateString()
       // const newPost = new PostModel({"image": {id:"1", url:"url"},"description":"destruc"})
        //const newPost = new PostModel({"image":{"id":"1", "url":"url"}, "description":"des"})
        //const newPost = new PostModel({"image":{id:"test/vzg7zl2ymytqzobt2ky4", url:"http://res.cloudinary.com/dfaz1ez3h/image/upload/v1630149383/test/vzg7zl2ymytqzobt2ky4.png"},description})
        const newPost = new PostModel({image, description,fecha })
        const newObject = await newPost.save()
        return res.json({success: true, newObject})
        /*const newPost = new PostModel({"image": {id:"1", url:"url"},"description":"destruc"})
        await newPost.save()*/
       // return res.json({success: true, newPost})
    } catch (error) {
        return res.json({success:false, message: error.message})
    }
})


appPost.get('/getPost', async (req,res)=>{
   try {
    let myObjectDescripcion = await PostModel.find({})
    return res.json({success: true, myObjectDescripcion})
   } catch (error) {
       return res.json({success:false, message: error.message})
   }
})


appPost.delete('/:id', async (req, res)=> {
    try {
        const {id} = req.params
        let objectDelete = await PostModel.findByIdAndDelete(id)
        return res.json({success: true, objectDelete})
    } catch (error) {
        return res.json({success:false, message: error.message})
    }
})

appPost.put('/update/:id', async(req, res)=>{
    try {
        const {id} = req.params
        const {image, description} = req.body

        // en el caso de que solo modificamos la imagen
        if(image != undefined){
            const objectUpdate = await PostModel.findByIdAndUpdate(id, {image}, {new: true})
            return res.json({success: true, objectUpdate})
        }
        /*else{
            console.log("oups")
            return res.json({success: false, message: "no habeis entrado la imagen"})
        }*/

     if(description != undefined){
        const objectUpdate = await PostModel.findByIdAndUpdate(id, {description}, {new: true})
        return res.json({success: true, objectUpdate})
     }

     if(!image && !description ){
        const objectUpdate = await PostModel.findByIdAndUpdate(id, {image, description}, {new: true})
        return res.json({success: true, objectUpdate})
     }
       // const objectUpdate = await PostModel.findByIdAndUpdate(id, {image, description,fecha}, {new: true})
        //return res.json({success: true, objectUpdate})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }

    appPost.post('/añadirLike/:id', async(req, res)=> {
        const{id} = req.params
        const {like} = req.body
        like+=1
        const newObjecFinded = await PostModel.findById(id)
        const likes = new Likemodel(like)
        return res.json({success: true, newObjecFinded})
    })
})

module.exports = appPost