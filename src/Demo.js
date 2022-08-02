import React, { useState } from "react";
import Board from "./components/Board";

import "./index.css";


const human = 'O';
const ai = 'X';
export default function Demo() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(true); // turn{true,false} true là lượt của human, false là lượt ai

  //handleClick: lượt của human

  const handleClick = i => {
    if (checkWinner(squares) || squares[i] !== null) {
      return;
    }
    squares[i] = human;
    setSquares(squares);
    setTurn(!turn);
    // check win
    if (checkWinner(squares) === null) {
      bestMove(turn, squares);
    }
  };

  //checkWinner

  function checkWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    let checkNull = squares.some(function (item) {
      return item === null;
    });
    return checkNull ? null : 'Draw'
  }

  //bestMove: lượt của Ai

  function bestMove(turn, squares) {
    let bestScore = -Infinity;
    let depth = 0;
    const board = [...squares];
    let move;
    for (let i = 0; i < squares.length; i++) {
      if (board[i] === null) {
        board[i] = ai;
        let score = minimax(board, depth, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
          // if (score === 10 && ) {
          //   break;
          // }
        }
      }
    }
    squares[move] = ai;
    setSquares(squares);
    setTurn(!turn);
  }

  // status

  let winner = checkWinner(squares);

  let status;
  if (winner === 'Draw') {
    status = winner;
  } else if (winner) {
    status = "Winner: " + winner;
  } else {
    status = 'Turn : ' + human;
  }

  //minimax

  function minimax(squares, depth, isMaximizing) {
    let result = checkWinner(squares);
    // squares = JSON.parse(JSON.stringify(squares));
    if (result !== null) {
      if (result === human) {
        return -10;
      } else if (result === ai) {
        return 10;
      } else if (result === 'Draw') {
        return 0;
      }
    }
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = ai;
          let score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }

      }
      return bestScore;
    } else {
      let bestScore = +Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = human;
          let score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore)
        }
      }
      return bestScore;
    }

  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onClick={i => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>
          {status}
        </div>
      </div>
    </div>
  );
}
