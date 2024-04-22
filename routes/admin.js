const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Categoria")
require("../models/Postagem")
require("../models/Usuario.js")
const Postagem = mongoose.model("postagens")
const Categoria = mongoose.model("categorias")
const Usuario = mongoose.model("usuarios")
const { eAdmin } = require('../helpers/eAdmin.js')
const { logado } = require("../helpers/logado.js")


router.get('/', (req, res) => {
    res.render("admin/index")
})


router.get('/posts', (req, res) => {
    res.send("admin dos posts")
})

router.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().sort({ date: 'desc' }).lean().then((categorias) => {
        res.render("admin/categorias", { categorias: categorias })
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao listar as categorias")
        res.redirect("/admin")
    })
})
router.get("/categorias/add", eAdmin, (req, res) => {
    res.render("admin/addcategorias")
})
router.post('/categorias/nova', eAdmin, (req, res) => {

    const erros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome invalido!" })
    } else if (req.body.nome.length < 3) {
        erros.push({ texto: "Nome pequeno! '4 ou mais caracteres'" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug invalido!" })
    }

    if (erros.length > 0) {
        res.render("admin/addcategorias", { erros: erros })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria Cadastrada!")
            res.redirect("/admin/categorias")
        }).catch((erro) => {
            req.flash("error_msg", "Erro ao cadastrar Categoria! Tente novamente.")
            console.log("erro ao cadastrar categoria!" + erro)
        })
    }
})
router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categorias) => {
        res.render("admin/editcategorias", { categorias: categorias })
    }).catch((erro) => {
        req.flash('error_msg', 'Categoria inexistente!')
        res.redirect("/admin/categorias")
    })

})

router.post("/categorias/edit", eAdmin, (req, res) => {

    Categoria.findOne({ _id: req.body.id }).then((categorias) => {

        categorias.nome = req.body.nome
        categorias.slug = req.body.slug

        categorias.save().then(() => {
            req.flash("success_msg", "Categoria Editada!")
            res.redirect("/admin/categorias")
        }).catch((erro) => {
            req.flash("Erro interno ao editar categoria!")
            res.redirect("/admin/categorias")
        })
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao alterar categootia! Tente novamente.')
    })
})

router.get("/categorias/deletar/:id", eAdmin, (req, res) => {
    Categoria.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Categoria " + req.body.nome + " deletada!")
        res.redirect("/admin/categorias")
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao deletar categoria!")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", logado, (req, res) => {
    Postagem.find().populate("categoria").sort({ date: "desc" }).lean().then((postagens) => {
        res.render("admin/postagens", { postagens: postagens })
    }).catch((erro) => {

    })
})

router.get("/postagens/add", logado, (req, res) => {
    Usuario.findOne().lean().then((usuarios) => {
        Categoria.find().lean().then((categorias) => {
            console.log(usuarios._id)
            res.render("admin/addpostagens", { categorias: categorias, usuarios: usuarios })
        }).catch((erro) => {

        })
    })
})
router.post("/postagens/nova", logado, (req, res) => {
    const novaPoatagem = {
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria,
        fkUsuario: req.body.fkUsuario
    }

    var erros = []
    if (req.body.categoria == 0) {
        erros.push({ texto: "Categoria invalida! Tente novamente." })

    }
    if (erros.length > 0) {
        res.render("admin/addpostagens", { erros: erros })
    } else (

        new Postagem(novaPoatagem).save().then(() => {

            req.flash("success_msg", "Postagem Cadastrada!")
            res.redirect("/")
        }).catch((erro) => {
            req.flash("error_msg", "Erro ao cadastrar postagem! Tente Novamente")
            res.redirect("/admin/postagens/add")
            console.log(erro)
        })
    )

})

router.get("/postagens/deletar/:id", logado, (req, res) => {
    Postagem.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Postagem deletada!")
        res.redirect("/admin/postagens")
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao deletar postagem! Tente novamente.")
    })
})

router.get("/postagens/edit/:id", logado, (req, res) => {
    Postagem.findOne({ _id: req.params.id }).lean().then((postagens) => {

        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", { postagens: postagens, categorias: categorias })
        }).catch((erro) => {

        })
    }).catch((erro) => {

    })
})
router.post("/postagens/edit", logado, (req, res) => {
    Postagem.findOne({ _id: req.body.id }).then((postagens) => {

        postagens.titulo = req.body.titulo
        postagens.slug = req.body.slug
        postagens.descricao = req.body.descricao
        postagens.categoria = req.body.categoria
        postagens.conteudo = req.body.conteudo

        postagens.save().then(() => {
            req.flash("success_msg", "Postagem  Editada")
            res.redirect("/admin/postagens")
        }).catch((erro) => {
            req.flash("error_msg", "Erro ao editar postagem")
        })
    })
})

router.get("/addAdmin", eAdmin, (req, res) => {
    res.render("admin/addAdmin")
})
module.exports = router