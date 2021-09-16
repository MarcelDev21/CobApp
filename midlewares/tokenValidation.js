const jwt = require('jsonwebtoken')
const { use } = require('../routers/AuthorsRouter')

let tokenValidation = (req,res,next)=>{
    let token = req.headers.token

   // console.log(token)
   if(!token){
       return res.json({success: false, message:'este token no existe'})
   }

   jwt.verify(token,"hola",(error,user)=>{
       if(error){
           return res.json({success:false, message:"not valid token"})
       }else{ 
           //console.log(decoded.id)
           //req.body.userId = decoded.id
           //console.log(user)
           req.user=user
           next()}
   })

   
}
module.exports = tokenValidation