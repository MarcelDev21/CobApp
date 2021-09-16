const express = require('express')
const fileUplaod = require('express-fileupload')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const app = express()
require('dotenv').config()
const appAuthor = require('./routers/AuthorsRouter')
const appBook = require('./routers/BookRouter')
const appClient = require('./routers/ClienteRouter')
const appProfesional = require('./routers/ProfesionalRouter')
const appComentaire = require('./routers/ComentarioRouter')
const appTchat = require('./routers/TchatRouter')
const appPost = require('./routers/PostRouter')
const appLike = require('./routers/LikeRouter')

const tokenValidation = require('./midlewares/tokenValidation')

const appRouter = require('./uploads')

const {PORT, DB} = process.env
mongoose.connect((DB), {  useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true})
.then(() => console.log("connected succesfuly"))
.catch((error) => console.log(error))


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileUplaod({useTempFiles: true}))
app.use(cookieParser())
app.use(cors())

app.use('/authors', appAuthor)
app.use("/books", appBook)
app.use('/cliente', appClient)
app.use('/profesional', appProfesional)
app.use('/comentario', appComentaire)
app.use('/tchat', appTchat)
app.use('/post', appPost)
app.use('/api', appRouter)
app.use('/like', appLike)

const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
console.log(`Bcrypt funciona. MIRA!!!: ${bcrypt.hashSync("1234", salt)}`);



app.listen(PORT, () => { console.log("connecté au port"+ PORT)})
//

