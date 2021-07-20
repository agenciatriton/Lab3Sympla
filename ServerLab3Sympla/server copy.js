var express = require('express');
var app = express();
const bodyParser = require("body-parser");
var fs = require('fs');
const mysql = require('mysql');
const cors = require("cors");


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

const conn = mysql.createConnection({
    host: "45.128.61.162",
    user: "root",
    password: "sqt5cog_w7zmow2r",
    database: "TwitterLab3",
    charset: 'utf8mb4'
});

var config = require('./config_twitter.js'); // require the configurations

//var https = require('https');
//var server = https.createServer(options, app);

// server.listen(8000, function() {
//   console.log("The server is running.");
// });




var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('privkey.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

const sPORT = process.env.PORT || 2020;
const PORT = process.env.PORT || 2021;
httpsServer.listen(sPORT, () => { console.log(`Server is running on port ${sPORT}.`); });
httpServer.listen(PORT, () => { console.log(`Server is running on port ${PORT}.`); });

var Twit = require('twit');
var io = require('socket.io').listen(httpServer);

//const io = require('socket.io')(8082);







/*
var http = require('http');
// var https = require('https');
var server = http.createServer(app);
//var server = https.createServer(options, app);
var io = require('socket.io').listen(server);  

server.listen(8000, function() {
  console.log("The server is running.");
});
*/






app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// You won't need the index.html. THis is built so you can see the Tweet stream as it updates
//thanks to Socket.io
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});



/*
app.get('/Loginx', function (req, res) {
    res.write("xxxxx" + "1");
    res.end();
});
*/


app.use('/', require('./rotas/login'));
























// Twitter API credentials
var T = new Twit(config);

//var HashTag = '#BlackLivesMatter';
var HashTag = 'Corinthians';
//var HashTag = 'TitasNoTeatroBradesco, TeatroBradescoNoYoutube, TitãsNoTeatroBradesco';
//var HashTag = 'Corinthians, ArenaCorinthians';
//var HashTag = 'LivedosSonhos';
var CorBg = '#483d8b';
var CorNome = '#CCCCCC';
var CorTexto = '#FFFFFF';

//Sockets.io connection
io.sockets.on('connection', function (client) {

    console.log('connectx');

    client.on("DefineCores", function(data){
        console.log('passou DefinirCores' + data);
        io.sockets.emit("DefinirCores", data);
    });

   let ListaCores = JSON.stringify({
        CorBg: CorBg,
        CorNome: CorNome,
        CorTexto: CorTexto
    })

    io.sockets.emit("DefinirCores", ListaCores);

    client.on("recebe_resposta1", function(tipo, id, page){

        if(tipo == 'sair'){

                    conn.query("UPDATE tb_twitter SET status=2 where id_tb_twitter = "+id, function (err, result) {
                    if (err) throw err;
                        console.log(result.affectedRows + " record(s) updated - SAIR TV", page);
                        io.sockets.emit("tipo1", page);
                        io.sockets.emit("resposta1", 'saiu');
                        io.sockets.emit("busca_mais", '9999999');
                    });


        } else if(tipo == 'entrar') {



                        conn.query("UPDATE tb_twitter SET status=1 where id_tb_twitter = "+id, function (err, result) {
                            if (err) throw err;
                    
                            console.log(result.affectedRows + " record(s) updated - ENTRAR TV", page);
                            
                            conn.query("Select * from tb_twitter where id_tb_twitter = "+id, function (err, result) {
                            //if (err) throw err;
                            //console.log("Result: " + result.length+'fdasfd');
                            //client.emit("inital_datax", result);
                                if(result.length > 0){
                                    console.log('result', result)
                                    io.sockets.emit("tipo1", page);
                                    io.sockets.emit("resposta1", result);
                                    io.sockets.emit("busca_mais", '9999999');
                                }
                                
                            });   
                    });


            
        }

    });














    client.on("recebe_resposta2", function(tipo, id, page){

        if(tipo == 'sair'){

                    conn.query("UPDATE tb_twitter SET status=2 where id_tb_twitter = "+id, function (err, result) {
                    if (err) throw err;
                        console.log(result.affectedRows + " record(s) updated - SAIR TV", page);
                        io.sockets.emit("tipo2", page);
                        io.sockets.emit("resposta2", 'saiu');
                        io.sockets.emit("busca_mais", '9999999');
                    });


        } else if(tipo == 'entrar') {



                        conn.query("UPDATE tb_twitter SET status=1 where id_tb_twitter = "+id, function (err, result) {
                            if (err) throw err;
                    
                            console.log(result.affectedRows + " record(s) updated - ENTRAR TV", page);
                            
                            conn.query("Select * from tb_twitter where id_tb_twitter = "+id, function (err, result) {
                            //if (err) throw err;
                            //console.log("Result: " + result.length+'fdasfd');
                            //client.emit("inital_datax", result);
                                if(result.length > 0){
                                    console.log('result', result)
                                    io.sockets.emit("tipo2", page);
                                    io.sockets.emit("resposta2", result);
                                    io.sockets.emit("busca_mais", '9999999');
                                }
                                
                            });   
                    });


            
        }

    });





    function Envia(dados){
       // io.sockets.emit('envia_resposta', dados);   
        //socket.broadcast.emit('envia_resposta',data); 
    }

  
}); 




var stream = T.stream('statuses/filter', { track: HashTag, tweet_mode:'extended' }); 

stream.on('tweet', function (tweet) { 

    //    console.log('dfsafdfds');
    // when a new Tweet pops into the stream, we get some data from the Tweet object. More information 
    // about the object keys you can use can be found at https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object

    /*
            io.sockets.emit('envia_resposta', JSON.stringify({
                id_tb_twitter:1111,
                c_name:tweet.user.screen_name,
                text:tweet.text,
                c_img:tweet.user.profile_image_url_https.replace('_normal', ''),
                status: true
                })
    );   

    */

        //io.sockets.emit('teste',tweet.user.screen_name)
        //socket.broadcast.emit('teste',tweet.user.screen_name); 


            
            let texto;
            try {
                texto =  tweet.extended_tweet.full_text;
            } catch(err){
                texto =  tweet.text;
            }





            if(texto.replace(/'/g, "\\'").substring(0, 4) == 'RT @'){
                // console.log('RT')
                } else {
            
                    conn.query("Insert into tb_twitter (c_hash, c_name, c_text, c_img) values ('"+HashTag+"','"+tweet.user.screen_name+"','"+texto.replace(/'/g, "\\'")+"','"+tweet.user.profile_image_url_https.replace('_normal', '')+"')", function (err, result) {
                        if (err) throw err;
                        // console.log(result.affectedRows + " record(s) updated"+result.insertId);
                        console.log([tweet.user.screen_name], texto);
                            //client.emit("resposta", 'saiu');

                            let data = JSON.stringify({
                                id_tb_twitter:result.insertId,
                                c_name:tweet.user.screen_name,
                                text:texto,
                                c_img:tweet.user.profile_image_url_https.replace('_normal', ''),
                                status: true,
                                status2: true
                            });
                            
                            io.sockets.emit('envia_resposta1', data); 
                            io.sockets.emit('envia_resposta2', data);   
                            
                        });
            
                    // console.log(tweet.user.profile_image_url + ","             + tweet.created_at + "," + tweet.id + "," + tweet.text             + ", @" + tweet.user.screen_name);
        /*

                    let data = JSON.stringify({
                        id_tb_twitter:1111,
                        c_name:tweet.user.screen_name,
                        text:texto,
                        c_img:tweet.user.profile_image_url_https.replace('_normal', ''),
                        status: true
                        });


                    io.sockets.emit('envia_resposta', data);   
                    */
            }


    

  
  
});

