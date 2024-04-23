module.exports = {
    isUsuario: function(req, res, next) {
        Postagem.find({ fkUsuario: req.user._id }).lean().then((postagens) => {
            res.locals.postagens = postagens; // Passa as postagens para as variáveis locais
            return next();
        }).catch((erro) => {
            res.redirect("/404");
        });
    }
};
