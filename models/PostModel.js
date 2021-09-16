const mongoose = require('mongoose')
const PostSchema = mongoose.Schema({
    image:{type:Object, required:true},
    description:{type:Object, require:true},
    fecha:{type: Date},
    like:{type: []}, 
    idDeComentarios:[{type: mongoose.Schema.Types.ObjectId, ref: "comentario" }],
    //respuestaPost:{type: mongoose.Schema.Types.ObjectId, ref:"UsuarioSchema"}
    profesional:[{type: mongoose.Types.ObjectId, ref:"professional"}]
})

module.exports = mongoose.model('postmodel', PostSchema)