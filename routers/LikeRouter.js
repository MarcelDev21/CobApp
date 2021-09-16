const express = require('express')
const LikeSchema = require('../models/Likemodel')
const appLike = express.Router()

appLike.post('/:id', async(req, res) => {
    try {
        let {id} = req.params
        let { post, like, cliente} = req.body
        //console.log("the id"+ id)
        let newId = await LikeSchema.findById(id)
        console.log(newId)
        /* if(id){
        like +=1
        console.log("mylike"+like)

        const theId = await LikeSchema.findById(id)
            console.log(theId)
        const newObjectLike = new LikeSchema({post, like, cliente})
        const objectPost = await newObjectLike.save()
        return res.json({success: true, objectPost})
          }*/
        
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
})


appLike.post('/dislike/:id', async(req, res) => {
    try {
        let { post, like, cliente} = req.body
        like -=1
        const newObjectLike = new LikeSchema({post, like, cliente})
        const objectPost = await newObjectLike.save()
        return res.json({success: true, objectPost})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
})

module.exports = appLike