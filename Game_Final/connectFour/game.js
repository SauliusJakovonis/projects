/* every game has two players, identified by their WebSocket */
var game = function(gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.turn = 0; // "1" means green ball, "0" means orange ball
    this.gameState = "W"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted, "W" Waiting to connect
 };

game.prototype.addPlayer = function(p) {  
    if (this.playerA == null) {
        this.playerA = p;
        return "A";
    } else {
        this.playerB = p;
        return "B";
    }
};

game.prototype.hasTwoConnectedPlayers = function() {
    return this.gameState == "";
};

module.exports = game;