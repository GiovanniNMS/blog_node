module.exports = {
    eAdmin: function(req, res, next) {
        if (req.isAuthenticated() && req.user.eAdmin === 1) {
            return next();
        } else {
            req.flash("error_msg", "Faça o login como administrador");
            res.redirect("/usuario/login");
        }
    }
};
