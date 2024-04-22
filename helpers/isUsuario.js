const mongoose = require("mongoose");
require("../models/Postagem.js")
const Postagem = mongoose.model("postagens");

module.exports = {
    isUsuario: function(req, res, next) {
        Postagem.find().lean().then((postagens) => {
            if (req.isAuthenticated() && postagens.length > 0) {
                return next();
            } else {
                res.redirect("/404")
            }
                
            
        }).catch((erro) => {
            res.status(500).send("Erro interno no eUsuario.");
            console.log(erro)
        });
    }
};
