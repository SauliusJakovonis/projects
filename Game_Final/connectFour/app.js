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

app.get("/", (req, res) => {
    res.render("splash.ejs", {
      gamesInitialized: gameStatus.gamesInitialized,
      gamesCompleted: gameStatus.gamesCompleted
    });
  });

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

    //Inform the client about the new player
    console.log(
        "Player %s placed in %s game as %s player.",
        con.id,
        currentGame.id,
        playerType
    );
        //console.log("Connection state: "+ ws.readyState);
        ws.send("You received player id " + con.id);

        //receiving message
    ws.on("message", function incoming(message) {

        console.log("[LOG] " + message);

        if(message == "GAME-ABORTED"){
            ws.close();
            console.log("Player left!");
        }
    });
});

server.listen(port);