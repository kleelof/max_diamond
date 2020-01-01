class GameBoard {
    is_active = false;
    eventHandler = new EventHandler();
    level = 0;
    hero = null;
    monsters = null;
    boardDOM = null;
    diamondCount = 0;
    blankSquares = 0;
    map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    constructor() {

        this.boardDOM = document.getElementById('game_board');

        this.hero = new Hero(this);
        this.hero.eventHandler.add('diamond_found', (value) => {
            this.eventHandler.trigger('diamond_found', value);

            this.map[this.hero.y][this.hero.x] = 0;
            this.drawBoard();

            this.diamondCount--;
            if (this.diamondCount === 0) {
                this.is_active = false;
                this.eventHandler.trigger('level_cleared')
            }
        });

        this.monsters = [
            this.createMonster('monster_0'),
            this.createMonster('monster_1'),
            this.createMonster('monster_2')
        ];
    }

    setMap = (mapTemplate) => {
        this.blankSquares = [];

        let template = mapTemplate.split("\n").join("\t");
        template = template.split("\t");
        let ptr = 0;
        for (let y = 1; y < 18; y++) {
            this.map.push([]);
            for (let x = 1; x < 18; x++) {
                this.map[y][x] = (template[ptr] === 'x') ? 1 : 0;
                if (this.map[y][x] === 0) this.blankSquares.push({x: x, y: y});
                ptr++;
            }
        }
    };

    reset = () => {
        this.level = 0;
        this.hero.reset();
        this.addDiamonds();
        this.drawBoard();

        this.monsters.forEach(function (monster) {
            monster.reset();
        })
    };

    setupNextLevel = () => {
        this.level++;
        this.addDiamonds();
        this.drawBoard();
        this.resetLevel();

        this.monsters.forEach(function (monster) {
            monster.upLevel()
        })
    };

    resetLevel = () => {
        this.hero.reset();

        let square;
        this.monsters.forEach(monster => {
            square = this.blankSquares[Math.floor(Math.random() * this.blankSquares.length)];
            while (square.x < 10 && square.y < 10) square = this.blankSquares[Math.floor(Math.random() * this.blankSquares.length)];
            monster.setPosition(square.x, square.y);
        }, this);
    };

    addDiamonds = () => {
        this.diamondCount = 0;
        this.blankSquares.forEach(square => {
            this.map[square.y][square.x] = (Math.floor(Math.random() * 100) < 5) ? 3 : 2; // 3 == rainbow diamond, 2 == blue diamond
            this.diamondCount++;
        }, this);
    };

    drawBoard = () => {
        let boardHTML = "";
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[0].length; x++) {
                switch (this.map[y][x]) {
                    case 1:
                        boardHTML += "<div class='wall square'></div>";
                        break;
                    case 0:
                        boardHTML += "<div class='blank square'></div>";
                        break;
                    case 2:
                        boardHTML += "<div class='diamond_square square'><img src='images/blue_diamond.gif' class='blue_diamond'></div>";
                        break;
                    case 3:
                        boardHTML += "<div class='diamond_square square'><img src='images/rainbow_diamond.gif' class='rainbow_diamond'></div>";
                        break;
                }
            }
            boardHTML += "<br>";
        }
        this.boardDOM.innerHTML = boardHTML;
    };

    createMonster = (dom_id) => {
        let monster = new Monster(this, dom_id);
        monster.eventHandler.add('max_killed', () => {
            this.is_active = false;
            self = this;
            setTimeout(function () { // short pause so player can see Max died.
                self.eventHandler.trigger('max_killed');
            }, 1000);
        });
        return monster;
    };

    start() {
        this.is_active = true;
    }

    stop() {
        this.is_active = false;
    }

    getNeighboringSquaresInfo = (map_x, map_y) => {
        return {
            39: this.getSquareInfo(map_x + 1, map_y),
            37: this.getSquareInfo(map_x - 1, map_y),
            40: this.getSquareInfo(map_x, map_y + 1),
            38: this.getSquareInfo(map_x, map_y - 1)
        }
    };

    getAvailableNeighborSquaresInfo = (map_x, map_y) => {
        let neighbors = this.getNeighboringSquaresInfo(map_x, map_y);
        return neighbors = Object.entries(neighbors).filter(neighbor_info => {
            return neighbor_info[1].canMoveTo;
        });
    };

    getSquareInfo = (map_x, map_y) => {
        return {
            x: map_x,
            y: map_y,
            canMoveTo: this.map[map_y][map_x] !== 1,
            diamondValue: (this.map[map_y][map_x] === 2 || this.map[map_y][map_x] === 3) ?
                this.map[map_y][map_x] : 0
        }
    }
}