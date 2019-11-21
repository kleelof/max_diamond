var gameMode = 'not_started';

var max = {
    x: 1,
    y: 1,
    dom: document.getElementById('max'),
    direction: null
};

var gameLoopSpeed = 1;
var maxsSpeed = 100; // for maxsSpeed and monsterSpeed, the higher the number, the slower they move.
var monsterSpeed = 150;

var monsters = [ makeMonster('monster_0'), makeMonster('monster_1'), makeMonster('monster_2') ];
var monsterPursuitAccuracy = 9; // each time a monster moves, this is the chance they will move toward max. Higher number is more accurate.
//todo: improve monster pursuit accuracy
var loopTimer, level, score, diamondCount, lives, loopCounter;

var gameBoard = document.getElementById('game_board');
var blankSquares = [];
var gameBoardPosition = {
    top: document.getElementById('game_board').offsetTop,
    left: document.getElementById('game_board').offsetLeft
};
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

start();

/* flow control */
function start(){
    document.getElementById('start_splash_screen').style.visibility = 'visible';
    resetGame();
    setTimeout(removeSplashScreen, 5000);
}

function removeSplashScreen(){
    document.getElementById('start_splash_screen').style.visibility = 'hidden';
    gotoNextLevel();
}

function resetGame(){
    level = 0;
    lives = 3;
    score = 0;

    importMapTemplate();
    drawScoreboard();
    addDiamonds();
    drawboard();
    addMonsters();
    drawMovingThing(max);
}

function gotoNextLevel(){
    level ++;
    monsterSpeed -= 10;

    addDiamonds();
    drawboard();
    resetLevel();
    displayLevelScreen();
}

function resetLevel(){
    addMonsters();
    max.x = 1;
    max.y = 1;
    drawMovingThing(max);
}

function displayLevelScreen(){
    document.getElementById('level_text').innerText = level;
    document.getElementById('level_screen').style.visibility = 'visible';
    setTimeout(getReadyToPlay, 3000);
}

function levelCleared(){
    stopLoopTimer();
    document.getElementById('level_cleared').style.visibility = 'visible';
    setTimeout(clearLevelCleared, 3000);
}

function clearLevelCleared(){
    document.getElementById('level_cleared').style.visibility = 'hidden';
    gotoNextLevel();
}

function getReadyToPlay(){
    document.getElementById('level_screen').style.visibility = 'hidden';
    setTimeout(startPlay, 500);
}

function startPlay(){
    startLoopTimer();
}

function gameOver(){
    document.getElementById('game_over').style.visibility = 'visible';
}

function gameLoop(){
    loopCounter ++;
    //if(loopCounter % maxsSpeed === 0 ) movemax();
    //todo: improve Maxs speed
    if(loopCounter % monsterSpeed === 0 ) moveMonsters();
}

function startLoopTimer(){
    gameMode='playing';
    loopCounter = 0;
    loopTimer = setInterval(gameLoop, gameLoopSpeed);
}

function stopLoopTimer(){
    clearInterval(loopTimer);
}

document.onkeydown = function(e){

    if (gameMode !== 'playing') return;
    if ( e.keyCode > 36 && e.keyCode < 41 ) max.direction = e.keyCode;
    movemax();
};

document.onkeyup = function(e){
    max.direction = null;
};

/* gameboard */
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

function getSquareInfo( movingThing, tX, tY ){
    var hasMonsters = monsters.filter(function( monster ){
        if ( monster.top === tY + movingThing.top && monster.left === tX + movingThing.left ) return monster;
    });

    return {
        canMoveTo: map[ tY + movingThing.y ][ tX + movingThing.x ] !== 1,
        hasDiamond: ( map[ tY + movingThing.y ][ tX + movingThing.x ] === 2 ||
            map[ tY + movingThing.y ][ tX + movingThing.x ] === 3 )?
                map[ tY + movingThing.y ][ tX + movingThing.x ]: 0,
        hasMonster: hasMonsters.length > 0,
        x: tX + movingThing.x,
        y: tY + movingThing.y,
        tX: tX,
        tY: tY
    };
}

function drawScoreboard(){
    document.getElementById("score").innerText = score;

    var livesPanelDOM = document.getElementById('lives');
    livesPanelDOM.innerHTML = "";
    for( var i = 0; i < lives; i ++ ){
        livesPanelDOM.innerHTML += `<img src="images/max.png" class="max_lives">`;
    }
}

/* diamonds */

function addDiamonds(){
    diamondCount = 0;
    blankSquares = [];
    for(var y = 0; y < map.length; y ++ ){
        for(var x = 0; x < map[0].length; x ++ ){
            if (map[y][x] !== 1) {
                map[y][x] = (Math.floor(Math.random() * 100) <5)? 3 : 2;
                diamondCount ++;
                blankSquares.push({x: x, y: y})
            }
        }
    }
}

function countDiamond( x, y ){
    score += (map[y][x] === 2)? 5:20;
    map[y][x] = 0;
    drawboard();
    drawScoreboard();

    diamondCount --;
    if ( diamondCount === 0 ) levelCleared();
}

/* monsters */
function makeMonster( id ){
    return {
        dom: document.getElementById(id),
        x: 0,
        y: 0,
        last_square: {
            x: 0,
            y: 0
        }
    }
}

function addMonsters(){console.log(blankSquares);
    var square;
    for( var i = 0; i < monsters.length; i ++ ){
        square = blankSquares[ Math.floor(Math.random() * blankSquares.length) ];
        monsters[i].y = square.y;
        monsters[i].x = square.x;
        drawMovingThing(monsters[i]);
    }
}

function moveMonsters(){
    var square;
    for( var i = 0; i < monsters.length; i ++ ) {
        monsters[i].last_square = { x: monsters[i].x, y: monsters[i].y };// prevents monsters from getting stuck when pursuing Max.
        square = getSquareForMonsterToMoveTo( monsters[i], Math.floor(Math.random() * 9) < monsterPursuitAccuracy);
        moveMovingThing(monsters[i], square.tX, square.tY);
    }
    if(shouldMaxDie()) maxHasDied();
}

function getSquareForMonsterToMoveTo( monster, moveTowardMax ){
    // get 4 compass point directions
    var possibleSquares = [
        getSquareInfo(monster, -1, 0),
        getSquareInfo(monster, 1, 0),
        getSquareInfo(monster, 0, -1),
        getSquareInfo(monster, 0, 1)
    ];

    // remove squares that cannot be moved to.
    possibleSquares = possibleSquares.filter(function(square){
        if(square.canMoveTo) return square;
    });

    if(moveTowardMax) {
        var possibleSquaresTowardMax = possibleSquares.filter(function (square) {
            if (max.x < square.x && square.x < monster.x && (monster.last_square.x !== square.x && monster.last_square.y !== square.y)) return square;
            if (max.x > square.x && square.x > monster.x && (monster.last_square.x !== square.x && monster.last_square.y !== square.y)) return square;
            if (max.y < square.y && square.y < monster.y && (monster.last_square.x !== square.x && monster.last_square.y !== square.y)) return square;
            if (max.y > square.y && square.y > monster.y && (monster.last_square.x !== square.x && monster.last_square.y !== square.y)) return square;
        });
        possibleSquares = (possibleSquaresTowardMax.length > 0)? possibleSquaresTowardMax:possibleSquares;
    }

    return possibleSquares[ Math.floor(Math.random() * possibleSquares.length)];
}


/* Max */
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

    var nextSquare = getSquareInfo(max, tX, tY);
    if(nextSquare.canMoveTo) moveMovingThing( max, tX, tY);
    if(nextSquare.hasMonster){
        maxHasDied();
        return;
    }
    if(nextSquare.hasDiamond > 0) countDiamond(max.x, max.y);
    if(shouldMaxDie()) maxHasDied();
}

function shouldMaxDie(){
    return monsters.filter(function(monster){
        if (monster.x === max.x && monster.y === max.y) return monster;
    }).length > 0;
}

function maxHasDied(){
    stopLoopTimer();
    gameMode = 'maxDied';
    lives --;
    drawScoreboard();

    if( lives > 0 ){
        resetLevel();
        displayLevelScreen();
    }else{
       gameOver();
    }
}

/* movingThings */
function moveMovingThing( movingThing, x, y){
    movingThing.y += y;
    movingThing.x += x;
    drawMovingThing(movingThing);
}

function drawMovingThing( movingThing ){
    movingThing.dom.style.top = gameBoardPosition.top + (movingThing.y * 40) + 'px';
    movingThing.dom.style.left = gameBoardPosition.left +  (movingThing.x * 40) + 'px';
}




