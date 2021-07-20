const Mongoose = require("mongoose"), Admin = Mongoose.mongo.Admin;
const moment = require('moment');
const mysql = require('mysql');
moment.locale('pt-br');

module.exports = (function() {

    const conn = mysql.createConnection({
        host: "45.128.61.162",
        user: "root",
        password: "sqt5cog_w7zmow2r",
        database: "TwitterLab3",
        charset: 'utf8mb4'
    });

    'use strict';
    var router = require('express').Router();

    // console.log('passou', moment().format('YYYYMMDDHHmmss'));





    //***** Login
    router.post('/Login', async (req, res, next) => {

        var c_login = req.body.c_login.toLowerCase();
        var c_senha = req.body.c_senha;

        conn.query("SELECT * from tb_usuario where c_email = '" + c_login + "'", function (err, result) {
            if (err) throw err;

            if (result.length > 0) {            
                console.log('Usuário Encontrado: ' + result[0].c_nome);
                if(c_senha == result[0].c_senha){
                    res.json([result]);
                    res.end();
                } else {
                    res.json(null);
                    res.end();
                }
            } else {
                console.log('Usuário não encontrado');
                res.json(null);
                res.end();
            }

        });            
    });





    //***** EditConfig
    router.post('/EditConfig', async (req, res, next) => {

        var c_hashtag = req.body.c_hashtag;
        var c_cor_fundo = req.body.c_cor_fundo;
        var c_cor_nome = req.body.c_cor_nome;
        var c_cor_texto = req.body.c_cor_texto;

        conn.query(
            "UPDATE tb_config SET c_hashtag = '"+ c_hashtag +"', c_cor_fundo = '"+ c_cor_fundo +"', c_cor_nome = '"+ c_cor_nome +"', c_cor_texto = '"+ c_cor_texto +"' where id_tb_config = 1",
            function (err, result) {

            if (err) throw err;
            res.json({ message: "OK" });
            res.end();

        });
    });





    //***** Config
    router.get('/Config', async (req, res, next) => {

        conn.query("SELECT * from tb_config where id_tb_config = 1", function (err, result) {
            if (err) throw err;
            res.json({
                c_hashtag: result[0].c_hashtag,
                c_cor_fundo: result[0].c_cor_fundo,
                c_cor_texto: result[0].c_cor_texto,
                c_cor_nome: result[0].c_cor_nome,
            });
            res.end();
        });

    });





    return router;

})();