const Mongoose = require("mongoose"), Admin = Mongoose.mongo.Admin;
var express = require('express');
var app = express();
const bodyParser = require("body-parser");
var fs = require('fs');
var request = require('request');
const cors = require("cors");
const moment = require('moment');
moment.locale('pt-br');
var Funcoes = require('./funcoes');

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

var corsOptions = { origin: "*" };

var whitelist = [
  'http://192.168.1.90:3000',
  'http://localhost:3000',
  'https://webaovivo.com.br',
  'https://www.webaovivo.com.br',
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

//app.options('*', cors());
app.use(cors(corsOptions));

var options = { 
	key: fs.readFileSync('privkey.pem'),
	cert: fs.readFileSync('cert.pem'),
	ca: fs.readFileSync('chain.pem')
};


var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('privkey.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

const sPORT = process.env.PORT || 3020;
const PORT = process.env.PORT || 3021;
httpsServer.listen(sPORT, () => { console.log(`Server is running on port ${sPORT}.`); });
httpServer.listen(PORT, () => { console.log(`Server is running on port ${PORT}.`); });

var Twit = require('twit');
const { Script } = require("vm");
var io = require('socket.io').listen(httpsServer);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// app.use('/', require('./rotas'));




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



const ServerSympla = "https://api.sympla.com.br";
const TokenSympla = "975212475d56ccf9c07561227bb435e01f2bd93009a7197dd3cf1d26c4fe44d1";






//ListaEventos
app.get('/ListaEventos', function (req, res) {


    var options = {
      'method': 'GET',
      'url': ServerSympla + '/public/v3/events',
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








//ListaEvento
app.get('/ListaEvento/:id', function (req, res) {

    var options = {
      'method': 'GET',
      'url': ServerSympla + '/public/v3/events/' + req.params.id,
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








//VerificaPedidoPago
app.get('/VerificaPedidoPago/:IdEvento/:IdPedido', function (req, res) {

    var options = {
      'method': 'GET',
      'url': ServerSympla + '/public/v3/events/' + req.params.IdEvento + '/orders/' + req.params.IdPedido,
      'headers': {
        'Content-Type': 'application/json',
        's_token': TokenSympla
      }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        // console.log(response.body);


        var val = JSON.parse(response.body).data;
        res.json(val);

      //  if(val.order_status == "A"){
      //    res.json("ok");
      //  } else {
      //    res.json("nao");
      //  }

        // res.write( response.body );
        res.end();
    });

});








//ParticipantesEvento
app.get('/ParticipantesEvento/:id', function (req, res) {

    var options = {
      'method': 'GET',
      'url': ServerSympla + '/public/v3/events/'+req.params.id+'/participants',
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








//ListarPedidos
app.get('/ListarPedidos/:id', function (req, res) {

    var options = {
      'method': 'GET',
      'url': ServerSympla + '/public/v3/events/'+req.params.id+'/orders',
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








//PegaDadosEvento
app.get('/PegaDadosEvento/:pathname', async (req, res, next) => {
//app.get('/PegaDadosEvento/:pathname', function (req, res) {

    var tb_evento = conn.collection('tb_evento');
    var c_pathname = req.params.pathname.toLowerCase();

    // console.log(c_pathname);



    var filtro = {c_url: c_pathname};
    await tb_evento.findOne(filtro, {}, function(err, result) {
        if (err) throw err;

        if (result) {

            var options = {
              'method': 'GET',
              'url': ServerSympla + '/public/v3/events/' + result.id_sympla,
              'headers': {
                'Content-Type': 'application/json',
                's_token': TokenSympla
              }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                // console.log(response.body);
                // res.json(JSON.parse(response.body));
                // res.write( response.body );
                // res.end();

                console.log('Evento Encontrado: ' + result.c_nome + ' - ' + result.id_sympla + ' - ' + result.c_url);
                res.json([
                    result,
                    JSON.parse(response.body)
                ]);
                res.end();                
            });
                
        } else {

            console.log('Evento não encontrado');
            res.json(null);
            res.end();

        }

    }); 
    

    //res.json({teste: 'xxxxxxxx'});
    //res.write( 'xxxx1111x' + req.params.pathname );
    //res.end();

});








//AcessoEvento
app.post('/AcessoEvento/:IdEvento/:IdIngresso', async (req, res, next) => {

    var tb_acesso = conn.collection('tb_acesso');
    var IdEvento = req.params.IdEvento;
    var IdIngresso = req.params.IdIngresso;

    console.log(IdEvento, IdIngresso);

    var optionsGet = {
      'method': 'GET',
      'url': ServerSympla + '/public/v3/events/' + IdEvento + '/participants/ticketNumber/' + IdIngresso,
      'headers': {
        'Content-Type': 'application/json',
        's_token': TokenSympla
      }
    };

    request(optionsGet, function (error, response) {  
        if (error) throw new Error(error);

        var c_ip = '123.456.789.000';
        var val = JSON.parse(response.body).data;
        var timestamp = moment().toDate().getTime();
        console.log('Aqui:', val.id);

        res.json([
            JSON.parse(response.body),
        ]);
        
        if(val.id == undefined){

          console.log('Passou undefined:', val.id);
          
        } else {

          console.log('Passou insert:', val.id);

          var optionsPost = {
            'method': 'POST',
            'url': ServerSympla + '/public/v3/events/' + IdEvento + '/participants/ticketNumber/' + IdIngresso + '/checkIn',
            'headers': {
              'Content-Type': 'application/json',
              's_token': TokenSympla
            }
          };

          request(optionsPost, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
          });

          tb_acesso.insertOne({
            c_nome: val.first_name + ' ' + val.last_name,
            c_email: val.email,
            c_evento: IdEvento,
            c_ingresso_numero: val.ticket_number,
            // c_ingresso_qrcode: val.ticket_num_qr_code,
            // c_ingresso_nome: val.ticket_name,
            c_data_hora: Funcoes.DataHoraFormatada(timestamp),
            c_data: Funcoes.DataCompletaInvertida(timestamp),
            c_ip: c_ip,
          });

        }

    });

    //res.json({teste: 'xxxxxxxx'});
    //res.write( IdEvento + ' - ' + IdIngresso );
    //res.end();

});

















app.get('/clientes', verifyJWT, (req, res, next) => { 
  console.log("Retornou todos clientes!");
  res.json([{id:1,nome:'luiz'}]);
});

//rota de logout
app.post('/logout', function(req, res) {
    console.log("Fez logout e cancelou o token!");
    res.status(200).send({ auth: false, token: null }); 
});

/*
function verifyJWT(req, res, next){
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    
    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}
*/

//função que verifica se o JWT é ok
function verifyJWT(req, res, next){ 
  var token = req.headers['x-access-token'];
  if (!token) 
      return res.status(401).send({ auth: false, message: 'Token não informado.' }); 
  
  var publicKey  = fs.readFileSync('./public.key', 'utf8');
  jwt.verify(token, publicKey, {algorithm: ["RS256"]}, function(err, decoded) { 
      if (err) 
          return res.status(500).send({ auth: false, message: 'Token inválido.' }); 
      
      req.userId = decoded.IdIngresso; 
      console.log("User Id: " + decoded.IdIngresso)
      next(); 
  }); 
}





//Sockets.io connection
io.sockets.on('connection', function (client) {

    const QntConectado = Object.keys(io.sockets.connected).length;

    console.log('Entrou: ' + client.id, 'Total:', QntConectado);

    client.on('disconnect', function(){
        console.log('Saiu: ' + client.id, 'Total:', QntConectado);
        io.emit("Teste", 'TestSocketx' + QntConectado);
    });

    client.on("EnviaHash", function(data){
        console.log('EnviaHash: ' + data, client.id );
    });

    client.on("VerificaOutros", function(data){
        console.log('VerificaOutros: ' + data.IdIngresso + ' - ' + data.LogadoToken );
        io.emit("VerificaLogado", data);
    });

    client.on("Testexxx", function(data){
        console.log('Testexxx: ' + data, client.id );
    });



    const { roomId } = client.handshake.query;
    client.join(roomId);
    console.log('roomId', roomId);





    /*
    client.on("VerificaLogado", function(data){
      let ListaConfig = JSON.stringify({
        c_ingresso: IdIngresso,
        c_evento: IdEvento,
        c_token: token
      });
      io.emit("VerificaLogado", ListaConfig);
    });
    */













    //authentication
    app.post('/Login/:IdEvento', async (req, res, next) => {

      var tb_evento = conn.collection('tb_evento');
      var tb_acesso = conn.collection('tb_acesso');
      var IdEvento = req.params.IdEvento;
      var IdIngresso = req.body.c_login;
      var IpClient = req.body.c_ip;
      console.log(IdIngresso);





      await tb_acesso.findOne({c_ingresso: IdIngresso}, {}, function(err, result) {
          if (err) throw err;

          if (result) {          
              console.log('Usuário Encontrado: ' + result.c_nome + ' - ' + result.c_email);




                  var optionsGet = {
                    'method': 'GET',
                    'url': ServerSympla + '/public/v3/events/' + IdEvento + '/participants/ticketNumber/' + IdIngresso,
                    'headers': {
                      'Content-Type': 'application/json',
                      's_token': TokenSympla
                    }
                  };
            
                  request(optionsGet, function (error, response) {
                      if (error) throw new Error(error);
            
                      var val = JSON.parse(response.body).data;
                      var timestamp = moment().toDate().getTime();
                      //console.log('Aqui:', val);
                      const DadosIngresso = val;
            
            
            
            
                      var VerificaPedidoPago = {
                        'method': 'GET',
                        'url': ServerSympla + '/public/v3/events/' + IdEvento + '/orders/' + val.order_id,
                        'headers': {
                          'Content-Type': 'application/json',
                          's_token': TokenSympla
                        }
                      };
            
            
            
            
                      request(VerificaPedidoPago, function (error, response) {
                        if (error) throw new Error(error);
                        //console.log(response.body);
                
                
                        var val = JSON.parse(response.body).data;
                        //res.json(val);
                        
                
                        if(val.order_status == "A"){
                          
            
                          if(val.id == undefined){
            
                            console.log('Passou undefined:', val.id);
                            
                          } else {
            
                            console.log('Passou insert:', val.id);
            
                            var optionsPost = {
                              'method': 'POST',
                              'url': ServerSympla + '/public/v3/events/' + IdEvento + '/participants/ticketNumber/' + IdIngresso + '/checkIn',
                              'headers': {
                                'Content-Type': 'application/json',
                                's_token': TokenSympla
                              }
                            };
            
                            request(optionsPost, function (error, response) {
                              if (error) throw new Error(error);
                              console.log('asdfasdfasdf', response.body);
                            });
            
            
                            //esse teste abaixo deve ser feito no seu banco de dados
                            //if(req.body.user === 'luiz' && req.body.password === '123'){
                            if(IdIngresso === DadosIngresso.ticket_number){

                              const privateKey  = fs.readFileSync('./private.key', 'utf8');
                              const token = jwt.sign({ IdIngresso, IdEvento, timestamp }, privateKey, { 
                                  expiresIn: 86400, // 24horas 
                                  algorithm:  "RS256" //SHA-256 hash signature
                              });
                              console.log(token);



                                tb_evento.findOne({id_sympla: parseInt(IdEvento)}, {}, function(err, result) {
                                if (err) throw err;
                                  if (result) {
                                    console.log('tb_evento', result._id);
                                    console.log('tb_evento', result.c_nome);

                                    const testexxx = result._id;

                                    tb_acesso.insertOne({
                                      c_logado: 1,
                                      c_nome: DadosIngresso.first_name + ' ' + DadosIngresso.last_name,
                                      c_email: DadosIngresso.email,
                                      c_evento: IdEvento,
                                      c_nome_evento: result.c_nome,
                                      c_id_evento: result._id,
                                      c_ingresso: DadosIngresso.ticket_number,
                                      // c_ingresso_qrcode: val.ticket_num_qr_code,
                                      // c_ingresso_nome: val.ticket_name,
                                      c_data_hora: Funcoes.DataHoraFormatada(timestamp),
                                      c_data: Funcoes.DataCompletaInvertida(timestamp),
                                      c_ip: IpClient,
                                      token: token
                                    });

                                    TesteFunc('ID: ', result._id)
                                  }
                              });


                              function TesteFunc (id){
                                console.log(id);
                              } 


                              let ListaConfig = JSON.stringify({
                                c_ingresso: IdIngresso,
                                c_evento: IdEvento,
                                c_token: token
                              });

                               io.emit("VerificaLogado", ListaConfig);
                               console.log(['VerificaLogado'], IdIngresso, IdEvento)
            
                              return res.json({
                                auth: true,
                                token: token,
                                id_tb_evento: '112131233',
                                IdEvento: IdEvento,
                                IdIngresso: DadosIngresso.ticket_number,
                                DadosPedido: JSON.parse(response.body).data,
                                DadosIngresso: DadosIngresso
                              });

                            }
                            
                            res.status(500).json({
                              auth: false,
                              message: 'Login inválido!'
                            });
            
            
                          }
            
            
            
                        } else {
                          
                          return res.json({
                            auth: false,
                            message: 'Login inválido!'
                          });
            
                        }
            
                
                        // res.write( response.body );
                        //res.end();
                      });
            
            
            
                  });
        



            } else {

              
              console.log('Usuário não encontrado');

                  var optionsGet = {
                    'method': 'GET',
                    'url': ServerSympla + '/public/v3/events/' + IdEvento + '/participants/ticketNumber/' + IdIngresso,
                    'headers': {
                      'Content-Type': 'application/json',
                      's_token': TokenSympla
                    }
                  };
            
                  request(optionsGet, function (error, response) {
                      if (error) throw new Error(error);
            
                      var val = JSON.parse(response.body).data;
                      var timestamp = moment().toDate().getTime();
                      //console.log('Aqui:', val);
                      const DadosIngresso = val;
            
            
            
            
                      var VerificaPedidoPago = {
                        'method': 'GET',
                        'url': ServerSympla + '/public/v3/events/' + IdEvento + '/orders/' + val.order_id,
                        'headers': {
                          'Content-Type': 'application/json',
                          's_token': TokenSympla
                        }
                      };
            
            
            
            
                      request(VerificaPedidoPago, function (error, response) {
                        if (error) throw new Error(error);
                        //console.log(response.body);
                
                
                        var val = JSON.parse(response.body).data;
                        //res.json(val);
                        
                
                        if(val.order_status == "A"){
                          
            
                          if(val.id == undefined){
            
                            console.log('Passou undefined:', val.id);
                            
                          } else {
            
                            console.log('Passou insert:', val.id);
            
                            var optionsPost = {
                              'method': 'POST',
                              'url': ServerSympla + '/public/v3/events/' + IdEvento + '/participants/ticketNumber/' + IdIngresso + '/checkIn',
                              'headers': {
                                'Content-Type': 'application/json',
                                's_token': TokenSympla
                              }
                            };
            
                            request(optionsPost, function (error, response) {
                              if (error) throw new Error(error);
                              console.log('asdfasdfasdf', response.body);
                            });
            
            
                            //esse teste abaixo deve ser feito no seu banco de dados
                            //if(req.body.user === 'luiz' && req.body.password === '123'){
                            if(IdIngresso === DadosIngresso.ticket_number){

                              const privateKey  = fs.readFileSync('./private.key', 'utf8');
                              const token = jwt.sign({ IdIngresso, IdEvento, timestamp }, privateKey, { 
                                  expiresIn: 86400, // 24horas 
                                  algorithm:  "RS256" //SHA-256 hash signature
                              });
                              


                              tb_evento.findOne({id_sympla: parseInt(IdEvento)}, {}, function(err, result) {
                                if (err) throw err;
                                  if (result) {
                                    console.log('tb_evento', result._id);
                                    console.log('tb_evento', result.c_nome);

                                    tb_acesso.insertOne({
                                      c_logado: 0,
                                      c_nome: DadosIngresso.first_name + ' ' + DadosIngresso.last_name,
                                      c_email: DadosIngresso.email,
                                      c_evento: IdEvento,
                                      c_nome_evento: result.c_nome,
                                      c_id_evento: result._id,
                                      c_ingresso: DadosIngresso.ticket_number,
                                      // c_ingresso_qrcode: val.ticket_num_qr_code,
                                      // c_ingresso_nome: val.ticket_name,
                                      c_data_hora: Funcoes.DataHoraFormatada(timestamp),
                                      c_data: Funcoes.DataCompletaInvertida(timestamp),
                                      c_ip: IpClient,
                                      token: token
                                    });
                                }
                              });

                              
                              return res.json({
                                auth: true,
                                token: token,
                                id_tb_evento: '112131233',
                                IdEvento: IdEvento,
                                IdIngresso: DadosIngresso.ticket_number,
                                DadosPedido: JSON.parse(response.body).data,
                                DadosIngresso: DadosIngresso
                              });
                            }
                            
                            res.status(500).json({
                              auth: false,
                              message: 'Login inválido!'
                            });
            
            
                          }
            
            
            
                        } else {
                          
                          return res.json({
                            auth: false,
                            message: 'Login inválido!'
                          });
            
                        }
            
                
                        // res.write( response.body );
                        //res.end();
                      });
            
            
            
                  });
        


            }

      }); 






    });





    








  //VerificaUltimoLogin
  app.post('/VerificaUltimoLogin/:IdEvento/:IdIngresso', async (req, res, next) => {

        var tb_acesso = conn.collection('tb_acesso');
        var IdEvento = req.params.IdEvento;
        var IdIngresso = req.params.IdIngresso;

        await tb_acesso.find({c_evento: IdEvento, c_ingresso: IdIngresso}, {sort: {c_data: -1}, limit: 1}).toArray(function(err, result) {
          // console.log(result);
          return res.send(result);
        });
    
  });









});
