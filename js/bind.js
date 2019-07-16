var ChosenPiece=null, PrevChosenPiece=null, ChosenSquare=null;
var columns = "abcdefgh";
var piecetypes = ["wk", "wq", "wr", "wb", "wn", "wp", "bk", "bq", "br", "bb", "bn", "bp"]
var ev = event;
var movesmade=[];

function starter() {
/*    for (i = 0; i < 12; i++) {
        var x = document.getElementById(columns[i]+"1").addEventListener("click", mover());
    }
    
    for (i = 1; i < 12; i++) {
        if (i=! 6) {
            var x = document.getElementById(columns[i]+"2").addEventListener("click", mover());}
    }
    
    for (i=3; i<9; i++) {
        var x = document.getElementById("wp"+i).addEventListener("click", mover());
        var x = document.getElementById("bp"+i).addEventListener("click", mover());
    }
    
    for (i = 0; i < 8; i++) {
        for (j = 1; j < 9; j++) {
            var x = document.getElementById(columns[i]+j).addEventListener("click", truemover());
        }
    } */
}
function squarechooser (ev) {
    ChosenSquare = event.target.id;
    if (ChosenSquare == ChosenPiece) {
        ChosenSquare = null;
        return;
    }
    console.log("square:" + ChosenSquare);
    return;
}

function unchoose () {
    for (i = 0; i < 8; i++) {
        for (j = 1; j < 9; j++) {
            var x = document.getElementById(columns[i]+j).setAttribute("style", "");
            
            //var x = document.getElementById(columns[i]+j).addEventListener("click", squarechooser());//
        }
    }
    var x= document.getElementById(ChosenPiece).setAttribute("style", "");

}

function truemover () {
    squarechooser();

    if (ChosenSquare == null || ChosenSquare == ChosenPiece) {
            var x= document.getElementById(PrevChosenPiece).setAttribute("style", "");
        return;
    } else {
        var x = document.getElementById(ChosenSquare).appendChild(document.getElementById(ChosenPiece));
    unchoose();
    }
    movesmade.push(String(ChosenPiece + " " + ChosenSquare));
    console.log(ChosenPiece + " " + ChosenSquare);
    return;
}

function piecechooser () {
    PrevChosenPiece = ChosenPiece;
    ChosenPiece = event.target.id;
    event.target.setAttribute("style", "border: 2px solid red");
    console.log("piece:" + ChosenPiece);
    return;
}

function choosable () {
    for (i = 0; i < 8; i++) {
        for (j = 1; j < 9; j++) {
            var x = document.getElementById(columns[i]+j).setAttribute("style", "border: 0.5px dotted darkgreen;");
        }
    }
}

function mover () {
    piecechooser();
    choosable();
    return;
}
