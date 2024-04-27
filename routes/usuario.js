const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const nodemailer = require("nodemailer")
const emailValidator = require("email-validator")
const emailExistence = require("email-existence")

const transport = nodemailer.createTransport({
    host: "outlook.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: "giovanni.ofice@hotmail.com",
        pass: "sopaio123"
    }
})

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/registro/novo", (req, res) => {
    const erros = [];

    if (!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null) {
        erros.push({ texto: "Nome inválido!" });
    }

    if (!req.body.email || typeof req.body.email === undefined || req.body.email === null) {
        erros.push({ texto: "E-mail inválido!" });
    }

    if (!req.body.senha || typeof req.body.senha === undefined || req.body.senha === null) {
        erros.push({ texto: "Senha inválida!" });
    }

    if (req.body.senha.length < 4) {
        erros.push({ texto: "Senha muito curta!" });
    }

    if (req.body.senha !== req.body.senha2) {
        erros.push({ texto: "Senhas diferentes!" });
    }

    if (erros.length > 0) {
        res.render("usuarios/registro", { erros: erros });
    } else {
        if (!emailValidator.validate(req.body.email)) {
            req.flash("error_msg", "E-mail inválido! Informe um e-mail válido.");
            return res.redirect("/usuario/registro");
        }

        emailExistence.check(req.body.email, function (error, response) {
            if (response) {
                Usuario.findOne({ email: req.body.email }).lean().then((usuario) => {
                    if (usuario) {
                        console.log("E-mail já cadastrado");
                        req.flash("error_msg", "E-mail já cadastrado! Faça o login.");
                        return res.redirect("/usuario/registro");
                    } else {
                        const novoUsuario = new Usuario({
                            nome: req.body.nome,
                            email: req.body.email,
                            senha: req.body.senha
                        })
                        bcrypt.genSalt(10, (erro, salt) => {
                            bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                                if (erro) {
                                    req.flash("error_msg", "Erro ao enviar cadastro do usuario")
                                    res.render("usuarios/registro")
                                }
                                novoUsuario.senha = hash;

                                novoUsuario.save().then(() => {
                                    req.flash("success_msg", "Cadastrado com Sucesso!")
                                    res.redirect("/")
                                }).catch((error) => {
                                    req.flash("error_msg", "Erro ao cadastrar! Tente novamente!")
                                    res.render("usuarios/resgistro")
                                })
                            })
                        })
                    }
                }).catch((erro) => {
                    req.flash("error_msg", "Erro interno!");
                    return res.redirect("/usuario/registro");
                });
            } else {
                console.log('E-mail não existe.');
                req.flash("error_msg", "Esse e-mail não é real! Cadastre um e-mail válido.");
                return res.redirect("/usuario/registro");
            }
        });
    }
});

router.post("/addAdmin/novo", (req, res) => {
    var erros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido!" })
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: "Email inválido!" })
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: "Senha inválida!" })
    }
    if (req.body.senha.length < 4) {
        erros.push({ texto: "Senha muito curta!" })

    }
    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: "Senha diferentes! " })
    }

    if (erros.length > 0) {
        res.render("admin/addAdmin", { erros: erros })
    } else {
        Usuario.findOne({ email: req.body.email }).lean().then((usuario) => {
            if (usuario) {
                console.log("email ja cadastrado")
                req.flash("error_msg", "Email já cadastrado! Faça o login.")
                res.redirect("/admin/addAdmin")
            } else {
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    eAdmin: 1
                })
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Erro ao enviar cadastro do usuario")
                            res.render("admin/addAdmin")
                        }
                        novoUsuario.senha = hash;

                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Cadastrado com Sucesso!")
                            res.redirect("/")
                        }).catch((error) => {
                            req.flash("error_msg", "Erro ao cadastrar! Tente novamente!")
                            res.render("admin/addAdmin")
                        })
                    })
                })
            }
        }).catch((erro) => {
            req.flash("error_msg", "Erro Interno!")
        })
    }
})

router.post("/login",
    passport.authenticate('local',
        {
            successFlash: "/",
            failureRedirect: '/usuario/login',
            failureMessage: true,
            failureFlash: true
        }),
    function (req, res, next) {
        res.redirect('/');
    })
    router.post("/emailRecSenha", (req, res) => {
        Usuario.findOne({ email: req.body.email }).then((usuario) => {
            if (!usuario) {
                req.flash("error_msg", "E-mail não cadastrado! Faça seu cadastro.")
                return res.redirect("/usuario/login");
            } else {
                const novoToken = (Math.random() + 1).toString(36).substring(7);
    
                transport.sendMail({
                    from: "Blog Nodejs <giovanni.ofice@hotmail.com>",
                    to: usuario.email,
                    subject: "RECUPERAÇÃO DE SENHA BLOG NODEJS",
                    html: `<h1>Recuperação de Senha</h1>
                    <form action="http://54.207.20.29:3000/usuario/resetSenha" method="post">
                    <input type="hidden" name="token" value="${novoToken}">
                    <h4>Nova senha:</h4>
                    <input type="password" name="novasenha" id="">
                    <h4>Repita a senha:</h4>
                    <input type="password" name="novasenha2" id="">
                    <button type="submit">Salvar</button>
                    </form>`,
                    text: "Não foi o html"
                }).then(() => {
                    console.log("E-mail enviado com sucesso!");
                    usuario.token = novoToken;
                    usuario.save().then(() => {
                        console.log("Token ok!");
                    });
                    req.flash("success_msg", "E-mail de recuperação enviado!");
                    res.redirect("/usuario/login");
                }).catch((erro) => {
                    req.flash("error_msg", "Erro ao enviar e-mail de recuperação!");
                    console.error(erro);
                    res.redirect("/usuario/login");
                });
            }
        });
    });
    
    router.post("/resetSenha", (req, res) => {
        const { token, novasenha, novasenha2 } = req.body;
    
        Usuario.findOne({ token }).then((usuario) => {
            if (!usuario) {
                req.flash("error_msg", "Token inválido ou expirado!");
                return res.redirect("/usuario/login");
            }
    
            if (novasenha !== novasenha2) {
                req.flash("error_msg", "As senhas não coincidem!");
                return res.redirect(`/usuario/resetSenha?token=${token}`);
            }
    
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(novasenha, salt, (err, hash) => {
                    if (err) throw err;
                    usuario.senha = hash;
                    usuario.token = undefined;
                    usuario.save().then(() => {
                        req.flash("success_msg", "Senha alterada com sucesso!");
                        res.redirect("/usuario/login");
                    }).catch((err) => {
                        req.flash("error_msg", "Erro ao salvar a nova senha!");
                        console.error(err);
                        res.redirect("/usuario/login");
                    });
                });
            });
        });
    });

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        req.flash("success_msg", "Deslogado!")
        res.redirect("/")
    })
})
module.exports = router