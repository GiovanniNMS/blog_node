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
    eAdmin:{
        type: Number,
        default: 0
    },
    senha:{
        type: String,
        require: true
    },
    token:{
        type: String,
        default: " "
    }

})

mongoose.model("usuarios", usuario)