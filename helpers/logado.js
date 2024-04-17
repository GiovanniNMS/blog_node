module.exports = {
    logado: function(req, res, next){
        if (req.isAuthenticated()) {
            return next()
        } else {
            req.flash("error_msg","Faça login para acessar!")
            res.redirect("/usuario/login")
        }
    }
}