const mongoose = require("mongoose")
const schema = mongoose.Schema

const usuario =new schema({
    nome:{
        type: String,
        require: true
    }, 
    email:{
        type: String,
        require: true
    },
    senha:{
        type: String,
        require: true
    }

})

mongoose.model("usuarios", usuario)