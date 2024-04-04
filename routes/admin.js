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
router.get("/categorias/edit/:id", (req, res)=>{
    Categoria.findOne({_id: req.params.id}).lean().then((categorias)=>{
        res.render("admin/editcategorias", {categorias: categorias})
    }).catch((erro)=>{
        req.flash('error_msg', 'Categoria inexistente!')
        res.redirect("/admin/categorias")
    })
    
})

router.post("/categorias/edit", (req, res)=>{
    
     Categoria.findOne({_id: req.body.id}).then((categorias)=>{

        categorias.nome = req.body.nome
        categorias.slug = req.body.slug

        categorias.save().then(()=>{
            req.flash("success_msg", "Alterado com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((erro)=>{
            req.flash("Erro interno ao editar categoria!")
            res.redirect("/admin/categorias")
        })

        
     }).catch((erro)=>{
        req.flash('error_msg', 'Erro ao alterar categootia! Tente novamente.')
     })
})

router.post("/categorias/deletar", (req, res)=>{
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria " + req.body.nome + " deletada!")
        res.redirect("/admin/categorias")
    }).catch((erro)=>{
        req.flash("error_msg", "Erro ao deletar categoria!")
        res.redirect("/admin/categorias")
    })
})

module.exports = router