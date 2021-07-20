


var twit   = require('twit');       // require the lib
var config = require('./config_twitter.js'); // require the configurations


var Twitter = new twit(config); // pass the configuration to the twit



/*
Twitter.get('search/tweets', {q: '#BlackLivesMatter', tweet_mode:'extended'}, function(error, tweets, response) {
  tweets.statuses.forEach(function(tweet) {
   // console.log("tweet: " + tweet.text)

   console.log(tweet.text);
   console.log('@'+tweet.user.screen_name);
 
   console.log(tweet.text);
   
   console.log(tweet.full_text);
   console.log('xxxxxxxxx');



  if(tweet.full_text.replace(/'/g, "\\'").substring(0, 4) == 'RT @'){
     console.log('RT')
   }else{
 
   
   conn.query("Insert into tb_twitter (c_hash, c_name, c_text, c_img) values ('#BlackLivesMatter','"+tweet.user.screen_name+"','"+tweet.full_text.replace(/'/g, "\\'")+"','"+tweet.user.profile_image_url_https.replace('_normal', '')+"')", function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
         //client.emit("resposta", 'saiu');
    });

    //console.log(tweet);
    console.log(tweet);

  }

  
  });
});
*/



var stream = Twitter.stream('statuses/filter', { track: '#BlackLivesMatter', tweet_mode:'extended' })

stream.on('tweet', function (tweet) {
    //console.log(tweet);



  if(tweet.text.replace(/'/g, "\\'").substring(0, 4) == 'RT @'){
    console.log('RT')
  }else{
  
    conn.query("Insert into tb_twitter (c_hash, c_name, c_text, c_img) values ('#BlackLivesMatter','"+tweet.user.screen_name+"','"+tweet.text.replace(/'/g, "\\'")+"','"+tweet.user.profile_image_url_https.replace('_normal', '')+"')", function (err, result) {
      if (err) throw err;
     // console.log(result.affectedRows + " record(s) updated");
           //client.emit("resposta", 'saiu');
           console.log(tweet.truncated ? tweet.extended_tweet.full_text : tweet.text);
      });
  
  }
    
})




const express = require("express");
var fs = require('fs');

var privateKey = fs.readFileSync('privkey.pem', 'utf8');
var certificate = fs.readFileSync('fullchain.pem', 'utf8');

var credentials = { key: privateKey, cert: certificate };
var https = require('https');


const socketIO = require("socket.io");
const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
const port = process.env.PORT || 7000;
const app = express();
// our server instance
const server = https.createServer(credentials, app);
// This creates our socket using the instance of the server
const io = socketIO(server);


  const conn = mysql.createConnection({      
    host: "23.88.99.250",
    user: "root",
    password: "sqt5cog_w7zmow2r",
    database: "gc-twitter"
  });

    

io.on("connection", function (client) {    
    
console.log('conectou');
    
    //INICIO
    
    /*
    conn.query("Select * from tb_twitter where status = 1 order by id_tb_twitter limit 0,1 ", function (err, result) {
            //if (err) throw err;
            //console.log("Result: " + result.length+'fdasfd');
            //client.emit("inital_datax", result);
        if(result.length > 0){
             client.emit("resposta", result);
              conn.query("UPDATE tb_twitter SET status=1 where id_tb_twitter = "+result[0].id_tb_twitter, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
              });
        }
    });   
    */

    
    
    client.on("recebe_resposta", function(tipo, id){
        if(tipo == 'sair'){
            conn.query("UPDATE tb_twitter SET status=2 where id_tb_twitter = "+id, function (err, result) {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
                 client.emit("resposta", 'saiu');
                
            });
        }else if(tipo == 'entrar'){
           conn.query("UPDATE tb_twitter SET status=1 where id_tb_twitter = "+id, function (err, result) {
                    if (err) throw err;
               
                    console.log(result.affectedRows + " record(s) updated");
                    
                    conn.query("Select * from tb_twitter where id_tb_twitter = "+id, function (err, result) {
                    //if (err) throw err;
                    //console.log("Result: " + result.length+'fdasfd');
                    //client.emit("inital_datax", result);
                        if(result.length > 0){
                             client.emit("resposta", result);

                        }
                        
                    });   
            });
        }
    });
    
    
});



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/gc-twitter/lista_comment/', function(req, res){
    
    //console.log('foissss');
       conn.query("Select * from tb_twitter where status = 0", function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
         res.json(result);
           //res.send('hh');
        //client.emit("inital_datax", result);
    });
    
    
});


const program = async () => {

        conn.connect(function(err) {
          if (err) throw err;
          console.log("Connected!");        
        });

          const instance = new MySQLEvents(conn, {
            startAtEnd: true // to record only the new binary logs, if set to false or you didn'y provide it all the events will be console.logged after you start the app
          });

          await instance.start();

          instance.addTrigger({
            name: 'monitoring all statments',
            expression: 'gc-twitter.tb_twitter', // listen to TEST database !!!
            statement: MySQLEvents.STATEMENTS.INSERT, // you can choose only insert for example MySQLEvents.STATEMENTS.INSERT, but here we are choosing everything
            onEvent: (event) => { // You will receive the events here
          
                
                //client.emit("busca_mais",'dsfasdfdsafsdfsda');
                
                
                //evento = event.affectedRows;
                
                console.log(event.affectedRows);
                
                
                io.emit("busca_mais",event.affectedRows);
               // io.emit("busca_mais","kkkkkk");
                
                
                
            },
              
             
          });

            return 'testexxx';
          instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
          instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
    
    
    
};


program()
.then(resposta => {
      Teste(resposta);
    })
    .catch(err => {
        console.log(`Got error: ${err}`);
    });

server.listen(port, () => console.log(`Listening on port ${port}`));

function Teste(valor){
    console.log(valor);
}




