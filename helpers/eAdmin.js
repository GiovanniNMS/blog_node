module.exports = {
    eAdmin: function(req, res, next) {
        if (req.isAuthenticated())  {
            return next();
        } else {
            req.flash("error_msg", "Acesso restrito!");
            res.redirect("/");
        }
    }
};