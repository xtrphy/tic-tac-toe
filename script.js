class Gameboard {
  constructor() {
    this.rows = 3;
    this.columns = 3;
    this.board = [];

    for (let i = 0; i < this.rows; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.columns; j++) {
        this.board[i][j] = new Cell();
      }
    }
  }

  getBoard() {
    return this.board;
  }

  placeToken(row, column, player) {
    if (this.board[row][column].getValue() !== 0) {
      console.log("Cell is already taken!");
      return false;
    }
    this.board[row][column].addToken(player);
    return true;
  };
}


class Cell {
  #value = 0;

  addToken(player) {
    this.#value = player;
  };

  getValue() {
    return this.#value;
  }
}


function checkWinner(board) {
  const rows = board.length;

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

  const isDraw = board.every((row) => row.every((cell) => cell.getValue() !== 0));
  if (isDraw) {
    return "draw";
  }

  return null;
}


class GameController {
  #board;
  #players;
  #activePlayer;

  constructor(playerOneName = "Player One", playerTwoName = "Player Two") {
    this.#board = new Gameboard();
    this.#players = [
      { name: playerOneName, token: 1 },
      { name: playerTwoName, token: 2 },
    ];

    this.#activePlayer = this.#players[0];
  }

  #switchPlayerTurn() {
    this.#activePlayer = this.#activePlayer === this.#players[0] ? this.#players[1] : this.#players[0];
  };

  playRound(row, column) {
    const success = this.#board.placeToken(row, column, this.#activePlayer.token);
    if (!success) {
      return;
    }

    const winner = checkWinner(this.#board.getBoard());
    if (winner) {
      return winner;
    }

    this.#switchPlayerTurn();
  };

  getActivePlayer() {
    return this.#activePlayer;
  }
  getBoard() {
    return this.#board.getBoard();
  }
}


function ScreenController() {
  let game = new GameController("Player 1", "Player 2");
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

  const resetGame = () => {
    game = new GameController("Player 1", "Player 2");
    winnerDiv.textContent = "";
    boardDiv.addEventListener("click", clickHandlerBoard);
    updateScreen();
  }

  const clickHandlerBoard = (e) => {
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    if (!row || !column) return;

    const result = game.playRound(+row, +column);

    updateScreen();

    if (result) {
      if (result === "draw") {
        winnerDiv.textContent = "It's a draw!";
      } else {
        winnerDiv.textContent = `${game.getActivePlayer().name} wins!`;
      }

      boardDiv.removeEventListener("click", clickHandlerBoard);

      setTimeout(() => {
        resetGame();
      }, 2500);

      return;
    }

  };

  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}


ScreenController();
