const mongoose = require('mongoose')
const ComentarioSchema = mongoose.Schema({
    message:{type:String, required:true},
    responasableComentario: {type: mongoose.Schema.Types.ObjectId, ref:"UsuarioSchema"},
    post: {type:mongoose.Schema.Types.ObjectId, ref: "postmodel"},
    respuestas: [{type: mongoose.Schema.Types.ObjectId, ref: "comentario" }],
})

module.exports = mongoose.model('comentario', ComentarioSchema)