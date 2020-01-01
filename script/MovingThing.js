class MovingThing {

    currentSquare = null;
    eventHandler = new EventHandler();
    characterType = '';
    speed = 0;
    dom = null;
    gameBoard = null;
    step = 2;
    direction = 0;
    gameLoopInterval = null;
    size = 40;
    x = 0;
    y = 0;
    sprite = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };

    get _is_on_square() {
        return (this.sprite.left % this.size === 0 && this.sprite.top % this.size === 0)
    }

    constructor(characterType, dom, gameboard) {
        this.characterType = characterType;
        this.dom = dom;
        this.gameBoard = gameboard;
    }

    moveLoop(){
        if (!this.gameBoard.is_active || this.direction === 0) return false;

        switch (this.direction) {
            case 37:
                this.sprite.left -= this.step;
                break;
            case 40:
                this.sprite.top += this.step;
                break;
            case 39:
                this.sprite.left += this.step;
                break;
            case 38:
                this.sprite.top -= this.step;
                break;
        }

        if (this._is_on_square) {
            this.x = this.sprite.left / this.size;
            this.y = this.sprite.top / this.size;
        }

        this.drawSprite();
        return true;
    };

    setPosition(grid_x, grid_y){
        this.x = grid_x;
        this.y = grid_y;
        this.currentSquare = this.gameBoard.getSquareInfo(grid_x, grid_y);
        this.sprite.top = grid_y * this.size;
        this.sprite.left = grid_x * this.size;
        this.direction = 0;
        this.drawSprite();
    };

    restartGameLoop = () => {
        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
        let self = this;
        this.gameLoopInterval = setInterval(function () {
            self.moveLoop()
        }, this.speed);
    };

    drawSprite = () => {
        this.sprite.bottom = this.sprite.top + this.size;
        this.sprite.right = this.sprite.left + this.size;

        this.dom.style.top = this.gameBoard.boardDOM.offsetTop + this.sprite.top + 'px';
        this.dom.style.left = this.gameBoard.boardDOM.offsetLeft + this.sprite.left + 'px';
    }
}



