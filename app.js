//Carregando modulos
const mongoose = require('mongoose')
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
const usuario = require("./routes/usuario")
const passport = require('passport')
require('./config/auth.js')(passport)
//Conf 

//sessões
app.use(session({
    secret: "secretSegura",
    resave: true,
    saveUninitialized: true
}))
//Passport
app.use(passport.initialize())
app.use(passport.session())


//Flash
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;
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
mongoose.connect("mongodb://0.0.0.0/node_bd").then(function () {
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
    
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria)=>{
        if (categoria) {
            Postagem.find({categoria: categoria._id}).populate("categoria").lean().then((postagens)=>{
       
                

                if(!postagens){
                    
                    res.render("postagem/porcategoria", {categria: categoria})
                    console.log("segundo")
                }else{
                    console.log(verfPostagens)
                    Categoria.find().lean().then((categorias)=>{
                        console.log("primeiro")
                        res.render("postagem/porcategoria", {postagens: postagens, categoria: categoria, categorias, categorias})
                    }).catch((erro)=>{
                        res.render("postagem/porcategoria", {categoria: categoria})
                    })
                }
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
app.use("/usuario", usuario)


const porta = 8081
app.listen(porta, () => {
    console.log('Servidor ok!')
})