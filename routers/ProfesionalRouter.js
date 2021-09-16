const express = require('express')
const appProfesional = express.Router()
const ProfesionalSchema = require('../models/ProfesionalModel')
const PostSchema = require('../models/PostModel')
const ComentarioSchema = require('../models/ComentarioModel')
// buscar mail
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)
const tokenValidation = require('../midlewares/tokenValidation')
const PostModel = require('../models/PostModel')

appProfesional.get('/findmail', async(req,res)=>{
    try {
        const {name,typoUsuario,email,numero,password,confirmationPassword} = req.body
        const getMail = await ProfesionalSchema.findOne({email})
        console.log(getMail.email)


        if(getMail.email){
            return res.json({succes: false, message:"your mail exist"}) 
        }

        return res.json({succes: true, getMail})
    } catch (error) {
        return res.json({succes: false, message: error.message}) 
    }
})

// crear profesional
appProfesional.post('/createProfesional', async(req,res)=>{
    try {
        let {name,tipoUsuario,email,numero,password,confirmationPassword} = req.body

        if(password.length > 6 && confirmationPassword.length > 6){
            return res.json({succes: false, message:"your password superior to 6"})
        }

        if(!name  || !tipoUsuario || !email || !numero || !password || !confirmationPassword){
            return res.json({succes: false, message:"verified that all spaces are correct"})
        }
        // hash password
        const hashPassword = bcrypt.hashSync(password, salt) 
        password = hashPassword
        //hash confirmation Password
        const hashConfirmationPassword = bcrypt.hashSync(confirmationPassword, salt)
        confirmationPassword = hashConfirmationPassword

        
        const newProfesional = new ProfesionalSchema({name,tipoUsuario,email,numero,password,confirmationPassword})
        
        const token = jwt.sign({ id: newProfesional._id }, "hola", { expiresIn: "10h" });
        let getProfesional = await newProfesional.save()
       // console.log(getProfesional)
        return res.json({succes: true,token, getProfesional})
    } catch (error) {
        return res.json({succes: false, message: error.message}) 
    }
})

    // eliminar cuenta profesional
    appProfesional.delete('/delete', tokenValidation, async(req,res)=>{
      try {
          const id = await ProfesionalSchema.findById(req.user.id)
          console.log(id)
        //const {id}= req.params
        let deleteObject = await ProfesionalSchema.findByIdAndDelete(id)
        return res.json({succes:true, deleteObject})
      } catch (error) {
        return res.json({succes:false, message: error.message})
      }
    })

    //buscar profesional
    /*appProfesional.get('/usuario/:typoUsuario', async (req,res)=>{
        try {
            const {typoUsuario} = req.params
            let lostiposUsuarios = await ProfesionalSchema.find({typoUsuario})
            return res.json({succes: true, lostiposUsuarios})
        } catch (error) {
            return res.json({succes:false, message: error.message})
        }
    })*/

    appProfesional.post('/login', async(req,res)=> {
      try {
        const {email, password} = req.body

        if(!email || !password){
            return res.json({succes: false, message:"rellana corectamente los campos"})
        }
        const newfFindMail = await ProfesionalSchema.findOne({email})
        // hash Password
        const paswordHash = newfFindMail.password
        const hashWithBccrypt = await bcrypt.compare(password, paswordHash)
        //console.log(hashWithBccrypt)

        // create Token

        if(hashWithBccrypt == false){
            return res.json({success:false, message:"este pass no existe"})
        }else{
                let id
                const token = jwt.sign({id: newfFindMail._id}, "hola", {expiresIn: "1d"})
                return res.json({succes: true, token, message:"Bienvenido" })
        }
      } catch (error) {
        res.json({success: false, message: error.message})
      }
        /* console.log(req.body)
         return res.json({message:"buscando"})*/
    })
    
    // routa que devuelva la info de un profesional
    appProfesional.get('/devuelvaInformacionPersonal' ,tokenValidation, async(req,res)=>{
       try {
       // const {id} = req.params
        // cambiar Profesional por usuario
        /*const id = await ProfesionalSchema.findById(req.user.id)
        console.log(id)*/

        const informacionProfesional = await ProfesionalSchema.findById(req.user.id)
        console.log({informacionProfesional})
        if(!informacionProfesional){
            return res.json({success:false, message:"no lo encontramos"})  
        }
        return res.json({success:true, informacionProfesional})     
       } catch (error) {
             res.json({success: false, message: error.message}) 
       }
    })

    // ver mis post A revoir
    /*appProfesional.get('/verMisPost/:id', tokenValidation, async(req,res)=>{
        //aqui necesito el token del profesional
        try {
            //const id = await ProfesionalSchema.findById(req.user.id)
            //console.log(id)
            const {id} = req.params
                if(!id){
                    return res.json({success: false, message:"este id no existe"})
                }
            const newPostSchema = await PostSchema.findById(id).populate('postmodel')
            return res.json({success: true, newPostSchema})
        } catch (error) {
            res.json({success: false, message: error.message}) 
        }
    })*/

    //crear Post
    appProfesional.post('/crearPost', tokenValidation, async(req,res)=>{   
        //console.log("create") 
            try {
                let {image, description, fecha} = req.body
                fecha= new Date().toDateString()
               // const newPost = new PostModel({"image": {id:"1", url:"url"},"description":"destruc"})
                //const newPost = new PostModel({"image":{"id":"1", "url":"url"}, "description":"des"})
                //const newPost = new PostModel({"image":{id:"test/vzg7zl2ymytqzobt2ky4", url:"http://res.cloudinary.com/dfaz1ez3h/image/upload/v1630149383/test/vzg7zl2ymytqzobt2ky4.png"},description})
              
                const idProfesional = await ProfesionalSchema.findById(req.user.id)
                //console.log(idProfesional)
                if(!image || !description){return res.json({success:false, message:"averiguar que teneis los campos corectos"})}
                let profesional = idProfesional
                const newPost = new PostSchema({image, description,fecha,profesional})
                const newObject = await newPost.save()
                return res.json({success: true, newObject})
                /*const newPost = new PostModel({"image": {id:"1", url:"url"},"description":"destruc"})
                await newPost.save()*/
               // return res.json({success: true, newPost})
            } catch (error) {
                return res.json({success:false, message: error.message})
            }
    })


    //verMisPost
   /*appProfesional.get('/VerMisPost', tokenValidation, async(req,res)=>{
       try {
           const idProfesional = await ProfesionalSchema.findById(req.user.id)
           console.log(idProfesional)

           const verMisPost = await PostSchema.find(idProfesional).populate("postmodel")
           console.log(verMisPost)
           return res.json({success:true, verMisPost})
       } catch (error) {
        res.json({success: false, message: error.message}) 
       }
    })*/

    appProfesional.get('/VerMisPost', tokenValidation, async(req,res)=>{
        try {
            const idProfesional = await ProfesionalSchema.findById(req.user.id)
           // console.log(idProfesional._id)
           profesional = idProfesional._id
           const verMisPost = await PostModel.find({profesional})
           console.log(profesional)
           return res.json({success:true, verMisPost})
        } catch (error) {
            res.json({success: false, message: error.message}) 
        }
    })
    //ver un post en concreto
   /* appProfesional.get('/verPostenConcreto/id/:id', tokenValidation, async(req,res)=>{
        // se puede pasar solo el id para ver el post
        try {
            const idProfesional = await ProfesionalSchema.findById(req.user.id)
            console.log(idProfesional)

            const {id} = req.params
            console.log(id)
            //const verPost = await PostSchema.findOne({id})
            const verPost = await PostSchema.findById(id)
            // en el caso de que el id pasado no exista
            if(!verPost){return res.json({success: false, message:"este post no existe"}) }
            return res.json({success: true, verPost})
        } catch (error) {
            res.json({success: false, message: error.message}) 
        }
    })*/
    // ver un post que hizó el profesional
    appProfesional.get('/verPostConcreto/:id', tokenValidation, async(req,res)=>{
        try {
            const {id} = req.params
            const idToken = await ProfesionalSchema.findById(req.user.id)
            //console.log("idToken")
            let idTok= idToken._id
            const idUser = await PostModel.findById(id)
            
            console.log("laisse"+idUser)
            //console.log(idTok)
            let monId
            for (let i=0; i<=idUser.profesional.length-1; i++){
               monId=idUser.profesional[i]
            }
            
              if(idTok.toString() == monId.toString()){
                  //console.log( idTok + "=" + monId)
                  return res.json({succes: true, idUser})
              }

              if(idTok.toString() != monId.toString()){
                return res.json({succes: true, message:"los id no son parecidos"})
              }
        //console.log(idTok)
        } catch (error) {
            res.json({success: false, message: error.message})  
        }
    })

    //ver todos los comentarios de un (su) post
    /*appProfesional.get('/vertodosLosCometarios/:id', async(req,res)=>{
        try {
            const {id} = req.params
          const verComentario = await ComentarioSchema.findById(id).populate('comentario')
          return res.json({success: true, verComentario})
        } catch (error) {
            res.json({success: false, message: error.message}) 
        }
    })*/
    //ver todos que hicieron comentarios de un (sus) post
    appProfesional.get('/vertodosLosCometarios/:id', tokenValidation, async(req,res)=>{
        try {
                  // post
                  // comentario
          /*const idToken = await ProfesionalSchema.findById(req.user.id)
          const {id} = req.params
          responasableComentario = req.user.id
          const verComentario = await ComentarioSchema.findById(id).populate('comentario')
          return res.json({success: true, verComentario})*/
          const {id} = req.params
          const monPost = await PostModel.findById(id)
          console.log(monPost)
          //const verTodosComentario = await ComentarioSchema.find
        } catch (error) {
            res.json({success: false, message: error.message}) 
        }
    })

    //acceder a un comentario en particular
    appProfesional.get('/accederAunComentario/:id', async(req,res)=>{
        // necesitamos l'id del comentario
        try {
            const{id} = req.params
            const comentarioEnParticular = await ComentarioSchema.findById(id)
            return res.json({success:true, comentarioEnParticular})
        } catch (error) {
            res.json({success: false, message: error.message})  
        }
    })

    //crearComentario
    appProfesional.post('/crearComentaio/:idPost/:responsableComentario/:post', async(req,res)=>{
        // 1. crear comentario en la base de datos y guadar lo en una variable
        // 2. hacer un findByIdand Update del post y en el array del comentarios de este post, añadir el id del objeto que esta en la variable que nos ha devuelto la bdd
        // 3. devolver una respuesta
            try {
                    const {responsableComentario,post} = req.params
                    const {message} = req.body 
                    const newComentario = new ComentarioSchema({message,responsableComentario,post})
                    const comentarioSave = await newComentario.save()
                    const idComentarioSave = comentarioSave._id
                        console.log({comentarioSave})
                        console.log({idComentarioSave})
                        console.log({post})
                    /*const updatePost = await ComentarioSchema.findByIdAndUpdate(post, {$push:{respuestas: idComentarioSave}})
                    console.log({updatePost})*/
                    const updatePost = await PostSchema.findByIdAndUpdate(post, {$push:{idDeComentarios: idComentarioSave}})
                    return res.json({success: true, updatePost})
            } catch (error) {
                res.json({success: false, message: error.message})  
            }
        })

    //añadir nueva respuesta al comentario // :idComentario
    // a refaire
    appProfesional.post('/anadirnuevaRespuestaAuPost/:idResponsableComentario/:post/:message', async(req,res)=>{
        try {
            const {idResponsableComentario, post} = req.params
            const {message} = req.body
            //j' ai deja le message et la personne qui ecrit ce message
            const newRespuesta = new ComentarioSchema({message,idResponsableComentario,post})
            const guadarRespuesta = await newRespuesta.save()
            let idResponsableComentarios = guadarRespuesta._id
           // const myPost = await PostSchema.findByIdAndUpdate(idPost, {$push: { responasableComentario: idResponsableComentario, respuestas: message }}, {new: true})
          // idComentario, y l id respuesta 
           const miRespuesta = await ComentarioSchema.findByIdAndUpdate(idPost, {$push: { responasableComentario: idResponsableComentarios}}, {new: true})
           // je modifie 
            return res.json({success: true, miRespuesta})

            // 1. crear un comentario nuevo en la bd
            // 2. buscar el comentario padre y añadir en su array de respuesta el id de este nuevo comentario
        } catch (error) {
            res.json({success: false, message: error.message})  
        }
    })
    // el profesional tiene que ver todos los (sus) posts
    appProfesional.get('/VerTodosPost', tokenValidation, async(req,res)=>{
        try {
           // const VerTodoPost = await PostSchema.find({})
            //const verPost = await ProfesionalSchema.findById(req.user.id).populate('comentario')
            profesional = req.user.id
            //console.log(profesional)
            const misPost = await PostSchema.find({profesional})
            return res.json({success:true, misPost})
        } catch (error) {
            res.json({success: false, message: error.message})  
        }
    })


module.exports = appProfesional