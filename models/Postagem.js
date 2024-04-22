const mongoose = require("mongoose")
const schema = mongoose.Schema

const postagem = new schema({
    titulo:{
        type: String,
        require: true
    }, 
    slug:{
        type: String, 
        require: true
    }, 
    descricao:{
        type: String, 
        require: true
    }, 
    conteudo:{
        type: String, 
        require: true
    },
    categoria:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "categorias", 
        require: true
    },
    fkUsuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "usuarios",
        require: true
    },
    data:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model("postagens", postagem)