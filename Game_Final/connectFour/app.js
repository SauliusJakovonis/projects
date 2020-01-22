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

    //console.log("Connection state: "+ ws.readyState);
    ws.send("You received player id " + con.id + ", your player type is " + playerType);

    let msg = messages._GAME_STARTED;
    con.send(JSON.stringify(msg))

    //receiving message
    ws.on("message", function incoming(message) {

        console.log("[LOG] " + message);

        websockets[con.id].

        if(websockets[con.id].playerAid == con.id){
            // player A 
            
        } else {
            // player B 
        }

        if(message == "GAME-ABORTED"){
            ws.close();
            console.log("Player left!");
        }

        if(message == "MAKE-A-MOVE"){
    
        }
    });
});

server.listen(port);