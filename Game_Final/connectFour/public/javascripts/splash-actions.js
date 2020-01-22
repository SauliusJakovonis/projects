var main = function () { "use strict";
    function changeVisibility(){
        if($("#stats").css( "visibility" ) == "hidden"){
            $("#stats").css("visibility", "visible");
            $("#icon").attr('src','./images/stats.png');
        }else{
            $("#stats").css("visibility", "hidden");
            $("#icon").attr('src','./images/stats2.png');
        }
    }

    $("#icon").mouseup(function() {
        changeVisibility();
    });

    $("#icon").mouseover(function() {
        $("#icon").css("height", "56px");
        $("#icon").css("width", "56px");
        $("#icon").css("top", "-3px");
        $("#icon").css("left", "257px");
    });

    $("#icon").mouseleave(function() {
        $("#icon").css("height", "50px");
        $("#icon").css("width", "50px");
        $("#icon").css("top", "0px");
        $("#icon").css("left", "260px");
    });

    };

$(document).ready(main);