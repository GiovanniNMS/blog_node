//Carregando modulos
const mongoose = require("mongoose")
const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const bodyoparser = require('body-parser')
const admin = require("./routes/admin")
const path = require("path")
const session = require('express-session')
const flash = require('connect-flash')
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")

//Conf 

//sessões
app.use(session({
    secret: "secretSegura",
    saveUninitialized: true
}))
app.use(flash())

//Flash
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})
//bory-parser
app.use(bodyoparser.urlencoded({ extended: true }))
app.use(bodyoparser.json())

//HandleBars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//Mongoose
mongoose.Promise = global.Promise
mongoose.connect("mongodb://127.0.0.1:27017/node_bd").then(function () {
    console.log("MongoDB ok");
}).catch(function (erro) {
    console.log("Erro ao conectar ao mongodb" + erro)
})

//Public
app.use(express.static(path.join(__dirname, "public")))
app.use((req, res, next) => {
    console.log("MIDDLEWARE OK!")
    next()
})
//Rotas
app.get("/", (req, res) => {
    Postagem.find().sort({ data: "desc" }).populate("categoria").lean().then((postagens) => {

        Categoria.find().sort({ date: 'desc' }).lean().then((categorias) => {
            res.render("index", {postagens: postagens, categorias: categorias})
        }
        )
    }).catch((erro) => {
    req.flash("error_msg", "Ocorreu Erro Interno!")
    res.redirect("/404")
})
})

app.get("/404", (req, res) => {
    res.send("ERROR 404!")
})

app.get("/postagem/:slug", (req, res) => {
    Postagem.find({ slug: req.params.slug }).populate("categoria").lean().then((postagem) => {
        if (postagem) {
            res.render("postagem/index", { postagem: postagem })
        } else {
            req.flash("error_msg", "Essa postagem não existe")
            res.redirect("/")
        }
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao carregar postagem! Tente novamente.")
        res.redirect("/")
    })
})

app.get("/filtrocategoria/:slug", (req, res)=>{
    const cat =  req.params.slug
    console.log(cat)
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria)=>{
        if (categoria) {
            Postagem.find({categoria: categoria._id}).populate("categoria").lean().then((postagens)=>{
                res.render("postagem/porcategoria", {postagens: postagens, categoria: categoria})
            })
        } else {
            req.flash("error_msg", "Categoria inexistente!")
            res.redirect("/")
        }
    }).catch((erro)=>{
        console.log(erro)
    })
})

//Outros
app.use("/admin", admin)


const porta = 8081
app.listen(porta, () => {
    console.log('Servidor ok!')
})