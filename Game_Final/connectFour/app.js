var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");
var Game = require("./game");
var gameStatus = require("./statTracker");

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
    
    let playerType = currentGame.addPlayer(con);
    websockets[con.id] = currentGame;

    let gameObj = websockets[con.id];

    if(playerType == 0){
        let connected = {"type" : "OPPONENT-CONNECTED"}
        gameObj.playerA.send(JSON.stringify(connected));
        currentGame = new Game(gameStatus.gamesInitialized++);
    }

    //Inform the client about the new player
    console.log(
        "Player %s placed in %s game as player type %s.",
        con.id.toString(),
        websockets[con.id].id,
        playerType
    );

    var client_packet = {"player_ID" : con.id ,  "player_type_": playerType}
    con.send(JSON.stringify(client_packet));

    //let msg = messages.O_GAME_STARTED;
    //con.send(JSON.stringify(msg));

    //receiving message
    ws.on("message", function incoming(message) {

        let oMsg = JSON.parse(message);
        let gameObj = websockets[con.id];

    

        let isPlayerA = gameObj.playerA == con ? true : false;
 
        //If a player makes a move, the move gets sent to the other player
        if (oMsg.type == "MAKE-A-MOVE" || oMsg.type == "GAME-IS-OVER") {
            if (isPlayerA) {
                gameObj.playerB.send(message);
            } else {
                gameObj.playerA.send(message);
            }

        }
       
    });
    
    con.on("close", function(code) {
        let gameObj = websockets[con.id];
        let msg = {"type" : "PLAYER-QUIT"};

        let isPlayerA = gameObj.playerA == con ? true : false;

            if (isPlayerA) {
                gameObj.playerB.send(JSON.stringify(msg));
            } else {
                gameObj.playerA.send(JSON.stringify(msg));
            }

    });
});

server.listen(port);