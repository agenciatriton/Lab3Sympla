const express = require("express");
const Mongoose = require("mongoose"), Admin = Mongoose.mongo.Admin;
const app = express();
const moment = require('moment');
moment.locale('pt-br');
const port = 3030;
const cors = require("cors");
var fs = require('fs');
var path = require('path');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var Funcoes = require('./funcoes');

app.use(bodyParser.json());

//WEBAOVIVO
var HostMongo = "45.128.61.162";
var PortMongo = "27017";
var UserAdmin = "AdminAGT";
var PassAdmin = "Angel%40098";
var PassAdmin1 = "Angel@098"; 

Mongoose.connect(`mongodb://${UserAdmin}:${PassAdmin}@${HostMongo}:${PortMongo}`, {
  useNewUrlParser: true,  useUnifiedTopology: true,
  user: UserAdmin, 
  pass: PassAdmin1,
  dbName: 'Lab3Sympla',
});

var router = require('express').Router();   
var conn = Mongoose.connection;

conn.on('open', function() {
  app.set('db', conn);
  Mongoose.connection.db.listCollections().toArray(function (err, names) {
    // console.log(names); // [{ name: 'dbname.myCollection' }]
    module.exports.Collection = names;
  });
});

conn.on('connected',()=>{
  console.log('MongoDB connected');
});

conn.on('error',(err)=>{
  if(err)
  console.log(err)
});










var corsOptions = { origin: "*" };
var whitelist = [
  'http://192.168.1.90:3000',
  'http://localhost:3000',
  'https://webaovivo.com.br',
  'https://www.webaovivo.com.br',
  'https://livespace.com.br',
  'https://www.livespace.com.br',
  'http://192.168.1.90:8080',
]
var corsOptionsx = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}




app.use(cors(corsOptions));

var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('privkey.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

const sPORT = process.env.PORT || 3030;
httpsServer.listen(sPORT, () => { console.log(`Server is running on port ${sPORT}.`); });

// const PORT = process.env.PORT || 3030;
// httpServer.listen(PORT, () => { console.log(`Server is running on port ${PORT}.`); });




const server = require("http").createServer(app);
const io = require("socket.io").listen(httpsServer);





io.on('connection', function (socket) {
//io.on("connection", socket => {

  const { roomId } = socket.handshake.query;
  socket.join(roomId);
  console.log('roomId', roomId);
  //console.log('Number of clientsxx',io.sockets.clients("600892294c803e0e144b52a2"));
  //console.log('Number of clients',io.sockets.adapter.rooms.get(roomId).size);
  //const QntConectado = io.sockets.clients('600892294c803e0e144b52a2').length;
  //console.log('Number of clients', QntConectado);





  app.get('/Conectados/:IdEvento', async (req, res, next) => {

    var IdEvento = req.params.IdEvento;

    io.of('/').in(IdEvento).clients(function(error,clients){
      var numClients=clients.length;
      console.log('Number of clients', IdEvento, ' - ', numClients);
      return res.json({
        roomId: IdEvento,
        c_conectados: numClients,
        c_conectados_pico: numClients
      });
    });

  });


  




  socket.on('entra_chat', function (data) {
    //console.log('passou', roomId);
    io.to(roomId).emit('entra_chat', data);
  });





  socket.on("CarregaChat", data => {

      io.to(roomId).emit('CarregaChat', {
        id_tb_user: 'testexxxx',
        c_nome: 'Rafaelxxx',
        msg: 'Teste de msgxxx'
      });

  });




  






  socket.on("EnviaPergunta", data => {

    var timestamp = moment().toDate().getTime();
    conn.collection('tb_pergunta').insertOne({
      id_tb_evento: Mongoose.Types.ObjectId(data.id_tb_evento),
      id_sympla: data.id_sympla,
      c_ingresso:data.c_ingresso,
      c_nome:data.c_nome,
      c_email:data.c_email,
      c_pergunta:data.c_pergunta, 
      c_data_hora: Funcoes.DataHoraFormatada(timestamp),
      c_data: Funcoes.DataCompletaInvertida(timestamp),
      c_status: 0,
      c_nome_evento: data.c_nome_evento
    },function(err, resultado) {
    });

  });





  socket.on("chat message", data => {

    //console.log(data);


    var timestamp = moment().toDate().getTime();
    const options = {
      // weekday: "short",
      year: "numeric",
      month:"2-digit",
      day:"2-digit",
      hour: '2-digit', 
      minute:'2-digit',
      second:'2-digit'
    }

    let datex = new Date();
    const p_data_final = datex.toLocaleTimeString("pt-br", options);

    //console.log(p_data_final);
    let p_hora = p_data_final.substring(11, 13)+p_data_final.substring(14, 16)+p_data_final.substring(17, 19);
    let p_data = p_data_final.toString().substring(6, 10)+p_data_final.toString().substring(3, 5)+p_data_final.toString().substring(0, 2);

    //let id_other = JSON.parse(data).id_other;
    //let p_nome = JSON.parse(data).c_nome;
    // console.log(data.c_nome, data.msg);







    if(data.action === 'Excluir') {
      
      console.log('excluir msg', data.IdMsgDel);

      conn.collection('tb_chat').updateOne({_id: Mongoose.Types.ObjectId(data.IdMsgDel)},{$set:{c_visivel:0}}, function(err, resultado) {
        if (err) throw err;
        // console.log('ExcluirMsgChat');
        io.to(roomId).emit('ExcluirMsgChat', data.IdMsgDel);
      }) 

    } else {

      console.log(data.c_nome, [data.msg]);
      conn.collection('tb_chat').insertOne({
        id_tb_evento: Mongoose.Types.ObjectId(data.id_tb_evento),
        id_sympla: data.id_sympla,
        c_ingresso:data.c_ingresso,
        c_nome:data.c_nome,
        c_email:data.c_email,
        msg:data.msg, 
        c_data_hora: Funcoes.DataHoraFormatada(timestamp),
        c_data: Funcoes.DataCompletaInvertida(timestamp),
        c_visivel: 1
      },function(err, resultado) {
        if (err) throw err;
        var id = resultado.insertedId;
        arraydata = data;
        arraydata.c_data = p_data+p_hora;
        arraydata.id = id;
        arraydata._id = id;
        arraydata.c_email = data.c_email;
        //io.to(roomId).emit('chat message', JSON.stringify(arraydata));
        io.to(roomId).emit('chat message', arraydata);
      });

    }






  });



    
});

//server.listen(port, () => console.log("server running on port:" + port));