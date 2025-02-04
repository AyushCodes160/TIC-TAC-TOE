// Select all required elements
const selectBox = document.querySelector(".select-box"),
    selectBtnX = selectBox.querySelector(".options .playerX"),
    selectBtnO = selectBox.querySelector(".options .playerO"),
    playBoard = document.querySelector(".play-board"),
    players = document.querySelector(".players"),
    allBox = document.querySelectorAll("section span"),
    resultBox = document.querySelector(".result-box"),
    wonText = resultBox.querySelector(".won-text"),
    replayBtn = resultBox.querySelector("button");

// Variables for game state
let playerXIcon = "fas fa-times"; // FontAwesome icon class for 'X'
let playerOIcon = "far fa-circle"; // FontAwesome icon class for 'O'
let playerSign = "X";
let runBot = true;

// Initialize the game
window.onload = () => {
    allBox.forEach((box, index) => {
        box.setAttribute("data-index", index);
        box.addEventListener("click", () => clickedBox(box));
    });
};

// Player X selection
selectBtnX.onclick = () => {
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
};

// Player O selection
selectBtnO.onclick = () => {
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
    players.classList.add("active", "player");
};

// Handle user click
function clickedBox(element) {
    if (players.classList.contains("player")) {
        playerSign = "O";
        element.innerHTML = `<i class="${playerOIcon}"></i>`;
        players.classList.remove("active");
    } else {
        element.innerHTML = `<i class="${playerXIcon}"></i>`;
        players.classList.add("active");
    }
    element.setAttribute("id", playerSign);
    element.style.pointerEvents = "none";
    playBoard.style.pointerEvents = "none";
    selectWinner();

    if (runBot) {
        setTimeout(() => {
            bot();
        }, 500);
    }
}

// Bot's move using Minimax Algorithm
function bot() {
    const availableBoxes = [...allBox].filter(box => !box.id);
    if (availableBoxes.length === 0) return;

    let bestMove;
    let bestScore = -Infinity;
    const botSign = players.classList.contains("player") ? "X" : "O";
    const playerSignTemp = botSign === "X" ? "O" : "X";

    availableBoxes.forEach(box => {
        box.id = botSign;
        const score = minimax(false, botSign, playerSignTemp);
        box.id = "";
        if (score > bestScore) {
            bestScore = score;
            bestMove = box;
        }
    });

    if (bestMove) {
        bestMove.innerHTML = botSign === "X" ? `<i class="${playerXIcon}"></i>` : `<i class="${playerOIcon}"></i>`;
        bestMove.setAttribute("id", botSign);
        bestMove.style.pointerEvents = "none";
        selectWinner();
        playBoard.style.pointerEvents = "auto";
        players.classList.toggle("active");
    }
}

function minimax(isMaximizing, botSign, playerSign) {
    const winner = checkWinner();
    if (winner === botSign) return 1;
    if (winner === playerSign) return -1;
    if ([...allBox].every(box => box.id)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        [...allBox].forEach(box => {
            if (!box.id) {
                box.id = botSign;
                const score = minimax(false, botSign, playerSign);
                box.id = "";
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        [...allBox].forEach(box => {
            if (!box.id) {
                box.id = playerSign;
                const score = minimax(true, botSign, playerSign);
                box.id = "";
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (allBox[a].id && allBox[a].id === allBox[b].id && allBox[a].id === allBox[c].id) {
            return allBox[a].id;
        }
    }
    return null;
}

function selectWinner() {
    const winner = checkWinner();
    if (winner) {
        runBot = false;
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
            wonText.innerHTML = `Player <p>${winner}</p> won the game!`;
        }, 700);
    } else if ([...allBox].every(box => box.id)) {
        runBot = false;
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
            wonText.textContent = "Match has been drawn!";
        }, 700);
    }
}

// Replay button click event
replayBtn.onclick = () => {
    window.location.reload();
};
