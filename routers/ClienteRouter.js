const express = require('express')
const appClient = express.Router()
const ClienteSchema = require('../models/ClienteModel')
const LikeSchema = require('../models/Likemodel')

const bcrypt = require('bcrypt')

const ComentarioSchema = require('../models/ComentarioModel')
const salt = bcrypt.genSaltSync(10)

const PostSchema = require('../models/PostModel')

const jwt = require('jsonwebtoken');

const tokenValidation = require('../midlewares/tokenValidation')
const { mongo } = require('mongoose')


appClient.get('/privada', (req,res)=>{
    const id = req.body.userId
    console.log(req.body.userId)
    res.json({message:'esta routa es privada'})
})


appClient.get('/getClient', async(req,res)=>{
    return res.json({message:"bienevenue"})
})
// crear user
appClient.post('/crearCliente', async (req,res)=> {
    try {
        let {name, email,password, confirmationPassword, tipoDeTrabajo} = req.body
        
        if(password != confirmationPassword){
            return res.json({succes: false, message:'verified your password'})
        }

        if(!name || !email || !password || !confirmationPassword || !tipoDeTrabajo){
            return res.json({succes: false, message:'verified that all your fields are completed'})
        }
        //console.log(hash)

        if(password.length > 6 && confirmationPassword.length > 6){
            return res.json({succes: false, message:'Your password need to have - 6 caracters'})
        }

        const passwordHash = bcrypt.hashSync(password, salt)
        password = passwordHash
        const confirmationHash = bcrypt.hashSync(confirmationPassword, salt)
        confirmationPassword = confirmationHash
        
        const token = jwt.sign({ id: ClienteSchema._id }, "hola", { expiresIn: "3h" });
       // return res.json({success:true, token, message:"bienvenido"})}
       // console.log(token)

        let newCliente = new ClienteSchema({name, email,password, confirmationPassword,tipoDeTrabajo})
        let creacíonCliente = await newCliente.save()
        return res.json({success: true, token,  creacíonCliente}) 
    } catch (error) {
        return res.json({success: false, message: error.message}) 
    }
})

// tener todos los clientes
appClient.get('/tenerTodosClientes', async(req,res)=>{
   try {
        const newCliente = await ClienteSchema.find({})
        return res.json({succes: true, newCliente})
   } catch (error) {
    return res.json({succes: false, message: error.message})
   }
})

// eliminar users
appClient.delete('/deleteUser', tokenValidation,  async (req,res)=>{
    // comparer si l id qu on entre est egale aux autres
  try {
    const id = await ClienteSchema.findById(req.user.id)
    console.log(id)
    //console.log(ClienteSchema)
    let clientDelete = await ClienteSchema.findByIdAndDelete(id)
    return res.json({succes:true, clientDelete})  
  } catch (error) {
    return res.json({succes:false, message: "eliminado con exito"})  
  }
})
    //login cliente
    appClient.post('/login', async(req,res)=>{
       
        try {
            let {email,password} = req.body
            const objectFind = await ClienteSchema.findOne({email})
            //console.log("console",{objectFind})
            let passWordComparado = await bcrypt.compare(password, objectFind.password)
            if(passWordComparado == false)
            {return res.json({success: false, message: "no encontramos el password"})}
            else{
                let id
                const token = jwt.sign({id: objectFind._id}, "hola", {expiresIn: 3600})
                //console.log(id)
                return res.json({success:true, token, message:"bienvenido"})}
            //console.log(passWordComparado)

           //return res.json({success:true, objectFind})
           
        } catch (error) {
            return res.json({succes: false, message:error.message})
        }
    })

//buscar segun tipo de trabajo
appClient.post('/buscarCliente', tokenValidation,  async(req,res)=>{
   
    try {
        const cliente = await ClienteSchema.findById(req.user.id)
        console.log(req.user.id)
        const {tipoDeTrabajo} = req.body
        const objetoencontrado = await ClienteSchema.find({tipoDeTrabajo})
    
        console.log(objetoencontrado.length)

        /*const newObject = objetoencontrado.filter((tipoDeTrabajos) => {if(tipoDeTrabajos == tipoDeTrabajo) {console.log(" existe")}})
        console.log(newObject)*/

        if(!objetoencontrado){
            return res.json({success:false, message: "no encotramos este tipe de trabajo en nuestra db"})
        }
        return res.json({success:true, objetoencontrado})
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})

// el cliente va a comentar un post
appClient.post('/commentarPost/:post', tokenValidation,  async(req,res)=>{
    // en commentatio podremos tener acceso a la imagen a partir de la id
    // a que me va a servir el array
    try {
        // cliente

        const cliente = await ClienteSchema.findById(req.user.id)
        console.log(cliente)
       const {post} = req.params
       const {message} = req.body
       if(!message){
        return res.json({success: false, message:'averiguar que tienes todo correcto'}) 
       }
       console.log(cliente+"y"+post)
       const createCommentaire = new ComentarioSchema({message,cliente,post})
       const idCom = createCommentaire._id

       const modifiedPost = await PostSchema.findByIdAndUpdate(post, {$push:{idDeComentarios:idCom}})
       console.log(modifiedPost)
       //const buscarIdComentario = await ComentarioSchema.findByIdAndUpdate(idComentario, {$push: { responasableComentario: idResponsable, respuestas: crearNewComentario._id }}, {new: true})
       
       const postCommentaire = await createCommentaire.save()
       return res.json({success: true, postCommentaire})
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
})

//respuesta comentario
/*appClient.post('/responderComentario/:idResponsable/:idComentario', async(req,res)=>{
   try {
    const {message} = req.body
    const {idResponsable, idComentario} = req.params

    const crearNewComentario = new ComentarioSchema({idResponsable, message})
    const buscarIdComentario = await ComentarioSchema.findByIdAndUpdate(idComentario, {$push: { responasableComentario: idResponsable, respuestas: crearNewComentario._id }}, {new: true})
    
   
    return res.json({success: true, buscarIdComentario})
   } catch (error) {
    return res.json({success: false, message: error.message}) 
   }
})*/
appClient.post('/responderComentario/:idComentario', tokenValidation, async(req,res)=>{
    try {
 
     const {message} = req.body
     const {idComentario} = req.params
     
     const idResponsable = await ClienteSchema.findById(req.user.id)
     //console.log("ou est mon id"+idResponsable)
 
     const crearNewComentario = new ComentarioSchema({idResponsable, message})
     const buscarIdComentario = await ComentarioSchema.findByIdAndUpdate(idComentario, {$push: { responasableComentario: idResponsable, respuestas: crearNewComentario._id }}, {new: true})
     
    
     return res.json({success: true, buscarIdComentario})
    } catch (error) {
     return res.json({success: false, message: error.message}) 
    }

 })

//obtener un comentario
/*appClient.get('/obtenerComentario/:id', tokenValidation, async(req,res)=> {
    try {
       // const{id} = req.params
        const obtencionComentario = await ComentarioSchema.findById(id).populate("respuestas")
        return res.json({succes: true, obtencionComentario})
    } catch (error) {
        return res.json({succes: false, message:error.message})
    }
    })*/

  // a revoir 
    appClient.get('/obtenerComentario/:id', tokenValidation, async(req,res)=> {
        try {
            const myAccount = await findById(req.user.id)
            const{id} = req.params
            const obtencionComentario = await ComentarioSchema.findById(id).populate("respuestas")
            return res.json({succes: true, obtencionComentario})
        } catch (error) {
            return res.json({succes: false, message:error.message})
        }
        })
// selectionar


appClient.post("/hacerLike/:post", tokenValidation, async(req,res)=>{
     try {

       return res.json({success:true})
     } catch (error) {
        return res.json({succes: false, message:error.message})
     }
})
module.exports = appClient