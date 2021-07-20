const Mongoose = require("mongoose"), Admin = Mongoose.mongo.Admin;
const moment = require('moment');
moment.locale('pt-br');
var request = require('request');


const ServerSympla = "https://api.sympla.com.br";
const TokenSympla = "975212475d56ccf9c07561227bb435e01f2bd93009a7197dd3cf1d26c4fe44d1";


module.exports = (function() {


    'use strict';
    var router = require('express').Router();

    // console.log('passou', moment().format('YYYYMMDDHHmmss'));











//ListaEventos
router.get('/ListaEventos', function (req, res) {

    var options = {
      'method': 'GET',
      'url': ServerSympla+'/public/v3/events',
      'headers': {
        'Content-Type': 'application/json',
        's_token': TokenSympla
      }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        // console.log(response.body);

        res.json(JSON.parse(response.body));

        // res.write( response.body );
        res.end();
    });

});








//PegaEvento
router.get('/PegaEvento/:id', function (req, res) {

    var options = {
      'method': 'GET',
      'url': ServerSympla+'/public/v3/events/' + req.params.id,
      'headers': {
        'Content-Type': 'application/json',
        's_token': TokenSympla
      }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        // console.log(response.body);

        res.json(JSON.parse(response.body));

        // res.write( response.body );
        res.end();
    });

});








//ParticipantesEvento
router.get('/ParticipantesEvento/:id', function (req, res) {

    var options = {
      'method': 'GET',
      'url': ServerSympla+'/public/v3/events/'+req.params.id+'/participants',
      'headers': {
        'Content-Type': 'application/json',
        's_token': TokenSympla
      }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
         // console.log(response.body);

         res.json(JSON.parse(response.body));

        // res.write( response.body );
        res.end();
    });

});
















    //***** Login
    router.post('/Login', async (req, res, next) => {

        var c_login = req.body.c_login.toLowerCase();
        var c_senha = req.body.c_senha;

//        conn.query("SELECT * from tb_usuario where c_email = '" + c_login + "'", function (err, result) {
//            if (err) throw err;
//
//            if (result.length > 0) {            
//                console.log('Usuário Encontrado: ' + result[0].c_nome);
//                if(c_senha == result[0].c_senha){
//                    res.json([result]);
//                    res.end();
//                } else {
//                    res.json(null);
//                    res.end();
//                }
//            } else {
//                console.log('Usuário não encontrado');
//                res.json(null);
//                res.end();
//            }
//
//        });
    });





    //***** EditConfig
    router.post('/EditConfig', async (req, res, next) => {

//        var c_hashtag = req.body.c_hashtag;
//        var c_cor_fundo = req.body.c_cor_fundo;
//        var c_cor_nome = req.body.c_cor_nome;
//        var c_cor_texto = req.body.c_cor_texto;
//
//        conn.query(
//            "UPDATE tb_config SET c_hashtag = '"+ c_hashtag +"', c_cor_fundo = '"+ c_cor_fundo +"', c_cor_nome = '"+ c_cor_nome +"', c_cor_texto = '"+ c_cor_texto +"' where id_tb_config = 1",
//            function (err, result) {
//
//            if (err) throw err;
//            res.json({ message: "OK" });
//            res.end();
//
//        });

    });





    //***** Config
    router.get('/Config', async (req, res, next) => {

    //    conn.query("SELECT * from tb_config where id_tb_config = 1", function (err, result) {
    //        if (err) throw err;
    //        res.json({
    //            c_hashtag: result[0].c_hashtag,
    //            c_cor_fundo: result[0].c_cor_fundo,
    //            c_cor_texto: result[0].c_cor_texto,
    //            c_cor_nome: result[0].c_cor_nome,
    //        });
    //        res.end();
    //    });

    });





    return router;

})();