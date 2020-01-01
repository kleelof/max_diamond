class Hero extends MovingThing {
    constructor(gameboard) {
        super('hero', document.getElementById('max'), gameboard);

        this.requestedDirection = 0;

        let self = this;
        document.onkeydown = function (e) {
            if (e.keyCode > 36 && e.keyCode < 41) self.requestedDirection = e.keyCode;
        };

        this.reset();
    }

    reset = () => {
        this.speed = 12;
        this.direction = this.requestedDirection = 0;
        this.setPosition(1, 1);
        this.restartGameLoop();
    };

    moveLoop = () => {
        if (this._is_on_square) {
            let availableDirections = this.gameBoard.getAvailableNeighborSquaresInfo(this.x, this.y).filter(square => {
                return square[0] == this.requestedDirection;
            }, this);

            if (availableDirections.length > 0) {
                this.direction = this.requestedDirection;
            } else {
                this.direction = 0;
            }
        } else {
            if (
                (this.sprite.left % this.size !== 0 &&
                    ((this.direction === 37 || this.direction === 39 || this.direction === 0) &&
                        (this.requestedDirection === 37 || this.requestedDirection === 39))
                ) ||
                (this.sprite.top % this.size !== 0 &&
                    ((this.direction === 38 || this.direction === 40 || this.direction === 0) &&
                        (this.requestedDirection === 38 || this.requestedDirection === 40))
                )
            ) {
                this.direction = this.requestedDirection;
            }
        }


        if (super.moveLoop()) {
            if (this._is_on_square) {
                let square = this.gameBoard.getSquareInfo(this.x, this.y);
                if (square.diamondValue) this.eventHandler.trigger('diamond_found', square.diamondValue)
            }
        }
    }

}