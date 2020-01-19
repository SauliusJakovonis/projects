var setColor = "rgb(0, 128, 0)";
var setColor2 = "rgb(253, 98, 70)";
var fallingColor = "rgb(52, 168, 50)";
var fallingColor2 = "rgb(253, 168, 50)";
var freeze = false; //freezes the game after the game is over
var turn = 1;

var main = function () { "use strict";

    //Changes turn variable and updates text on the screen
    function changeTurn(){
        if(!freeze){
            if(turn == 1){
                $('#playerInfo').text("Player 2 turn!");
                turn = 0;
            }else{
                $('#playerInfo').text("Player 1 turn!");
                turn = 1;
            }
        }
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
        obj.src = "./resources/"+audio+".mp3"; 
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

    //checks wether anybody won
    function check(){
        var temp = "x0y"; //sets the first column to be checked
        var i = 5; //how many rows there are from 0
        var colorCount = 0; //counts how many current color bubbles it found in a row

        while(i >= 0){
            var temp2 = temp + i; //each iteration ads the next int to the string 'temp'
            var color = $( "#" + temp2 ).css( "background-color" ); //saves the color of the current bubble
            if(color == currentColor()){
                colorCount++;
            }else if(colorCount >= 4){
                gameOver(turn);
                return;
            }else{
                colorCount = 0;
            }
            i--;
        }

    }

    //Shows game-over screen and asks to play again
    function gameOver(turn){
        $('#playerInfo').text("Congratulations!! Player " + currentPlayer() + " won!");
        $('#won').text("Player " + currentPlayer() + " won!");
        $('#game-over').css("visibility", "visible");
        $('#playerInfo').css("color", "green");
        play("opponent1_2");
        freeze = true;
    }

    //Helper function for time delay. It is called by 'fallingAnim' and then it calls itself
    //It creates the falling animation
    function falling(coords, stop, temp, i, color){
            clearColors($(coords).get(0));
            i++;
            if(i < stop){
                $("#" + temp + i).css("background-color",color);
                setTimeout(function(){ falling(coords, stop, temp, i, color); }, 75);
            }else{
                colorSelected(coords);
            }

    }

    //This function takes coordinates and creates falling animation with time delay
    //Uses falling, colorSelected functions
    function fallingAnim(coords){
        var stop = coords.slice(3,4);
        var temp = coords.slice(0,3);
        if(turn == 1 ){
            var color = fallingColor;
        }else{
            var color = fallingColor2;
        }

        if(temp == stop){
            colorSelected(coords);
            return;
        }

        var color
        var i = 0;
            $("#" + temp + i).css("background-color",color);
            setTimeout(function(){ falling("#" + temp + stop, stop, temp, i,color); }, 75);
    }

    //Clears colors & reduces the size of the bubbles to normal, leaving only the ones that already have a green or orange ball
    function clearColors($temp){
        $(this).css("background-color","white");
        $('.bubble').each(function(i, obj) {
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
                        fallingAnim(temp2);
                        return;
                    }
                    i--;
                }
                play("error");
                $('#playerInfo').text("!!!The stack is full!!!");
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