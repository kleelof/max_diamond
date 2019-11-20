var gameBoard = document.getElementById('game_board');
var max = {
    piece: "max",
    left: 1,
    top: 1,
    dom: document.getElementById('max'),
    direction: null
};
var score = 0;
var gameMode = '';
var diamondCount = 0;
var gameBoardPosition = {
    top: document.getElementById('game_board').offsetTop,
    left: document.getElementById('game_board').offsetLeft
};

var gameLoopSpeed = 200;
var monsters = [];
var monstersDom = document.getElementById('monsters');
var level = 1;
var blankSquares = [];
var map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,1,1,0,1,0,1,0,1,1,0,0,0,0,1],
    [1,0,1,1,0,1,1,0,0,0,0,0,1,1,0,1,1,0,1],
    [1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,1,1,0,1],
    [1,0,1,1,0,1,1,0,0,0,0,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,1,0,1,0,1,0,1,1,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];// 1 = wall, 2 = blue diamond, 3 = rainbow diamond

var mapTemplate =
    "\t\t\t\t\t\t\tx\t\t\t\t\t\t\tx\t\t\n" +
    "\tx\tx\tx\t\tx\t\tx\t\tx\tx\tx\tx\t\tx\tx\t\n" +
    "\tx\t\t\t\tx\t\t\t\t\tx\t\tx\t\t\t\t\n" +
    "\tx\t\tx\t\tx\tx\t\tx\t\tx\t\tx\tx\tx\tx\t\n" +
    "\t\t\t\t\tx\t\t\t\t\t\t\tx\t\t\tx\t\n" +
    "x\tx\t\tx\t\tx\t\tx\tx\t\tx\t\tx\tx\t\t\t\n" +
    "\tx\tx\tx\t\t\t\t\tx\t\tx\t\t\t\t\tx\tx\n" +
    "\tx\t\t\t\tx\tx\t\t\t\tx\tx\t\tx\t\tx\t\n" +
    "\t\t\tx\t\t\tx\t\tx\t\tx\tx\t\tx\tx\t\t\n" +
    "\tx\tx\t\t\t\tx\t\tx\t\t\t\t\t\t\t\tx\n" +
    "\t\tx\t\tx\t\t\t\tx\t\tx\tx\tx\t\t\tx\t\n" +
    "\t\t\t\tx\t\tx\t\t\t\tx\t\t\t\tx\t\t\n" +
    "x\tx\tx\t\tx\t\tx\tx\tx\t\tx\tx\t\t\t\t\t\n" +
    "\t\t\t\tx\t\t\t\t\t\t\tx\t\tx\t\tx\t\n" +
    "\tx\tx\tx\tx\t\tx\tx\tx\tx\t\t\t\tx\t\t\t\n" +
    "\tx\tx\tx\tx\t\t\tx\t\tx\t\tx\tx\tx\t\tx\t\n" +
    "\t\t\t\t\tx\t\t\t\t\t\t\t\t\t\t\tx"
;

importMapTemplate();
resetBoard();
startPlay();

function startPlay(){
    drawboard();
    drawMovingThing(max);
    gameMode='playing';
    startTimer();
}

document.onkeydown = function(e){

    if (gameMode !== 'playing') return;
    if ( e.keyCode > 36 && e.keyCode < 41 ) max.direction = e.keyCode;
};

document.onkeyup = function(e){
    max.direction = null;
};

function importMapTemplate(){
    var template = mapTemplate.split("\n").join("\t");
    template = template.split("\t");
   var ptr = 0;
    for( var y = 1; y < 18; y ++ ){
        for( var x = 1; x < 18; x ++ ){
            map[y][x] = (template[ptr] === 'x')? 1 : 0;
            ptr ++;
        }
    }
}

function drawboard(){
    var boardHTML = "";
    for(var y = 0; y < map.length; y ++ ){
        for(var x = 0; x < map[0].length; x ++ ){
            switch(map[y][x]){
                case 1: boardHTML += "<div class='wall square'></div>"; break;
                case 0: boardHTML += "<div class='blank square'></div>"; break;
                case 2: boardHTML += "<div class='diamond_square square'><img src='images/blue_diamond.gif' class='blue_diamond'></div>"; break;
                case 3: boardHTML += "<div class='diamond_square square'><img src='images/rainbow_diamond.gif' class='rainbow_diamond'></div>"; break;
            }
        }
        boardHTML += "<br>";
    }
    gameBoard.innerHTML = boardHTML;
}

function resetBoard(){
    drawboard();
    addDiamonds();
    score = 0;
    drawScoreboard();
    addMonsters();
}

function addDiamonds(){
    diamondCount = 0;
    blankSquares = [];
    for(var y = 0; y < map.length; y ++ ){
        for(var x = 0; x < map[0].length; x ++ ){
            if (map[y][x] === 0) {
                map[y][x] = (Math.floor(Math.random() * 100) <5)? 3 : 2;
                diamondCount ++;
                blankSquares.push({x: x, y: y})
            }
        }
    }
}

function countDiamond( x, y ){
    var diamondType =
    score += (map[y][x] === 2)? 5:20;
    map[y][x] = 0;
    drawboard();
    drawScoreboard();
}

/* add 2 monsters + 1 for each level */
function addMonsters(){
    monstersDom.innerHTML = "";
    var square, newMonster;
    for( var i = 0; i < 2 + level; i ++ ){
        square = blankSquares[ Math.floor(Math.random() * blankSquares.length) ];
        monstersDom.innerHTML += "" +
            "<div id='monster_" + monsters.length + "' class='monster'>" +
            "<img src='images/monster_" + Math.floor(Math.random() * 2) + ".png'>" +
            "</div>";
        newMonster = {
            piece: 'monster',
            top: square.y,
            left: square.x,
            dom: document.getElementById('monster_' + monsters.length),
            direction: null
        };
        monsters.push(newMonster);
        drawMovingThing(newMonster);
    }
    console.log(monsters)
}

function moveMonsters(){
    var tX = 0;
    var tY = 0;
    var testedSquareValue = 1;
    var monster
    for( var i = 0; i < monsters.length; i ++ ){
        monster = monsters[i];
        while( testedSquareValue === 1 ){
            switch(Math.floor(Math.random() * 3)){// select a direction
                case 0: tY = -1; break; //up
                case 1: tX = -1; break; //left
                case 2: tY = 1; break; //down
                case 3: tX = 1; break; //right
            }

            testedSquareValue = testSquare(monsters[i], tX, tY)
        }
        //moveMovingThing(monsters[i], tX, tY );
    }
}

function drawScoreboard(){
    document.getElementById("score").innerText = score;
}

function movemax(){
    if ( max.direction === null ) return;

    var tX = 0;
    var tY = 0;

    switch(max.direction){
        case 38: tY = -1; break;
        case 39: tX = 1; break;
        case 40: tY = 1; break;
        case 37: tX = -1; break;
    }

    var nextSquare = testSquare(max, tX, tY);
    if (nextSquare === 0){
        moveMovingThing( max, tX, tY)
    }else if (nextSquare > 1 && nextSquare < 4){
        moveMovingThing( max, tX, tY);
        countDiamond( max.left, max.top );
    }
}

function moveMovingThing( movingThing, x, y){
    movingThing.top += y;
    movingThing.left += x;
    drawMovingThing(movingThing);
}

function drawMovingThing( movingThing ){
    movingThing.dom.style.top = gameBoardPosition.top + (movingThing.top * 40) + 'px';
    movingThing.dom.style.left = gameBoardPosition.left +  (movingThing.left * 40) + 'px';
}

function testSquare( movingThing, tX, tY ){
    return map[ tY + movingThing.top ][ tX + movingThing.left ];
}

function gameLoop(){
    movemax();
    moveMonsters();
}

function startTimer(){
    if( gameMode === "playing" ) setInterval(gameLoop, gameLoopSpeed);
}

