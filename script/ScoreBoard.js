class ScoreBoard {
    scoreDOM = null;
    livesDOM = null;
    _lives = 0;
    _score = 0;

    set lives(_lives) {
        this._lives = _lives;

        this.livesDOM.innerHTML = "";
        for (let i = 0; i < this._lives; i++) this.livesDOM.innerHTML += `<img src="images/max.png" class="max_lives">`;
    }

    get lives() {
        return this._lives;
    }

    set score(_score) {
        this._score = _score;
        this.scoreDOM.innerText = _score;
    }

    get score() {
        return this._score;
    }

    constructor() {
        this.scoreDOM = document.getElementById('score');
        this.livesDOM = document.getElementById('lives')
    }

    reset = () => {
        this.score = 0;
        this.lives = 3;
    };

    decrementLives = () => {
        this.lives--;
        return this.lives === 0;
    };

}