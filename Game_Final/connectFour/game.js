/* every game has two players, identified by their connection ID */

 function game(id){
    this.id = id;
    this.playerA = null;
    this.playerB = null;

    this.totalPoints = 0;
    this.winner = null;

    this.getID = function(){ return this.id; };
    this.setID = function(id){ this.id = id; };
}


game.prototype.addPlayer = function(con) {
    if (this.playerA == null) {
        this.playerA = con;
        return "1";
    } else {
        this.playerB = con;
        return "0";
    }
};

module.exports = game;



