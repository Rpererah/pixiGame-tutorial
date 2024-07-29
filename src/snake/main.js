// index.js
import { Application } from "pixi.js";
import Snake from "./Snake";
import Keyboard from "./Keyboard";
import { RandomSquare } from "./RandomSquare";

const app = new Application();
let collisionCount = 0;

async function init() {
  await app.init({
    resizeTo: window,
    backgroundAlpha: 0.5,
    backgroundColor: 0x00008b,
  });

  document.body.appendChild(app.canvas);
  app.canvas.style.position = 'absolute';
}

let currentSquare = new RandomSquare(); 
currentSquare.addStage(app.stage);

function removeCurrentSquare() {
    app.stage.removeChild(currentSquare.square); 
  }

async function createAndAddRandomSquare() {
  removeCurrentSquare(); 
  currentSquare = new RandomSquare(); 
  currentSquare.addStage(app.stage);
}

init().then(async () => {
    const snake =new Snake(app);

  const keyboard = new Keyboard(snake, {
    leftKey: 'ArrowLeft',
    rightKey: 'ArrowRight',
    upKey: 'ArrowUp',
    downKey: 'ArrowDown',
    speed: 10
  });

  app.ticker.add(() => {
    keyboard.update();

    if (snake.checkCollision(currentSquare.square)) {
      console.log('Colisão detectada! Criando um novo quadrado...');
      createAndAddRandomSquare(); 
      collisionCount++;
      snake.handleCollision();
      console.log(`Número de colisões: ${collisionCount}`);
    }
  });
});
