/* every game has two players, identified by their connection ID */

 function game(id){
    this.id = id;
    this.playerAid = -1;
    this.playerBid = -1;

    this.totalPoints = 0;
    this.winner = null;

    this.getID = function(){ return this.id; };
    this.setID = function(id){ this.id = id; };
}


game.prototype.addPlayer = function(conID) {
    if (this.playerAid == -1) {
        this.playerAid = conID;
        return "1";
    } else {
        this.playerBid = conID;
        return "0";
    }
};

module.exports = game;



