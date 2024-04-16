const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcryptjs = require("bcryptjs")

require("../models/Usuario")
const Usuario = mongoose.model("usuarios")


module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"}, (email, senha, done)=>{
      Usuario.findOne({email: email}).lean().then((usuario)=>{
        if (!usuario) {
          console.log("email")
          return done(null, false, {message: "Dados inválidos! Tente novamente."})
        }
        bcryptjs.compare(senha, usuario.senha, (erro, batem)=>{
          if (batem) {
            console.log("Batem Usuario")
            return done(null, usuario)
          } else {
            console.log("nao bateu usuario")
            return done(null, false, {message: "Dados inválidos! Tente novamente."})
            
          }
        })
      })
    }))

    passport.serializeUser((usuario,done)=> {

      /*process.nextTick(function() {
        return done(null, {
          id: usuario.id
        });
      });*/

      done(null, usuario._id)
    });
    
    passport.deserializeUser((id, done)=> {
      Usuario.findOne({_id: id}).then((usuario)=>{
        done(null, usuario)
      })
    });
}


    
