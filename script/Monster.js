class Monster extends MovingThing {
    constructor(gameboard, dom_id) {
        super('monster', document.getElementById(dom_id), gameboard);
        this.reset();
    }

    reset = () => {
        this.speed = 15;
        this.chaseAccuracy = 70;
        this.restartGameLoop();
    };

    upLevel = () => {
        this.chaseAccuracy += 5;
        this.speed -= 2;
        this.restartGameLoop();
    };

    setPosition = (grid_x, grid_y) => {
        super.setPosition(grid_x, grid_y);
        this.chooseDirection();
    };

    chooseDirection = () => {
        let availableSquares = this.gameBoard.getAvailableNeighborSquaresInfo(this.x, this.y);

        if (availableSquares.length > 1) {
            // don't go back in the same direction.
            availableSquares = availableSquares.filter(square => {
                return (!(this.direction == 38 && square[0] == 40) &&
                    !(this.direction == 40 && square[0] == 38) &&
                    !(this.direction == 37 && square[0] == 39) &&
                    !(this.direction == 39 && square[0] == 37));
            }, this);

            // move toward Max.
            if (Math.floor(Math.random() * 100) < this.chaseAccuracy) {
                let hero = this.gameBoard.hero;
                availableSquares = availableSquares.sort(square => {
                    return Math.abs((square[1].x * square[1].y) - (hero.x * hero.y));
                });
                availableSquares = [availableSquares[0]];
            }
        }

        let targetSquare = availableSquares[Math.floor(Math.random() * availableSquares.length)];
        switch (true) {
            case targetSquare[1].x < this.x:
                this.direction = 37;
                break;
            case targetSquare[1].x > this.x:
                this.direction = 39;
                break;
            case targetSquare[1].y < this.y:
                this.direction = 38;
                break;
            case targetSquare[1].y > this.y:
                this.direction = 40;
                break;
        }
    };

    moveLoop = () => {
        if (super.moveLoop()) {
            if (this._is_attacking_hero) {
                this.eventHandler.trigger('max_killed');
            } else if (this._is_on_square) {
                this.chooseDirection();
            }
        }
    };

    get _is_attacking_hero() {
        let hero = this.gameBoard.hero;
        let buffer = this.size / 3; // allows sprites to overlap a bit to create close call situations.
        return !(hero.sprite.right - buffer < this.sprite.left ||
            hero.sprite.left + buffer > this.sprite.right ||
            hero.sprite.bottom - buffer < this.sprite.top ||
            hero.sprite.top + buffer > this.sprite.bottom)
    }
}