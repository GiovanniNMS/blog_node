const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcryptjs = require("bcryptjs")

require("../models/Usuario")
const Usuario = mongoose.model("usuarios")


module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"}, (email, senha, done)=>{
      Usuario.findOne({email: email}).lean().then((usuario)=>{
        if (!usuario) {
          console.log("emaiç")
          return done(null, null, {message: "Dados inválidos! Tente novamente.."})
        }
        bcryptjs.compare(senha, usuario.senha, (erro, batem)=>{
          if (batem) {
            console.log("foi")
            return done(null, usuario)
          } else {
            console.log("foi aui")
            return done(null, false, {message: "Dados inválidos! Tente novamente."})
            
          }
        })
      })
    }))

    passport.serializeUser(function(usuario,done) {
      process.nextTick(function() {
        return done(null, {
          id: usuario.id,
          email: usuario.email,
          
        });
      });
    });
    
    passport.deserializeUser(function(usuario, done) {
      process.nextTick(function() {
        return done(null, usuario);
      });
    });
}


    
