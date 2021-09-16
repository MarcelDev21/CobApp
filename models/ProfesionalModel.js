const mongoose = require('mongoose')

const ProfesionalSchema = mongoose.Schema({
    name:{type:String, required:true},
    tipoUsuario:{type:String, required:true},
    email:{type:String, required:true,unique:true, trim:true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
    numero:{type:String, required:true, },
    password:{type:String, required:true,minlength: 4},
    confirmationPassword:{type:String, required:true,minlength: 4},
})

module.exports = mongoose.model('professional', ProfesionalSchema)