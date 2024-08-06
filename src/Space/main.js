import { Application, Container } from "pixi.js";
import { createSpaceship } from "./sprites/createSpaceship";
import { shooter } from "./sprites/shooter";
import { createStartScreen } from "./screens/startScreen";
import { createBackground } from "./sprites/createBackground";
import { autoShoot } from "./utils/autoShooting";
import { showTransitionScreen } from "./utils/showTransitionScreen";
import { generateStars } from "./utils/generateStars";
import { generateAsteroids } from "./utils/generateAsteroids";
import { handleGameOver } from "./utils/handleGameOver";
import { setupTicker } from "./utils/setupTicker";

//a hieraquia dos container funciona na ordem de criacao e eles vao se sobrepondo

const app = new Application();
let difficultyLevel = 1;
let asteroidSpeed = 1;
let maxAsteroids = 5;

async function init() {
  await app.init({
    backgroundColor: 0x000000,
    resizeTo: window,
  });
  document.body.appendChild(app.canvas);

  showStartScreen();
}

export function showStartScreen() {
  app.stage.removeChildren();

  const startScreen = createStartScreen(app, startGame);

  app.stage.addChild(startScreen);

  async function startGame() {
    app.stage.removeChild(startScreen);
    await startGameLoop();
  }
}

async function startGameLoop() {
  const projectiles = [];

  const containerBackground = new Container();
  containerBackground.width = app.screen.width;
  containerBackground.height = app.screen.height;
  app.stage.addChild(containerBackground);

  const background = await createBackground(app);
  containerBackground.addChild(background);

  const mainContainer = new Container();
  app.stage.addChild(mainContainer);

  generateStars(app, mainContainer);

  const spaceship = await createSpaceship(app);
  spaceship.hasExploded = false;
  mainContainer.addChild(spaceship);

  const comets = [];

  await generateAsteroids(
    app,
    mainContainer,
    comets,
    asteroidSpeed,
    maxAsteroids
  );

  const mousePosition = { x: app.screen.width / 2, y: app.screen.height / 2 };

  app.canvas.addEventListener("mousemove", (event) => {
    const rect = app.canvas.getBoundingClientRect();
    mousePosition.x = event.clientX - rect.left;
    mousePosition.y = event.clientY - rect.top;
  });

  async function handleSpaceshipCollision() {
    return await handleGameOver(app, spaceship, autoShooting, showStartScreen);
  }

  const autoShooting = autoShoot(
    spaceship,
    mainContainer,
    shooter,
    projectiles
  );

  function nextPhase() {
    difficultyLevel++;
    asteroidSpeed += 10;
    maxAsteroids += 2;

    generateAsteroids(app, mainContainer, comets, asteroidSpeed, maxAsteroids);
  }

  setupTicker(
    app,
    spaceship,
    comets,
    projectiles,
    mainContainer,
    showTransitionScreen,
    difficultyLevel,
    nextPhase,
    handleSpaceshipCollision,
    mousePosition
  );

  autoShooting.start();
}

await init();
app.canvas.style.position = "absolute";
