const mongoose = require('mongoose')
const TchatSchema = mongoose.Schema({
    message:{type:String, required:true},
    client:{type:mongoose.Types.ObjectId, ref:'client'},
    profesional:{type:mongoose.Types.ObjectId, ref:'professional'}
})
module.exports = mongoose.model('tchatSchema', TchatSchema)