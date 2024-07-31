import { Application } from "pixi.js";
import { createSquare } from "./createSquare";

const app = new Application();
const GRID_SIZE = 100;
const COLUMNS = 3;
const ROWS = 6;

async function init() {
  await app.init({
    height: GRID_SIZE * ROWS,
    width: GRID_SIZE * COLUMNS,
    backgroundColor: 0x000,
  });

  document.body.appendChild(app.canvas);

  const squares = [];

  const getRandomColor = () => Math.floor(Math.random() * 3);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const x = col * GRID_SIZE;
      const y = row * GRID_SIZE;
      const color = getRandomColor();
      const square = await createSquare(color, GRID_SIZE);
      square.row = row;
      square.col = col;
      square.x = x;
      square.y = y;
      app.stage.addChild(square);
      squares.push(square);
    }
  }

  let selectedSquare = null;

  const swapPositions = (sq1, sq2) => {
    // Troca de posições
    const tempX = sq1.x;
    const tempY = sq1.y;
    sq1.x = sq2.x;
    sq1.y = sq2.y;
    sq2.x = tempX;
    sq2.y = tempY;

    // Troca de cores
    const tempColor = sq1.color;
    sq1.color = sq2.color;
    sq2.color = tempColor;

    // Atualiza as propriedades dos quadrados
    sq1.row = sq2.row;
    sq1.col = sq2.col;
    sq2.row = sq1.row;
    sq2.col = sq1.col;

    // Verificação após a troca
    setTimeout(() => {
      if (
        checkForSequenceInRow(sq1.row, sq1.color) ||
        checkForSequenceInRow(sq2.row, sq2.color) ||
        checkForSequenceInColumn(sq1.col, sq1.color) ||
        checkForSequenceInColumn(sq2.col, sq2.color)
      ) {
        console.log("Sequência encontrada após a troca!");
      } else {
        console.log("Nenhuma sequência encontrada após a troca.");

        // Reverte a troca se nenhuma sequência for encontrada
        swapPositions(sq1, sq2);
      }
    }, 100); // Pequeno atraso para garantir que a troca seja refletida
  };

  const onPointerDown = (event) => {
    const clickedSquare = event.currentTarget;

    if (selectedSquare) {
      swapPositions(selectedSquare, clickedSquare);
      selectedSquare = null;
    } else {
      selectedSquare = clickedSquare;
    }
  };

  squares.forEach((square) => {
    square.on("pointerdown", onPointerDown);
  });

  const getSquaresInRow = (row) => {
    return squares.filter((s) => s.row === row).sort((a, b) => a.col - b.col);
  };

  const getSquaresInColumn = (col) => {
    return squares.filter((s) => s.col === col).sort((a, b) => a.row - b.row);
  };

  const removeSequence = (squaresToRemove) => {
    // Remove os quadrados do palco e do array
    squaresToRemove.forEach((square) => {
      app.stage.removeChild(square);
      const index = squares.indexOf(square);
      if (index !== -1) {
        squares.splice(index, 1);
      }
    });
  };

  const hasSequence = (squares, color) => {
    let currentColor = null;
    let currentCount = 0;
    const sequenceIndices = [];

    for (let i = 0; i < squares.length; i++) {
      const square = squares[i];
      if (square.color === color) {
        if (currentColor === color) {
          currentCount++;
          if (currentCount >= 3) {
            // Adiciona os índices da sequência
            for (let j = i - (currentCount - 1); j <= i; j++) {
              sequenceIndices.push(j);
            }
          }
        } else {
          currentColor = color;
          currentCount = 1;
        }
      } else {
        currentColor = null;
        currentCount = 0;
      }
    }

    if (sequenceIndices.length > 0) {
      console.log(
        `Sequência encontrada nos índices: ${sequenceIndices.join(", ")}`
      );
      const squaresToRemove = sequenceIndices.map((index) => squares[index]);
      removeSequence(squaresToRemove);
      return true;
    }
    return false;
  };

  const checkForSequenceInRow = (row, color) => {
    const rowSquares = getSquaresInRow(row);
    return hasSequence(rowSquares, color);
  };

  const checkForSequenceInColumn = (col, color) => {
    const colSquares = getSquaresInColumn(col);
    return hasSequence(colSquares, color);
  };
}

await init();
