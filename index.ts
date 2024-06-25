enum Direction {
    Right,
    Left,
    Up,
    Down
}

enum CellType {
    Empty = -1,
    Food = -2,
    Obsticle = -3
}

const gameSpeed = 450;

const gridWidth = 20;
const grid: (CellType | number)[][] = new Array<number[]>(gridWidth);
for (let i = 0; i < gridWidth; i++) {
    grid[i] = (new Array(gridWidth)).fill(CellType.Empty);
}

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const canvasWidth = canvas.width;

const ctx = canvas.getContext("2d");
const cellSize = canvasWidth / gridWidth;

let snakeDirection: Direction = Direction.Down;
const snake: [[number, number]] = [[0, 0]]
grid[0][0] = 0;

let numObsticles = 0;

const food = [Math.floor(Math.random() * gridWidth), Math.floor(Math.random() * gridWidth)];
grid[food[0]][food[1]] = CellType.Food;

const cellColors = new Map<CellType, string>([
    [CellType.Empty, "#e1e1e1"],
    [CellType.Food, "#4fc054"],
    [CellType.Obsticle, "#424242"]
]);

function paint() {
    ctx.fillStyle = "#858585";
    ctx.fillRect(0, 0, canvasWidth, canvasWidth);

    for (let row = 0; row < gridWidth; row++) {
        for (let col = 0; col < gridWidth; col++) {
            const cellType = grid[row][col];
            const y = col * cellSize;
            const x = row * cellSize;
            ctx.fillStyle = cellType >= 0 ? `hsl(${cellType * 5}, 100%, 50%)` : cellColors.get(cellType);
            ctx.lineWidth = 2;

            if (cellType >= 0) {
                ctx.fillRect(x, y, cellSize, cellSize);
            } else {
                ctx.fillRect(x + 2, y + 2, cellSize - 2, cellSize - 2);
            }
        }
    }
}

function generateRandomEmptyPoint() {
    const numEmptyCells = gridWidth * gridWidth - snake.length - numObsticles;
    const random = Math.floor(Math.random() * numEmptyCells);
    let count = 1;
    for (let row = 0; row < gridWidth; row++) {
        for (let col = 0; col < gridWidth; col++) {
            if (grid[row][col] === CellType.Empty) {
                if (random > numEmptyCells - count) {
                    return [row, col];
                }
                count++;
            }
        }
    }

}

document.onkeydown = function (e) {
    if (e.key === 'ArrowLeft') {
        snakeDirection = Direction.Left;
    } else if (e.key === 'ArrowUp') {
        snakeDirection = Direction.Up;
    } else if (e.key === 'ArrowRight') {
        snakeDirection = Direction.Right;
    } else if (e.key === 'ArrowDown') {
        snakeDirection = Direction.Down;
    }

    e.preventDefault();
    tick();
    // clearInterval(interval);
    // interval = setInterval(tick, gameSpeed);
}

let gamePlaying = true;
function tick() {
    if (!gamePlaying) {
        // clearInterval(interval);

        const gameOver = document.getElementById("gameOver");
        gameOver.style.display = "block";
        return;
    }

    let head = snake[0];
    let newHead: [number, number];
    if (snakeDirection === Direction.Right) {
        const nextCell = grid[head[0] + 1][head[1]];
        if (snake[0][0] === gridWidth - 1 || nextCell === CellType.Obsticle) {
            gamePlaying = false;
        }
        newHead = [head[0] + 1, head[1]];
    } else if (snakeDirection === Direction.Left) {
        const nextCell = grid[head[0] - 1][head[1]];
        if (snake[0][0] === 0 || nextCell === CellType.Obsticle) {
            gamePlaying = false;
        }
        newHead = [head[0] - 1, head[1]];
    } else if (snakeDirection === Direction.Up) {
        const nextCell = grid[head[0]][head[1] - 1];
        if (snake[0][1] === 0 || nextCell === CellType.Obsticle) {
            gamePlaying = false;
        }
        newHead = [head[0], head[1] - 1];
    } else if (snakeDirection === Direction.Down) {
        const nextCell = grid[head[0]][head[1] + 1];
        if (snake[0][1] === gridWidth - 1 || nextCell === CellType.Obsticle) {
            gamePlaying = false;
        }
        newHead = [head[0], head[1] + 1];
    }

    if (newHead[0] === food[0] && newHead[1] === food[1]) {
        const [foodX, foodY] = generateRandomEmptyPoint();
        food[0] = foodX;
        food[1] = foodY;
        grid[foodX][foodY] = CellType.Food;

        if (Math.random() < (gridWidth) / (numObsticles + 1)) {
            const [obsticleX, obsticleY] = generateRandomEmptyPoint();

            if (
                obsticleX !== newHead[0] - 1 &&
                obsticleX !== newHead[0] + 1 &&
                obsticleY !== newHead[1] - 1 &&
                obsticleY !== newHead[1] + 1
            ) {
                grid[obsticleX][obsticleY] = CellType.Obsticle;
                numObsticles++;
            }
        }
    } else {
        const [tailX, tailY] = snake.pop();
        grid[tailX][tailY] = CellType.Empty;
    }

    // Only check if the snake is running into itself after the tail has moved forward
    if (grid[newHead[0]][newHead[1]] >= 0) {
        gamePlaying = false;
    }

    snake.forEach(([x, y]) => {
        grid[x][y]++;
    });
    snake.unshift(newHead);
    grid[newHead[0]][newHead[1]] = 0;

    paint();
}

paint()
// let interval = setInterval(tick, gameSpeed);