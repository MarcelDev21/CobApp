const mongoose = require('mongoose')

const ClienteSchema = mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true,unique:true,match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
    password:{type:String,required:true, minlength: 6,},
    confirmationPassword:{type:String,required:true, minlength: 6},
    tipoDeTrabajo:{type:String,required:true}
})
 module.exports = mongoose.model("cliente", ClienteSchema)