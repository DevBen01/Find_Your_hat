const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this._field = field;
    }

    print() {
        this._field.forEach(row => {
            console.log(row.join(" "))
        })
    }

    setPath(direction) {
        const [first, second] = findLastPathIndex(this._field)
        const dir = direction.toUpperCase();
        const rows = this._field.length;
        const columns =this._field[0].length;
        if (dir === 'U') {
            if (first - 1 < 0) {
                return 'dead'
            }
            if (checkPositionCharacter(this._field[first - 1][second]) === 'play') {
                this._field[first - 1][second] = pathCharacter;
            }
            return checkPositionCharacter(this._field[first - 1][second])
        } else if (dir === 'D') {
            if (first + 1 > rows) {
                return 'dead'
            }
            if (checkPositionCharacter(this._field[first + 1][second]) === 'play') {
                this._field[first + 1][second] = pathCharacter;
            }
            return checkPositionCharacter(this._field[first + 1][second])
        } else if (dir === 'L') {
            if(second - 1 < 0){
                return 'dead'
            }
            if (checkPositionCharacter(this._field[first][second - 1]) === 'play') {
                this._field[first][second - 1] = pathCharacter;
            }
            return checkPositionCharacter(this._field[first][second - 1])
        } else if (dir === 'R') {
            if(second + 1 > columns){
                return 'dead'
            }
            if (checkPositionCharacter(this._field[first][second + 1]) === 'play') {
                this._field[first][second + 1] = pathCharacter;
            }
            return checkPositionCharacter(this._field[first][second + 1])
        } else {
            console.log('Invalid direction entered')
            return 'play';
        }
    }

    static generateField(width, height) {
        let emptyField = [...Array(height)].map(x => Array(width).fill(fieldCharacter));
        let hatRow = Math.floor(Math.random() * height);
        let hatCol = Math.floor(Math.random() * width);
        if (hatRow > 0) {
            hatRow -= 1;
        }
        if (hatCol > 0) {
            hatCol -= 1;
        }
        emptyField[hatRow][hatCol] = hat;
        emptyField[0][0] = pathCharacter;
        let countOfHoles = Math.floor(Math.random() * (height * width) / 3)
        let count = 0
        while (count < countOfHoles) {
            let row = Math.floor(Math.random() * height);
            let col = Math.floor(Math.random() * width);
            if (emptyField[row][col] === fieldCharacter) {
                emptyField[row][col] = hole;
                count++;
            }
        }
        return emptyField;
    }
}

function playGame() {
    const width = Math.floor(Math.random() * (20 - 5) + 5);
    const height = Math.floor(Math.random() * (20 - 5) + 5);
    const field = new Field(Field.generateField(width, height))
    let gameStatus = 'play';
    while (gameStatus === 'play') {
        field.print();
        console.log("\n U = UP,D = DOWN, L = LEFT, R = RIGHT")
        const direction = prompt("Which direction will you go? (U / D / L / R)")
        gameStatus = field.setPath(direction);
    }
    if (gameStatus === 'win') {
        console.log("\n Congratulations you won!")
    } else if(gameStatus === 'dead') {
        console.log("\n You Died!")
    }
}

function findLastPathIndex(field) {
    let rowIndex = 0
    let index = [0, 0]
    field.forEach(row => {
        if (row.includes(pathCharacter)) {
            index = [rowIndex, row.lastIndexOf(pathCharacter)]
        }
        rowIndex++;
    })
    return index;
}

function checkPositionCharacter(character) {
    if(character === hole) {
        return 'dead'
    }
    else if(character === hat) {
        return 'win';
    } else {
        return 'play'
    }

}

playGame();