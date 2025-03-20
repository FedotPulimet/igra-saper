const rows = 10;
const cols = 10;
const minesCount = 10;
let board = [];
let gameOver = false;

function createBoard() {
    board = Array.from({ length: rows }, () => 
        Array.from({ length: cols }, () => ({ mine: false, revealed: false, adjacentMines: 0 }))
    );
    placeMines();
    calculateAdjacentMines();
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < minesCount) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            minesPlaced++;
        }
    }
}

function calculateAdjacentMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].mine) continue;
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = r + i;
                    const newCol = c + j;
                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol].mine) {
                        count++;
                    }
                }
            }
            board[r][c].adjacentMines = count;
        }
    }
}

function revealCell(row, col) {
    if (gameOver || board[row][col].revealed) return;
    board[row][col].revealed = true;
    const cellElement = document.getElementById(`cell-${row}-${col}`);
    cellElement.classList.add('revealed');

    if (board[row][col].mine) {
        cellElement.classList.add('mine');
        alert("Игра окончена! Вы попали на мину.");
        gameOver = true;
        return;
    }

    if (board[row][col].adjacentMines > 0) {
        cellElement.textContent = board[row][col].adjacentMines;
    } else {
        // Если нет соседних мин, открываем соседние клетки
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    revealCell(newRow, newCol);
                }
            }
        }
    }
}

function createGameBoard() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';
    createBoard();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-${r}-${c}`;
            cell.addEventListener('click', () => revealCell(r, c));
            gameContainer.appendChild(cell);
        }
    }
}

document.getElementById('restart-button').addEventListener('click', () => {
    gameOver = false;
    createGameBoard();
});

// Инициализация игры
createGameBoard();