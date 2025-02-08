function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = Cell();
    }
  }

  const getBoard = () => board;

  const placeToken = (row, column, player) => {
    if (board[row][column].getValue() !== 0) {
      console.log("Cell is already taken!");
      return false;
    }
    board[row][column].addToken(player);
    return true;
  };

  return { getBoard, placeToken };
}

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

function checkWinner(board) {
  const rows = board.length;

  // Check rows and columns
  for (let i = 0; i < rows; i++) {
    if (
      board[i][0].getValue() !== 0 &&
      board[i][0].getValue() === board[i][1].getValue() &&
      board[i][1].getValue() === board[i][2].getValue()
    ) {
      return board[i][0].getValue();
    }

    if (
      board[0][i].getValue() !== 0 &&
      board[0][i].getValue() === board[1][i].getValue() &&
      board[1][i].getValue() === board[2][i].getValue()
    ) {
      return board[0][i].getValue();
    }
  }

  // Check diagonals
  if (
    board[0][0].getValue() !== 0 &&
    board[0][0].getValue() === board[1][1].getValue() &&
    board[1][1].getValue() === board[2][2].getValue()
  ) {
    return board[0][0].getValue();
  }

  if (
    board[0][2].getValue() !== 0 &&
    board[0][2].getValue() === board[1][1].getValue() &&
    board[1][1].getValue() === board[2][0].getValue()
  ) {
    return board[0][2].getValue();
  }

  return null;
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
  const board = Gameboard();
  const players = [
    { name: playerOneName, token: 1 },
    { name: playerTwoName, token: 2 },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const playRound = (row, column) => {
    const success = board.placeToken(row, column, activePlayer.token);
    if (!success) {
      console.log("Cell already taken. Try again!");
      return;
    }

    const winner = checkWinner(board.getBoard());
    if (winner) {
      return winner;
    }

    switchPlayerTurn();
    return null;
  };

  const getActivePlayer = () => activePlayer;
  const getBoard = () => board.getBoard();

  return { playRound, getActivePlayer, getBoard };
}

function ScreenController() {
  const game = GameController("Player 1", "Player 2");
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const winnerDiv = document.querySelector(".winner");

  const updateScreen = () => {
    boardDiv.textContent = "";
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn`;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.textContent = cell.getValue() === 1 ? "X" : cell.getValue() === 2 ? "O" : "";
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;
        boardDiv.appendChild(cellButton);
      });
    });
  };

  const clickHandlerBoard = (e) => {
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    if (!row || !column) return;

    const winner = game.playRound(+row, +column);
    if (winner) {
      winnerDiv.textContent = `${game.getActivePlayer().name} wins!`;
      boardDiv.removeEventListener("click", clickHandlerBoard);
      return;
    }

    updateScreen();
  };

  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

ScreenController();
