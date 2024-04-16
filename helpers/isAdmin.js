module.exports = {
    isAdmin: function(req, res, next) {
        if (req.eAdmin === 1 && req.isAuthenticated() ) {
            console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
            return next();
        } else {
            console.log("qqqqqqqqqqqqqqqqqqqq")
            req.flash("error_msg", "Faça o login como administrador");
            res.redirect("/usuario/login");
        }
    }
};