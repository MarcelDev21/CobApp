const mongoose = require('mongoose')

const UsuarioSchema = mongoose.Schema({
    nameCliente:{type:String,required:true,trim:true},
    emailCliente:{type:String,required:true,trim:true,unique:true,match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
    passwordCliente:{type:String,required:true, minlength: 6,},
    confirmationPasswordCliente:{type:String,required:true, minlength: 6},
    tipoDeTrabajoCliente:{type:String,required:true},
    // profesional
    name:{type:String, required:true},
    typoUsuario:{type:String, required:true},
    email:{type:String, required:true,unique:true, trim:true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
    numero:{type:String, required:true, },
    password:{type:String, required:true,minlength: 4},
    confirmationPassword:{type:String, required:true,minlength: 4},
})
 module.exports = mongoose.model("UsuarioSchema", UsuarioSchema)