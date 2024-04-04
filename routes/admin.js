const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get('/', (req, res)=>{
    res.render("admin/index")
})


router.get('/posts', (req,res)=>{
    res.send("admin dos posts")
})

router.get('/categorias', (req, res)=>{
    Categoria.find().sort({date: 'desc'}).lean().then((categorias)=>{
        res.render("admin/categorias", {categorias: categorias})
    }).catch((erro)=>{
        req.flash("error_msg", "Erro ao listar as categorias")
        res.redirect("/admin")
    })
})
router.get("/categorias/add", (req, res)=>{
    res.render("admin/addcategorias")
})
router.post('/categorias/nova', (req, res)=>{

    const erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido!"})
    }else if(req.body.nome.length < 3){
        erros.push({texto: "Nome pequeno! '4 ou mais caracteres'"})
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: "Slug invalido!"})
    }

    

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg", "Categoria Cadastrada!")
            res.redirect("/admin/categorias")
        }).catch((erro)=>{
            req.flash("error_msg", "Erro ao cadastrar Categoria! Tente novamente.")
            console.log("erro ao cadastrar categoria!" + erro)
        })
    }

    
})
module.exports = router