import { Application, Sprite, Container, Assets } from "pixi.js";
import { createScoreText } from "./scoreText";
import { createTicker } from "./ticker";
import { createKeyboardControls } from "./keyboard";
import { createCoin } from "./coin";
import { createBag } from "./bag";
import { showGameOver } from "./gameOver";


const getWindowDimensions = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const app = new Application();

async function init() {
  await app.init({
    width: window.innerWidth / 2,
    height: window.innerHeight / 2,
    backgroundAlpha: 0.5,
    backgroundColor: 0x000,
  });

  document.body.appendChild(app.canvas);

  const backgroundContainer = new Container();
  app.stage.addChild(backgroundContainer);

  let background;
  Assets.load('/src/Pick/background.jpg').then((texture) => {
    const background = new Sprite(texture);
    background.width = app.screen.width;
    background.height = app.screen.height;
    backgroundContainer.addChild(background);
  });

  const mainContainer = new Container();
  app.stage.addChild(mainContainer);

//   const basket = createBasket(app);

//   mainContainer.addChild(basket);

const bag = await createBag(app)
mainContainer.addChild(bag)

  
  const balls = [];
// const initialBall = createBall(app); 
  const initialCoin = await createCoin(app)
// balls.push(initialBall); 
    balls.push(initialCoin)
  mainContainer.addChild(initialCoin);

  const keyboard = createKeyboardControls();

  let score = 0;

  const scoreText = createScoreText();
  mainContainer.addChild(scoreText);

  const updateScore = () => {
    score += 10;
    scoreText.text = `Score: ${score}`;

    if (score >= 50) {
        showGameOver(app);
      }
  };

  const updateGame = () => {

    balls.forEach((ball, index) => {
      ball.y += 5;

      // Check if ball has moved off-screen
      if (ball.y > app.screen.height) {
        mainContainer.removeChild(ball);
        balls.splice(index, 1);
        return;
      }
      let tolerance=0

      // Check for collision with basket
      if (
        
        ball.x < bag.x + bag.width + tolerance &&
            ball.x + ball.width > bag.x - tolerance &&
            ball.y < bag.y + bag.height + tolerance &&
            ball.y + ball.height > bag.y - tolerance
      ) {
        mainContainer.removeChild(ball);
        balls.splice(index, 1);
        updateScore();
      }
    });

    if (keyboard.left && bag.x > 0) {
      bag.x -= 5;
    }
    if (keyboard.right && bag.x < app.screen.width - bag.width) {
      bag.x += 5;
    }
  };

  createTicker(updateGame);

  const intervalId = setInterval(async () => {
    const newBall = await createCoin(app);
    balls.push(newBall);
    mainContainer.addChild(newBall);
  }, 1000);

  // Ajustar para mobile depois
  window.addEventListener('resize', () => {
    const { width, height } = getWindowDimensions();
    app.renderer.resize(width, height); 
    app.view.style.width = `${width}px`;
    app.view.style.height = `${height}px`; 
  
    bag.x = width / 2 - 50;
    bag.y = height - 50;
    
    background.width = width;
    background.height = height;
  });

  // Limpeza
  window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
    balls.forEach(ball => mainContainer.removeChild(ball));
  });
}

init();
