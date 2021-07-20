const WebSocket = require('ws');
const fetch = require('node-fetch');
var fs = require('fs');

var privateKey = fs.readFileSync('privkey.pem', 'utf8');
var certificate = fs.readFileSync('fullchain.pem', 'utf8');

var credentials = { key: privateKey, cert: certificate };
var https = require('https');

var httpsServer = https.createServer(credentials);
httpsServer.listen(3001);

var MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server, ObjectId = require('mongodb').ObjectID;
var mongoClient = new MongoClient(new Server('23.88.99.250', 27017));

mongoClient.connect(function(err, mongoClient) {

  var db1 = mongoClient.db("ChatNovo");
  var userCollection = db1.collection('chat');

  var WebSocketServer = require('ws').Server;
  const wss  = new WebSocketServer({
    server: httpsServer
  }, console.log('Server started...'));

/*
  const wss = new WebSocket.Server({port: 3001}, () => {
    console.log('Server started...');
  });
*/
  let ws;
  let clients = {};


    // console.log(JSon[0].aovivo);
    // console.log(JSon[0].idvideo);
    // console.log(JSon[0].id_tb_evento);
    // let id_tb_evento = JSon[0].id_tb_evento;
    let id_tb_evento = 1;


  wss.on('connection', (server) => {


    ws = server;

    const client = ws.upgradeReq.headers['sec-websocket-key'];

    clients[client] = ws;


    ws.on('message', (msg, data) =>

      // msg.user !=="" ? console.log(msg) :

        receive(msg, data, client),


        userCollection.countDocuments({ visivel: 'true' }, function(err,count) {

           


            if(count > 0){
              
              if(count > 20){ LimitLoop = 20 } else { LimitLoop = count }
              var mysort = { timestamp: -1 };
              userCollection.find({ visivel: 'true' }).limit(LimitLoop).sort(mysort).toArray(function(err, result) {
                if (err) throw err;
                 //console.log(result);
                
                var p_array = [];
                var i;
                for (i = 0; i < LimitLoop; i++) {
                    // console.log(i)
                   
                      p_array.push(JSON.stringify( {
                        "id": result[i]._id,
                        "IdMsg": result[i].IdMsg,
                        "user": result[i].NomeUser,
                        "timestamp":result[i].timestamp,
                        "text": result[i].TextoMsg,
                        "IdChat":result[i].IdChat,
                        "IdUser":result[i].IdUser,
                        "AdminUser":result[i].AdminUser,
                        "visivel":'true',
                        "QntConectado":'',
                    } ));
                }
                  
                    
                    var index;
                    for (index = p_array.length-1; index > -1; --index) {
                        // console.log(JSON.parse(p_array[index]).text);
                        //console.log(p_array[index]);
                       // console.log(JSON.parse(p_array[index]).user)
                        
                        
             
                         clients[client].send(JSON.stringify( {
                          "id": JSON.parse(p_array[index]).id,
                          "IdMsg": JSON.parse(p_array[index]).IdMsg,
                          "user": JSON.parse(p_array[index]).user,
                          "timestamp":JSON.parse(p_array[index]).timestamp,
                          "text": JSON.parse(p_array[index]).text,
                          "IdChat":JSON.parse(p_array[index]).IdChat,
                          "IdUser":JSON.parse(p_array[index]).IdUser,
                          "AdminUser":JSON.parse(p_array[index]).AdminUser,
                          "visivel":'true',
                          "QntConectado":'',
                        } ), (error) => {});
           
                    }
                  

           
/*
                  
                 // console.log(p_array);
                  p_array.forEach(element => { 
                      console.log(element['timestamp']); 
                  }); 
                  
*/

              })

            }



        }),


    );


    

    



    // ws.on('close', (socket, number, reason) =>
    //   console.log('Closed: ', client, socket, number, reason),
    //   delete client
    // );

    ws.on('close', function () {
      delete client;
      delete clients[client];
      console.log('Closed: ', client);
      console.log('CONECTADOS: ', Object.keys(clients).length);
      // console.log('Lista: ', Object.keys(clients));
    });
    
    console.log('conectou: ' + client);
    console.log('CONECTADOS: ', Object.keys(clients).length);

  });


  // userCollection.findOne({}, function(err, result) {
  //   if (err) throw err;
  //   console.log(result.NomeUser);
  // });

  // userCollection.find({}, { projection: { _id: 0, NomeUser: 1, IdChat: 1, IdUser: 1, TextoMsg: 1, HoraMsg: 1 } }).limit(2).toArray(function(err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });


  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const hoursText = hours < 10 ? `0${hours}` : hours;
    const minutesText = minutes < 10 ? `0${minutes}` : minutes;
    return `${hoursText}:${minutesText}`;
  };

  const send = (msg, client) => {
    // console.log('Sending: ', msg);
    clients[client].send(JSON.stringify(msg), (error) => {

      if (error) {

        delete clients[client];

      } else {

      }

    });
  };



  const receive = (msg, data, sender) => {

    if(JSON.parse(msg).action == 'Excluir'){
      console.log(`Excluir: ${msg.substring(0, 500)}, from ${sender}`);
      console.log(JSON.parse(msg).IdMsgDel);

   
        userCollection.updateOne(
          {IdMsg: JSON.parse(msg).IdMsgDel},
          {$set: {"visivel": "false"}}
        );


      broadcast(msg, sender);

    } else {

      console.log(`Received: ${msg.substring(0, 500)}, from ${sender}`);
      broadcast(msg, sender);
    }


  };



  const broadcast = (msg, sender) => {
    msg = JSON.parse(msg);
    msg.QntConectado = Object.keys(clients).length;

    // console.log('broadcast', msg);

    if(msg.action == 'Excluir'){
      console.log(msg);
    } else {

      // INSERT MSG NO MONGODB
      InsereMongo(msg);
    }
    


    Object.keys(clients).map((client) => {
      if (client === sender) {
        return;
      } else {
        send(msg, client);
      }
    });

  };





  // INSERT MSG NO MONGODB
  function InsereMongo(msg) {
    userCollection.insertOne({
      IdMsg: msg.IdMsg,
      IdChat: msg.IdChat,
      IdUser: msg.IdUser,
      AdminUser: msg.AdminUser,
      visivel: 'true',
      NomeUser: msg.user,
      TextoMsg: msg.text,
      HoraMsg: formatTime(msg.timestamp),
      timestamp: msg.timestamp
    })
    // console.log('INSERT MSG NO MONGODB');

    // console.log(`Sent: ${msg}, to ${client}`);
    // console.log('NomeUser:' + msg.user );
    // console.log('TextoMsg:' + msg.text );
    // console.log('IdChat:' + msg.IdChat );
    // console.log('IdUser:' + msg.IdUser );
    // console.log('HoraMsg:' + formatTime(msg.timestamp) );

  }






// mongoClient.close();
});