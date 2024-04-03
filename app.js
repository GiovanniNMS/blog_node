//Carregando modulos
const mongoose = require("mongoose")
const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const boryparser = require('body-parser')
const admin = require("./routes/admin")
const path = require("path")
//Conf 
//bory-parser
app.use(boryparser.urlencoded({ extended: true }))
app.use(boryparser.json())

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
//Rotas


//Outros
app.use("/admin", admin)



const porta = 8081
app.listen(porta, () => {
    console.log('Servidor ok!')
})