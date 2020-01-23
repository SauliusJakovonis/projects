var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");
var Game = require("./game");
var gameStatus = require("./statTracker");
//var actions = require("./public/javascripts/actions");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));

app.get("/", indexRouter);
app.get("/play", indexRouter);
app.get("/rules", indexRouter);

var server = http.createServer(app);
const wss = new websocket.Server({ server });

var currentGame = new Game(gameStatus.gamesInitialized++);

var websockets = {}; //property: websocket, value: game
var connectionID = 0; //setting new ID for each connection

wss.on("connection", function connection(ws) {

    let con = ws;
    con.id = connectionID++;
    
    let playerType = currentGame.addPlayer(con.id);
    websockets[con.id] = currentGame;

    if(playerType == 0){
        currentGame = new Game(gameStatus.gamesInitialized++);
    }

    //Inform the client about the new player
    console.log(
        "Player %s placed in %s game as player type %s.",
        con.id,
        websockets[con.id].id,
        playerType
    );

    var client_packet = {"player_ID" : con.id ,  "player_type": playerType}
    //console.log("Connection state: "+ ws.readyState);
    ws.send(JSON.stringify(client_packet));

    let msg = messages.O_GAME_STARTED;
    con.send(JSON.stringify(msg));

    //receiving message
    ws.on("message", function incoming(message) {

        console.log(message);
        let oMsg = JSON.parse(message);
        let gameObj = websockets[con.id];

    

        let isPlayerA = gameObj.playerAid == con.id ? true : false;

        //If a player makes a move, the move gets sent to the other player
        if (oMsg.type == "MAKE-A-MOVE") {
            let conOtherPlayer = ws;

            if (isPlayerA) {
                conOtherPlayer.id = gameObj.playerBid;
                conOtherPlayer.send(message);
            } else {
                conOtherPlayer.id = gameObj.playerAid;
                conOtherPlayer.send(message);
            }

        }

        if(oMsg.type == "GAME-ABORTED"){
            ws.close();
            console.log("Player left!");
        }

       
    });
});

server.listen(port);