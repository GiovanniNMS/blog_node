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

//Conf 

//sessões
app.use(session({
    secret: "secretSegura",
    saveUninitialized: true
}))
app.use(flash())

//Flash
app.use((req, res, next)=>{
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
mongoose.connect("mongodb://127.0.0.1:27017/node_bd").then(function() {
    console.log("MongoDB ok");
}).catch(function(erro){
    console.log("Erro ao conectar ao mongodb"+erro)
})

//Public
app.use(express.static(path.join(__dirname, "public")))
app.use((req, res, next) => {
    console.log("MIDDLEWARE OK!")
    next()
})
//Rotas
app.get("/", (req, res)=>{
    Postagem.find().populate("categoria").sort({date: "desc"}).lean().then((postagens)=>{
        
        res.render("index", {postagens:postagens})
    }).catch((erro)=>{
        req.flash("error_msg", "Ocorreu Erro Interno!")
        res.redirect("/404")
    })
})
app.get("/404", (req, res)=>{
    res.send("ERROR 404!")
})
//Outros
app.use("/admin", admin)



const porta = 8081
app.listen(porta, () => {
    console.log('Servidor ok!')
})