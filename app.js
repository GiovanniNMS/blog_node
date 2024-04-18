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
const {logado} = require("./helpers/logado.js")

//Conf 

//sessões
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true }
  }));
 
//Passport
app.use(passport.initialize())
app.use(passport.session())


//Flash
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    res.locals.eAdmin = req.user && req.user.eAdmin;
    res.locals.logado = req.logado;
    next();
    
})
//bory-parser
app.use(bodyoparser.urlencoded({ extended: true }))
app.use(bodyoparser.json())

//HandleBars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//Mongoose
mongoose.Promise = global.Promise
mongoose.connect("mongodb+srv://jovincu123:sopaio123@cluster0.70vnaw0.mongodb.net/node_bd").then(function () {
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
//console.log(req.user); 
    Postagem.find().sort({ data: "desc" }).populate("categoria").lean().then((postagens) => {
        Categoria.find().sort({ date: 'desc' }).lean().then((categorias) => {
            res.render("index", { postagens: postagens, categorias: categorias, eAdmin: req.user && req.user.eAdmin });
        });
    }).catch((erro) => {
        req.flash("error_msg", "Ocorreu um erro interno!");
        res.redirect("/404");
    });
});

app.get("/404", (req, res) => {
    res.send("ERROR 404!")
})

app.get("/postagem/:slug", logado, (req, res) => {
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


const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Servidor Node.js rodando em http://${HOST}:${PORT}`);
});
app.listen(porta, () => {
    console.log('Servidor ok!')
})