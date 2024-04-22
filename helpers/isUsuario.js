const mongoose = require("mongoose");
require("../models/Postagem.js")
const Postagem = mongoose.model("postagens");

module.exports = {
    isUsuario: function(req, res, next) {
        Postagem.find().lean().then((postagens) => {
            if (req.isAuthenticated() && postagens.length > 0) {
                return next();
            } 
        }).catch((erro) => {
           
            res.redirect("/404")
        });
    }
};
