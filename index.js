const canvas = document.getElementById('myCanvas');
const ui = document.getElementById('ui');
const ctx = canvas.getContext('2d');
let turn = "X"; 
let topArray = [' ', ' ', ' '];
let middleArray = [' ', ' ', ' '];
let bottomArray = [' ', ' ', ' '];
let gameOver = false; // Flag to indicate if the game is over

class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items.shift();
    }

    front() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items[0];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    printQueue() {
        console.log(this.items.join(", "));
    }
}

const queue = new Queue();
ui.style.display='none';
drawBoard();

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBoard() {
    clearCanvas();
    ctx.strokeStyle = 'whitesmoke';
    ctx.lineWidth = 2;

    const thirdWidth = canvas.width / 3;
    const thirdHeight = canvas.height / 3;

    // Draw vertical lines
    for (let i = 1; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(thirdWidth * i, 0);
        ctx.lineTo(thirdWidth * i, canvas.height);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let i = 1; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(0, thirdHeight * i);
        ctx.lineTo(canvas.width, thirdHeight * i);
        ctx.stroke();
    }

    let board = [topArray, middleArray, bottomArray];

    function drawX(x, y, fade) {
        const padding = thirdWidth * 0.1;
        ctx.strokeStyle = fade;
        ctx.beginPath();
        ctx.moveTo(x + padding, y + padding);
        ctx.lineTo(x + thirdWidth - padding, y + thirdHeight - padding);
        ctx.moveTo(x + thirdWidth - padding, y + padding);
        ctx.lineTo(x + padding, y + thirdHeight - padding);
        ctx.stroke();
    }

    function drawO(x, y, fade) {
        const radius = (thirdWidth / 2) - (thirdWidth * 0.3);
        ctx.strokeStyle = fade;
        ctx.beginPath();
        ctx.arc(x + thirdWidth / 2, y + thirdHeight / 2, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // Loop through the board to draw Xs and Os
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const x = col * thirdWidth;
            const y = row * thirdHeight;
            let color = 'whitesmoke';
            
            // Get the front coordinates from the queue
            const [queueRow, queueCol] = queue.front();
    
            if (board[row][col] === 'X') {
                // Compare the individual row and column values
                if (queue.size() === 6 && row === queueRow && col === queueCol) {
                    color = 'red';
                } else {
                    color = 'whitesmoke';
                }
                drawX(x, y, color);
            } else if (board[row][col] === 'O') {
                // Compare the individual row and column values
                if (queue.size() === 6 && row === queueRow && col === queueCol) {
                    color = 'red';
                } else {
                    color = 'whitesmoke';
                }
                drawO(x, y, color);
            }
        }
    }
    

    if (gameOver) {
        ui.style.display='flex';
    }
}

canvas.addEventListener('click', function(event) {
    if(!gameOver){
        const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cellSize = canvas.width / 3;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);

    //console.log('Grid position: ', row, col);
    switch (row) {
        case 0:
            if (topArray[col] === ' ') {
                topArray[col] = turn;
                queueHandler(row, col);
                flipTurn();
            }
            break;
        case 1:
            if (middleArray[col] === ' ') {
                middleArray[col] = turn;
                queueHandler(row, col);
                flipTurn();
            }
            break;
        case 2:
            if (bottomArray[col] === ' ') {
                bottomArray[col] = turn;
                queueHandler(row, col);
                flipTurn();
            }
            break;
        default:
            break;
    }
    drawBoard();

    setTimeout(() => {
        const win = checkForWin();
        if (win === true) {
            gameOver = true;
            drawBoard();
        }
    }, 100); // Adjust the delay if necessary
    }
});

function flipTurn() {
    if (turn === "X") {
        turn = "O";
    } else if (turn === "O") {
        turn = "X";
    } else {
        console.error("Turn has value of " + turn);
    }
}

function queueHandler(row, col) {
    queue.enqueue([row, col]);
    if (queue.size() > 6) {
        const removed = queue.dequeue();
        console.log(removed[0], removed[1]);
        switch (removed[0]) {
            case 0:
                topArray[removed[1]] = ' ';
                break;
            case 1:
                middleArray[removed[1]] = ' ';
                break;
            case 2:
                bottomArray[removed[1]] = ' ';
                break;
            default:
                break;
        }
    }
}

function checkForWin() {
    const board = [topArray, middleArray, bottomArray];

    // Check rows
    for (let row = 0; row < 3; row++) {
        if (board[row][0] !== ' ' && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
            return true;
        }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
        if (board[0][col] !== ' ' && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
            return true;
        }
    }

    // Check diagonals
    if (board[0][0] !== ' ' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return true;
    }
    if (board[0][2] !== ' ' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return true;
    }

    return false;
}

function resetGame() {
    topArray = [' ', ' ', ' '];
    middleArray = [' ', ' ', ' '];
    bottomArray = [' ', ' ', ' '];
    turn = "X";
    gameOver = false;
    queue.items = [];
    ui.style.display='none';
    drawBoard();
}

function quitGame(){
    window.close();
}
