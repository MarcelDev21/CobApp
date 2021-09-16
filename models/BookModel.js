const mongoose = require('mongoose')

const BookSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    author:{
        type:mongoose.Types.ObjectId,
        ref:"author"
    },
})

module.exports = mongoose.model("book", BookSchema)