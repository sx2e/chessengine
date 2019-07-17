var files = "abcdefgh";

var GameBoard = {};
var SelectedSquare = null;
var PreviousSquare = null;

// piece types = PieceType.indexOf(" ") 

GameBoard.PieceNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
GameBoard.totpiecenum = 0;
GameBoard.PieceType = ["wp", "wn", "wb", "wr", "wq", "wk", "bp", "bn", "bb", "br", "bq", "bk"];
GameBoard.Square = new Array(64); // [a1, a2 ...]
GameBoard.PieceInSquare = new Array(64); // [1, 2, 3, -1, -1, 9 ...]
GameBoard.SquareWithPiece = Array;
GameBoard.Turn = null;
GameBoard.HalfMoves = [];
GameBoard.PositionId = "";
GameBoard.History = [];

var INIT = {};
INIT.PieceInSquare = [ 3, 1, 2, 4, 5, 2, 1, 3,
                       0, 0, 0, 0, 0, 0, 0, 0,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       4, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       6, 6, 6, 6, 6, 6, 6, 6,
                       9, 7, 8, 10, 11, 8, 7, 9];
INIT.Turn = "w";

function PosId() {
    GameBoard.PositionId = GameBoard.Turn.toUpperCase() + "-";
    var count = 0;
    for (i = 0; i < 8; i++) {
        for (k = 0; k < 8; k++) {
            var p = GameBoard.PieceInSquare[i * 8 + k];
            if (p == -1) {
                count++;
            } else {
                if (count > 0) {
                    GameBoard.PositionId += "x" + count;
                    count = 0;
                }
                GameBoard.PositionId += parseInt(p).toString(16);
            }
        }
        if (count > 0) {
            GameBoard.PositionId += "x" + count;
            count = 0;
        }
        GameBoard.PositionId += "/";
    }
    GameBoard.PositionId += "-";

    //castle and en pas flags

    return GameBoard.PositionId;
}

function SqStrtoId(str) {
    return Number((str[1]) * 8) + Number(files.indexOf(str[0]) - 8);
}

function BoardGenerator() {
    var sqclr = 0;
    var rank, sq;
    for (i = 8; i > 0; i--) {
        rank = document.createElement("div");
        rank.setAttribute("id", i);
        rank.setAttribute("class", "rank");
        document.getElementById("board").appendChild(rank);
        for (j = 0; j < 8; j++) {
            sq = document.createElement("div");
            sq.setAttribute("id", files[j] + i);
            sq.addEventListener("click", function(){
                PreviousSquare = SelectedSquare;
                SelectedSquare = $(this).attr("id");
                $(this).addClass("selectedsquare");
                registermove();
            })

            document.getElementById(i).appendChild(sq);
            GameBoard.Square[i * 8 + j - 8] = files[j] + i;
            if (sqclr == 0) {
                sq.setAttribute("class", "lightsquare");
            } else {
                sq.setAttribute("class", "darksquare");
            }
            sqclr ^= 1;
        }
        sqclr ^= 1;
    }
    return;
}

function registermove() {
    if (PreviousSquare != null) {
        PieceMover(PreviousSquare, SelectedSquare);
        PreviousSquare = null;
        SelectedSquare = null;
        $(div).removeClass("selectedsquare");
    }
}

function PieceGuiGenerator(pt, sq) {
    var pce;
    pce = document.createElement("img");
    pce.setAttribute("class", "pieceonboard");
    pce.setAttribute("src", "img/" + GameBoard.PieceType[pt] + ".png");
    document.getElementById(sq).appendChild(pce);
    return;
}

function PieceGuiRemover(sq) {
    $("#" + sq + " > img").remove();
    return;
}

function SqWithPiece() {
    GameBoard.SquareWithPiece = [];
    for (i = 0; i < 64; i++) {
        if (GameBoard.PieceInSquare[i] == -1) {} else {
            GameBoard.SquareWithPiece.push(GameBoard.Square[i]);
        }
    }
    return GameBoard.SquareWithPiece;
}

function PieceGenerator() {
    GameBoard.totpiecenum = 0;
    GameBoard.PieceNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < 64; i++) {
        if (GameBoard.PieceInSquare[i] == -1) {} else {
            GameBoard.PieceNum[GameBoard.PieceInSquare[i]]++;
            GameBoard.totpiecenum++;
            PieceGuiRemover(i);
            PieceGuiGenerator(GameBoard.PieceInSquare[i], GameBoard.Square[i]);
        }
    }
    return GameBoard.PieceNum;
}

function IsAttacked (sq) {
    

};

function PieceMover(from, to) {
    var pce = GameBoard.PieceInSquare[SqStrtoId(from)];
    var to_pce = GameBoard.PieceInSquare[SqStrtoId(to)];
    switch (GameBoard.Turn) {
        case "w":
            if ((-1 < pce) && (pce < 6)) {
                break;
            } else {
                console.log("not your move");
                return false;
            }
        case "b":
            if ((5 < pce) && (pce < 12)) {
                 break;
            } else {
                console.log("not your move");
                return false;
            }
        default:
            console.log(pce + " from: " + from + "\n to: " + to)
            console.log("game is over");
            return false;
    }

    GameBoard.PieceInSquare[SqStrtoId(from)] = -1;
    GameBoard.PieceInSquare[SqStrtoId(to)] = pce;
    GameBoard.HalfMoves.push(from + to);

    console.log(GameBoard.HalfMoves);
    var flag = CheckFlags(pce, to_pce, from, to);
    var legality = CheckLegality(pce, to_pce, from, to, flag);
    if (legality == false) {
        GameBoard.PieceInSquare[SqStrtoId(from)] = pce;
        GameBoard.PieceInSquare[SqStrtoId(to)] = to_pce;
        GameBoard.HalfMoves.pop();
        console.log("is illegal");
        return false;
    };

    PieceGuiRemover(from);

    if (flag[0] == true) {
        PieceGuiRemover(to);
    }

    if (flag[2] == true) {
        PieceGuiGenerator(pce, to); //to be changed
    } else {
        PieceGuiGenerator(pce, to);
    }
    if (GameBoard.Turn == "w") {
        GameBoard.Turn = "b"
    } else {
        if (GameBoard.Turn == "b") {
            GameBoard.Turn = "w"
        }
    }
    PosId();
    return;
}

function CheckFlags(pce, to_pce, from, to) {
    var flag = [false, false, false, false, false];
    if (to_pce != -1) {
        flag[0] = true;
    };

    //   if () {}
    if ((pce == 0 && from[1] == "2" && to[1] == "4") || (pce == 6 && from[1] == "7" && to[1] == "5")) {
        flag[1] = true;
    };

    if ((pce == 0 && from[1] == "7" && to[1] == "8") || (pce == 6 && from[1] == "2" && to[1] == "1")) {
        flag[2] = true;
    };

    if (flag[0] == "0" && (pce == 0 && from[1] == "5" && to[1] == "6" && ((files.indexOf(from[0]) == files.indexOf(to[0]) + 1) || (files.indexOf(from[0]) == files.indexOf(to[0]) - 1)) || (pce == 6 && from[1] == "4" && to[1] == "3" && ((files.indexOf(from[0]) == files.indexOf(to[0]) + 1) || (files.indexOf(from[0]) == files.indexOf(to[0]) - 1))))) {
        flag[0] = true;
        flag[3] = true;
    };

    if ((pce == 5 && from == "e1" && (to == "c1" || to == "g1")) || (pce == 11 && from == "e8" && (to == "c8" || to == "g8"))) {
        flag[4] = true;
    };

    if (flag == [false, false, false, false, false]) {
        console.log("normal move");
    };

    return flag;

}

function CheckLegality(pce, to_pce, from, to, flag) {
    if ((-1 < pce) && (pce < 6) && (-1 < to_pce) && (to_pce < 6)) {
        return false;
    } else{
        if ((5 < pce) && (pce < 12) && (5 < to_pce) && (to_pce < 12)) {
            return false;
        };
    };

    var x = PossibleMoves(pce, from);
    if (x.indexOf(SqStrtoId(to)) == -1) {
        return false;
    };

    return true;
}

function PossibleMoves(pce, square) {
    var possiblemoves = [];
    var sq = SqStrtoId(square);
    //king
    if ((pce == 5) || (pce == 11)) {
        if (7 < sq) {
            possiblemoves.push(sq - 8);
        }
        if (56 > sq) {
            possiblemoves.push(sq + 8);
        }
        if (sq % 8 != 0) {
            possiblemoves.push(sq - 1);
        }
        if (sq % 8 != 7) {
            possiblemoves.push(sq + 1);
        }
        if (7 < sq || sq % 8 != 0) {
            possiblemoves.push(sq - 9);
        }
        if (56 > sq || sq % 8 != 0) {
            possiblemoves.push(sq + 7);
        }
        if (7 < sq || sq % 8 != 7) {
            possiblemoves.push(sq - 7);
        }
        if (56 > sq || sq % 8 != 7) {
            possiblemoves.push(sq + 9);
        }
    }
    //knight
    if ((pce == 1) || (pce == 7)) {
        if ((48 > sq) && ((sq % 8) != 0)) {
            possiblemoves.push(sq + 15);
        }
        if ((15 < sq) && ((sq % 8) != 7)) {
            possiblemoves.push(sq - 15);
        }
        if ((48 > sq) && ((sq % 8) != 7)) {
            possiblemoves.push(sq + 17);
        }
        if ((15 < sq) && ((sq % 8) != 0)) {
            possiblemoves.push(sq - 17);
        }
        if ((56 > sq) && ((sq % 8) < 6)) {
            possiblemoves.push(sq + 10);
        }
        if ((7 < sq) && ((sq % 8) > 1)) {
            possiblemoves.push(sq - 10);
        }
        if ((56 > sq) && ((sq % 8) > 1)) {
            possiblemoves.push(sq + 6);
        }
        if ((7 < sq) && ((sq % 8) < 6)) {
            possiblemoves.push(sq - 6);
        }
    }
    //bishop
    if ((pce == 2) || (pce == 8)) {
        possiblemoves = possiblemoves.concat(
            LongRangeIterator(sq, 7),
            LongRangeIterator(sq, 9),
            LongRangeIterator(sq, -7),
            LongRangeIterator(sq, -9)
            );
    };
    //rook
    if ((pce == 3) || (pce == 9)) {
        possiblemoves = possiblemoves.concat(
            LongRangeIterator(sq, 1),
            LongRangeIterator(sq, 8),
            LongRangeIterator(sq, -1),
            LongRangeIterator(sq, -8)
        );
    };
    //queen
    if ((pce == 4) || (pce == 10)) {
        possiblemoves = possiblemoves.concat(
            LongRangeIterator(sq, 7),
            LongRangeIterator(sq, 9),
            LongRangeIterator(sq, -7),
            LongRangeIterator(sq, -9),
            LongRangeIterator(sq, 1),
            LongRangeIterator(sq, 8),
            LongRangeIterator(sq, -1),
            LongRangeIterator(sq, -8)
        );
    };
    //white pawn
    if (pce == 0) {
        if (GameBoard.PieceInSquare[sq+8] == -1) {
            possiblemoves.push(sq+8);
        };
        if (GameBoard.PieceInSquare[sq+7] > 5) {
            possiblemoves.push(sq+7);
        };
        if (GameBoard.PieceInSquare[sq+9] > 5) {
            possiblemoves.push(sq+9);
        };
        if (flag[1] == true && GameBoard.PieceInSquare[sq+16] == -1) {
            possiblemoves.push(sq+16);
        };
        if (flag[3] == true && GameBoard.PieceInSquare[sq+1]==6 && GameBoard.PieceInSquare[sq+9]==-1 /*&& GameBoard.HalfMoves[GameBoard.HalfMoves.length - 1]==*/) {
            possiblemoves.push(sq+9);
        };
        if (flag[3] == true && GameBoard.PieceInSquare[sq-1]==6 && GameBoard.PieceInSquare[sq+7]==-1 /*&& GameBoard.HalfMoves[GameBoard.HalfMoves.length - 1]==*/) {
            possiblemoves.push(sq+7);
        };
    };
    //black pawn
    if (pce == 6) {
        if (GameBoard.PieceInSquare[sq-8] == -1) {
            possiblemoves.push(sq-8);
        };
        if (GameBoard.PieceInSquare[sq-7] != -1 && GameBoard.PieceInSquare[sq-7] < 6) {
            possiblemoves.push(sq-7);
        };
        if (GameBoard.PieceInSquare[sq-9] != -1 && GameBoard.PieceInSquare[sq-9] < 6) {
            possiblemoves.push(sq-9);
        };
        if (flag[1] == true && GameBoard.PieceInSquare[sq-16] == -1) {
            possiblemoves.push(sq-16);
        };
        if (flag[3] == true && GameBoard.PieceInSquare[sq+1]==0 && GameBoard.PieceInSquare[sq-9]==-1 /*&& GameBoard.HalfMoves[GameBoard.HalfMoves.length - 1]==*/) {
            possiblemoves.push(sq-9);
        };
        if (flag[3] == true && GameBoard.PieceInSquare[sq-1]==0 && GameBoard.PieceInSquare[sq-7]==-1 /*&& (GameBoard.HalfMoves[GameBoard.HalfMoves.length - 1].slice(2,))==*/) {
            possiblemoves.push(sq-7);
        };
    };
    
    console.log(possiblemoves.map(x=>GameBoard.Square[x]));
    return possiblemoves;
}

function LongRangeIterator (sq, x) {
    var possiblemoves = [];
    for (i = 1; i < 8; i++) {
        var tsq = sq + x * i;
        if ((tsq > 64) || (tsq < 0) || (((tsq%8)==0) && ((sq%8)==7)) || (((sq%8)==0) && ((tsq%8)==7)) {
            break;
        };
        if (GameBoard.PieceInSquare[tsq] == -1) {
            possiblemoves.push(tsq);
            continue;
        } else {
            console.log(GameBoard.Square[tsq]);
            if (((GameBoard.PieceInSquare[tsq] > 5) && (GameBoard.Turn == "w")) || ((GameBoard.PieceInSquare[tsq] < 6) && (GameBoard.Turn == "b"))) {
                possiblemoves.push(tsq);
            };
            break;
        };        
    };
    return possiblemoves;
}

function Promote(pce, sq) {
    return;
}

function board_init() {
    BoardGenerator();
    GameBoard.Turn = INIT.Turn;
    GameBoard.PieceInSquare = INIT.PieceInSquare;
    PieceGenerator();
    PosId();
}

board_init();
