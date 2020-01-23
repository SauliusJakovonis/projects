var setColor = "rgb(0, 128, 0)";
var setColor2 = "rgb(253, 98, 70)";
var fallingColor = "rgb(52, 168, 50)";
var fallingColor2 = "rgb(253, 168, 50)";
var freeze = true; //freezes the game after the game is over
var turn = 1;
var current_disk = ""; // saves last placed disk on game area

var main = function () { "use strict";

var socket = new WebSocket("ws://localhost:3000");

    socket.onmessage = function(event){
        console.log("INITIAL LOG" + event.data);


        let oMsg = JSON.parse(event.data);
        console.log(oMsg); 
        
        if(oMsg["player_type"] == 1){
            freeze = false;  
        }
            
        
        if (oMsg["type"] == "MAKE-A-MOVE"){
            
            console.log("TYPE IDEED")
            changeTurn();

            clearColors(REFERENCE BUBBLE OBJECT HERE);
           
            var temp = oMsg.move;
            console.log(temp);
            temp= temp.toString();
            temp= temp.slice(0,3);

            console.log(temp);
            var i = 5;

            while(i >= 0){
                var temp2 = temp + i;
                var color = $( "#" + temp2 ).css( "background-color" );
                if(color != setColor && color != setColor2){
                    // save current player 
                    current_disk = temp2;
                    fallingAnim(temp2);
                    return;
                }
                i--;
            }
            play("error");
            $('#playerInfo').css("color", "red");
            $('#playerInfo').text("The stack is full!");
            flashAnnouncement(2);
            setTimeout(function(){ changeTurn(); changeTurn();}, 1500);
            freeze = false;
        }


    }

    socket.onopen = function(){
        //var token= {"Startup" : 1}
        //socket.send(JSON.stringify(token));
    };

    //Changes turn variable and updates text on the screen
    function changeTurn(){
        if(!freeze){
            $('#playerInfo').css("color", "white");
            if(turn == 1){
                $('#playerInfo').text("Player 2's turn!");
                turn = 0;
              
            }else{
                $('#playerInfo').text("Player 1's turn!");
                turn = 1;

            }
            flashAnnouncement(1);
        }
    }

    //flashes the announcement box
    function flashAnnouncement(action){
        if(action == 1){
            $("#client-messages").css("background-color", "grey");
        }else if(action == 2){
            $("#client-messages").css("background-color", "red");
        }
        
        setTimeout(function(){ clearAnnouncement(); }, 50);
    }

    function clearAnnouncement(){
        $("#client-messages").css("background-color", "");
    }

    //Colors the final item after the falling animation is completed
    function colorSelected(temp2){
        if(turn == 1){
                    $(temp2).css("background-color",setColor);
                    play("opponent2_4");
                    check();
                    changeTurn();
                }else{
                    $(temp2).css("background-color",setColor2);
                    play("opponent1_4");
                    check();
                    changeTurn();
                }
                return;
    }



    //Plays audio with only title required as an input
    function play(audio){
        var obj = document.createElement("audio");
        obj.src = "./images/"+audio+".mp3"; 
        obj.play(); 
    }

    //helper function for 'check()'
    //outputs current player bubble color

    function currentColor(){
        if(turn == 1){
            return setColor;
        }else{
            return setColor2;
        }
    }

    //returns either 1 or 2, depending on the turn
    function currentPlayer(){
        if(turn == 1){
            return 1;
        }else{
            return 2;
        }
    }

    // checks 3 more disks  vertically off current colour 
    function check_vertically(){ 
        // count how many spots from current location we can move vertically 
        var curr_loc = parseInt(current_disk.slice(3,4));
        var disk_count = 1;

        // check down
        for(var i = curr_loc + 1; i<=5 ; i ++){
            var check_loc = current_disk.slice(0,3) + i;
            
            var color = $( "#" + check_loc ).css( "background-color" ); //saves the color of the current bubble
            if(color == currentColor()){
               disk_count++;
            }else if(disk_count >= 4){
                gameOver(turn);
                return;
            }else{
                break;
            }
        }

        // check up
            for(var i = curr_loc - 1; i >= 0; i --){
                var check_loc = current_disk.slice(0,3) + i;
                
                var color = $( "#" + check_loc ).css( "background-color" ); //saves the color of the current bubble
                if(color == currentColor()){
                    disk_count++;
                }else if(disk_count >= 4){
                    gameOver(turn);
                    return;
                }else{
                    break;
                }
            }
    }

    function check_horizontally(){
            // count how many spots from current location we can move vertically 
            var curr_loc = parseInt(current_disk.slice(1,2));
            var disk_count = 1;
    
           // check right
                for(var i = curr_loc + 1; i <= 6; i ++){
                    var check_loc = current_disk.slice(0,1) + i + current_disk.slice(2,4);

                    var color = $( "#" + check_loc ).css( "background-color" ); //saves the color of the current bubble
                    if(color == currentColor()){
                        disk_count++;
                        if(disk_count >= 4){
                            gameOver(turn);
                            return;
                        }
                    }else{
                        break;
                    }
                } 
    
             // check left
                for(var i = curr_loc - 1; i >= 0; i --){
                    var check_loc = current_disk.slice(0,1) + i + current_disk.slice(2,4);

                    var color = $( "#" + check_loc ).css( "background-color" ); //saves the color of the current bubble
                    if(color == currentColor()){
                        disk_count++;
                        if(disk_count >= 4){
                            gameOver(turn);
                            return;
                        }
                    }else{
                        break;
                    }
                } 
    
    }

    function check_diagonally(){
            // count how many spots from current location we can move vertically 
            var curr_loc_x = parseInt(current_disk.slice(1,2));
            var curr_loc_y = parseInt(current_disk.slice(3,4));
            var disk_count = 1;
    
           // check right up
                for(var i = curr_loc_x + 1,  j = curr_loc_y - 1; i <= 6 && j >= 0; i ++, j--){
                    
                    var check_loc = "x" + i + "y" + j;

                    var color = $( "#" + check_loc ).css( "background-color" ); //saves the color of the current bubble
                    if(color == currentColor()){
                        disk_count++;
                        if(disk_count >= 4){
                            gameOver(turn);
                            return;
                        }
                    }else{
                        break;
                    }
                } 
    
             // check left down
             for(var i = curr_loc_x -1,  j = curr_loc_y + 1; i >= 0  && j <= 5; i --, j++){
                    
                var check_loc = "x" + i + "y" + j;

                var color = $( "#" + check_loc ).css( "background-color" ); //saves the color of the current bubble
                if(color == currentColor()){
                    disk_count++;
                    if(disk_count >= 4){
                        gameOver(turn);
                        return;
                    }
                }else{
                    break;
                }
            }
    
    }

    function check_cross_diagonally(){
            // count how many spots from current location we can move vertically 
            var curr_loc_x = parseInt(current_disk.slice(1,2));
            var curr_loc_y = parseInt(current_disk.slice(3,4));
            var disk_count = 1;
    
            
           // check left up
                for(var i = curr_loc_x - 1,  j = curr_loc_y - 1; i >=0  && j >= 0; i--, j--){
                    
                    var check_loc = "x" + i + "y" + j;
                    var color = $( "#" + check_loc ).css( "background-color" ); //saves the color of the current bubble
                    if(color == currentColor()){
                        disk_count++;
                        if(disk_count >= 4){
                            gameOver(turn);
                            return;
                        }
                    }else{
                        break;
                    }
                } 
    
             // check right down
             for(var i = curr_loc_x + 1,  j = curr_loc_y + 1; i <= 6  && j <= 5; i ++, j++){
                    
                var check_loc = "x" + i + "y" + j;
                var color = $( "#" + check_loc ).css( "background-color" ); //saves the color of the current bubble
                if(color == currentColor()){
                    disk_count++;
                    if(disk_count >= 4){
                        gameOver(turn);
                        return;
                    }
                }else{
                    break;
                }
            }
    
    }

    //checks whether anybody won
    function check(){
        check_vertically(); // checks 3 more disks  vertically off current colour 
        check_horizontally();// checks 3 more disks  horizontally off current colour 
        check_diagonally(); // checks 3 more disks  diagonally off current colour
        check_cross_diagonally(); // checks 3 more disks  cross diagonally off current colour

    }

    //Shows game-over screen and asks to play again
    function gameOver(turn){
        $('#playerInfo').text("Congratulations!! Player " + currentPlayer() + "wins!");
        $('#won').text("Player " + currentPlayer() + " won!");
        $('#game-over').css("visibility", "visible");
        $('#playerInfo').css("color", "green");
        play("opponent1_2");
        freeze = true;
    }

    //Returns the falling color of the bubble, depending on the turn
    function getFallingColor(){
        if(turn == 1 ){
            return fallingColor;
        }else{
            return fallingColor2;
        }
    }

    //This function takes in coordinates and creates falling animation with a specified time delay
    //After the falling animation it updates the color of the lowest uncolored bubble
    function fallingAnim(coords){
        var falling_delay = 75;
        var y_stop = coords.slice(3,4);
        var all_but_y = coords.slice(0,3);

        for (let i = 0; i <= y_stop; i++){
            if(i == y_stop){
                setTimeout( function() {
                    clearColors($("#" + all_but_y + i).get(0));
                    colorSelected("#" + coords);
                    freeze = true;

                    let msg = {"type": "MAKE-A-MOVE", "move": current_disk};
                
                    socket.send(JSON.stringify(msg));

                    console.log( "Falling msg" + msg);

                }, falling_delay * i);
            }else{
                setTimeout( function() {
                    clearColors($("#" + coords).get(0));
                    $("#" + all_but_y + i).css("background-color", getFallingColor());
                    }, falling_delay * i);
            }
        }
    }

    //Clears colors & reduces the size of the bubbles to normal, leaving only the ones that already have a green or orange ball
    function clearColors($temp){
        //$(this).css("background-color","white");
        $('.bubble').each(function() {
            if(this.id.slice(0, 2) == $temp.id.slice(0,2)){
                var color = $( this ).css( "background-color" );
                $(this).css("width","85%");
                $(this).css("height","90%");
                if(color != setColor && color != setColor2){
                    $(this).css("background-color","white");
                }
            }       
        });
    }

        //When the mouse hovers over a column, it is highlighted by turning that column gray
        $(".bubble").mouseover(function() {
            if(!freeze){
                var $temp = this;
                $('.bubble').each(function(i, obj) {
                    if(this.id.slice(0, 2) == $temp.id.slice(0,2)){
                        var color = $( this ).css( "background-color" );
                        if(color != setColor && color != setColor2){
                            $(this).css("background-color","grey");
                        }
                    }       
                });
            } 
        }); 

        //When the mouse is clicked, the column turns red until the mouse is released
        $(".bubble").mousedown(function() {
            if(!freeze){
                var $temp = this;
                $('.bubble').each(function(i, obj) {
                    if(this.id.slice(0, 2) == $temp.id.slice(0,2)){
                        var color = $( this ).css( "background-color" );
                        $(this).css("width","90%");
                        $(this).css("height","95%");
                        if(color != setColor && color != setColor2){
                            $(this).css("background-color","red");
                        }
                    }       
                });
            }
        });
            
        //When the mouse is released falling animation is executed and a bubble that is lowest free bubble gets colored, 
        //depending on turn. Player 1 is green, player2 is orange
        $(".bubble").mouseup(function() {


            if(!freeze){
                clearColors(this);
                var temp = this.id.slice(0,3);
                var i = 5;

                while(i >= 0){
                    var temp2 = temp + i;
                    var color = $( "#" + temp2 ).css( "background-color" );
                    if(color != setColor && color != setColor2){
                        // save current player 
                        current_disk = temp2;
                        fallingAnim(temp2);
                        return;
                    }
                    i--;
                }

        
                play("error");
                $('#playerInfo').css("color", "red");
                $('#playerInfo').text("The stack is full!");
                flashAnnouncement(2);
                setTimeout(function(){ changeTurn(); changeTurn();}, 1500);

            }

        }); 

        $("#playerInfo").mouseup(function() {
            play("theme");
        });
        //when the mouse stops hovering, this function removed the gray highlight, leaving only already activated bubbles
        $(".bubble").mouseleave(function() {
            clearColors(this);
        }); 

};


$(document).ready(main);