const mongoose = require('mongoose')
const LikeSchema = mongoose.Schema({
    post: {type: mongoose.Schema.Types.ObjectId, ref:'PostModel'},
    like: {type: Number},
    cliente: [{type: mongoose.Schema.Types.ObjectId, ref:'cliente'}]
})

module.exports = mongoose.model("LikeSchema", LikeSchema)