const mongoose = require("mongoose")
const schema = mongoose.Schema

const categoria = new schema({
    nome:{
        type: String,
        require: true
    },
    slug:{
        type: String, 
        require: true
    }, 
    date:{
        type: Date, 
        default: Date.now()
    }
})

mongoose.model("categorias", categoria)