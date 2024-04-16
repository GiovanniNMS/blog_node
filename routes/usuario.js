const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/registro", (req, res)=>{
    res.render("usuarios/registro")
})

router.get("/login", (req, res)=>{
    res.render("usuarios/login")
})

router.post("/registro/novo", (req, res)=>{
    var erros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome inválido!"})
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto: "Email inválido!"})
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({texto: "Senha inválida!"})
    }
    if (req.body.senha.length < 4) {
        erros.push({texto: "Senha muito curta!"})
        
    }
    if (req.body.senha != req.body.senha2) {
        erros.push({texto: "Senha diferentes! "})
    }
    
    if (erros.length > 0 ) {
        res.render("usuarios/registro", {erros: erros})
    }else{
        Usuario.findOne({email: req.body.email}).lean().then((usuario) =>{
            if (usuario) {
                console.log("email ja cadastrado")
                req.flash("error_msg", "Email já cadastrado! Faça o login.")
                res.redirect("/usuario/registro")
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })
                bcrypt.genSalt(10,(erro, salt) =>{
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
                        if (erro) {
                            req.flash("error_msg", "Erro ao enviar cadastro do usuario")
                            res.render("usuarios/registro")
                        }
                        novoUsuario.senha = hash;

                        novoUsuario.save().then(()=>{
                            req.flash("success_msg", "Cadastrado com Sucesso!")
                            res.redirect("/")
                        }).catch((error)=>{
                            req.flash("error_msg", "Erro ao cadastrar! Tente novamente!")
                            res.render("usuarios/resgistro")
                        })
                    })
                })
            }
        }).catch((erro)=>{
            req.flash("error_msg", "Erro Interno!")
        })
    }
})

router.post("/login",
    passport.authenticate('local', 
    { successFlash: "/", 
    failureRedirect: '/usuario/login', 
    failureMessage: true, 
    failureFlash:true}),
  function(req, res, next) {
    res.redirect('/');
})

router.get("/logout", (req, res)=>{
    req.logout(function(err){
        if(err){
            return next(err)
        }
        req.flash("success_msg", "Deslogado!")
        res.redirect("/")
    })
    
})
module.exports =  router