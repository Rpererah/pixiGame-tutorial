import { Application, Sprite, Container, Assets } from "pixi.js";
import { createScoreText } from "./scoreText";
import { createTicker } from "./ticker";
import { createKeyboardControls } from "./keyboard";
import { createCoin } from "./coin";
import { createBag } from "./bag";
import { showGameOver } from "./gameOver";
import { updateGame } from "./updateGame";
import { setupGame } from "./gameSetup";

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
  Assets.load("/src/Pick/background.jpg").then((texture) => {
    const background = new Sprite(texture);
    background.width = app.screen.width;
    background.height = app.screen.height;
    backgroundContainer.addChild(background);
  });

  const mainContainer = new Container();
  app.stage.addChild(mainContainer);

  const bag = await createBag(app);
  mainContainer.addChild(bag);

  const balls = [];
  const initialCoin = await createCoin(app);
  balls.push(initialCoin);
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

  const gameUpdate = () => {
    updateGame({
      balls,
      bag,
      app,
      keyboard,
      mainContainer,
      updateScore,
    });
  };

  createTicker(gameUpdate);
  setupGame({
    app,
    balls,
    mainContainer,
    createCoin,
    bag,
    getWindowDimensions,
    background,
  });
}
init();
