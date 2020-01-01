let mapTemplate =
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

let scoreBoard = new ScoreBoard(document.getElementById("score_board"));
let gameBoard = new GameBoard();
gameBoard.eventHandler.add('diamond_found', value => {
    scoreBoard.score += value;
});
gameBoard.eventHandler.add('max_killed', () => {
    this.maxDied()
});
gameBoard.eventHandler.add('level_cleared', () => {
    this.levelCleared()
});

start();

function start() {
    document.getElementById('game_over').style.visibility = 'hidden';
    document.getElementById('start_splash_screen').style.visibility = 'visible';
    resetGame();
    setTimeout(function () {
        document.getElementById('start_splash_screen').style.visibility = 'hidden';
        gotoNextLevel();
    }, 7000);
}

function gotoNextLevel() {
    gameBoard.setupNextLevel();
    displayLevel();
}

function displayLevel() {
    document.getElementById('level_text').innerText = gameBoard.level;
    document.getElementById('level_screen').style.visibility = 'visible';
    setTimeout(function () {
        document.getElementById('level_screen').style.visibility = 'hidden';
        setTimeout(function () { // a short pause before the game play begins.
            gameBoard.start();
        }, 500);
    }, 3000);
}

function levelCleared() {
    document.getElementById('level_cleared').style.visibility = 'visible';
    setTimeout(function () {
        document.getElementById('level_cleared').style.visibility = 'hidden';
        gotoNextLevel();
    }, 3000);
}

function resetGame() {
    scoreBoard.reset();
    gameBoard.setMap(mapTemplate);
    gameBoard.reset();
}

function maxDied() {
    if (scoreBoard.decrementLives()) {
        document.getElementById('game_over').style.visibility = 'visible';
    } else {
        gameBoard.resetLevel();
        displayLevel();
    }
}











