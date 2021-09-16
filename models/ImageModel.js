const mongoose = require('mongoose')

const ImagenSchema = mongoose.Schema({
    id:{type:String, required: true},
    url:{type:String, required: true}
})

module.exports = mongoose.model('ImagenSchema', ImagenSchema)