import {
  Application,
  Assets,
  Container,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";
import { createSpaceship } from "./createSpaceship";
import { shooter } from "./shooter";
import { createStartScreen } from "./startScreen";
import { createStar } from "./star";
import { createComet } from "./createMeteor";
import { checkCollision } from "./utils/checkCollision";
import { createExplode } from "./createExplode";
import { createAsteroid } from "./createAsteroid";

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

function showStartScreen() {
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

  Assets.load("/src/Space/assets/background.jpg").then((texture) => {
    const background = new Sprite(texture);
    background.width = app.screen.width;
    background.height = app.screen.height;
    containerBackground.addChild(background);
  });

  const mainContainer = new Container();
  app.stage.addChild(mainContainer);

  const numStars = Math.random() * 20;
  for (let i = 0; i < numStars; i++) {
    const star = await createStar(app);
    mainContainer.addChild(star);
  }

  const spaceship = await createSpaceship(app);
  spaceship.hasExploded = false;
  mainContainer.addChild(spaceship);

  const comets = [];

  async function spawnComets() {
    comets.forEach((comet) => mainContainer.removeChild(comet));
    comets.length = 0;

    const numComets = maxAsteroids;
    for (let i = 0; i < numComets; i++) {
      const comet = await createAsteroid(app, asteroidSpeed);
      mainContainer.addChild(comet);
      comets.push(comet);
    }
  }

  spawnComets();

  const mousePosition = { x: app.screen.width / 2, y: app.screen.height / 2 };

  app.canvas.addEventListener("mousemove", (event) => {
    const rect = app.canvas.getBoundingClientRect();
    mousePosition.x = event.clientX - rect.left;
    mousePosition.y = event.clientY - rect.top;
  });

  app.ticker.add(() => {
    // Suaviza o movimento da navinha
    const speed = 0.1;

    spaceship.x += (mousePosition.x - spaceship.x) * speed;
    spaceship.y += (mousePosition.y - spaceship.y) * speed;

    projectiles.forEach((projectile) => {
      projectile.x += projectile.vx;
      projectile.y += projectile.vy;

      comets.forEach((comet) => {
        if (checkCollision(projectile, comet)) {
          createExplode(app, comet.height, comet.width).then((explode) => {
            explode.x = comet.x;
            explode.y = comet.y;
            explode.play();
            mainContainer.removeChild(comet);
            comets.splice(comets.indexOf(comet), 1);
            mainContainer.removeChild(projectile);
            projectiles.splice(projectiles.indexOf(projectile), 1);
            if (comets.length < 1) {
              showTransitionScreen(`Fase ${difficultyLevel}`);
            }
          });
        }
      });

      comets.forEach((comet) => {
        if (checkCollision(spaceship, comet) && !spaceship.hasExploded) {
          spaceship.hasExploded = true;
          createExplode(app, spaceship.height, spaceship.width).then(
            (explode) => {
              explode.x = spaceship.x;
              explode.y = spaceship.y;
              explode.play();
              mainContainer.removeChild(spaceship);
              clearInterval(shootingIntervalId);
              handleGameOver();
            }
          );
        }
      });
    });
  });

  async function handleGameOver() {
    spaceship.hasExploded = true;
    await createExplode(app, spaceship.height, spaceship.width).then(
      (explode) => {
        explode.x = spaceship.x;
        explode.y = spaceship.y;
        explode.play();
        mainContainer.removeChild(spaceship);
        clearInterval(shootingIntervalId);
        setTimeout(() => showStartScreen(), 3000);
      }
    );
  }

  let shootingIntervalId;

  function autoShoot() {
    shootingIntervalId = setInterval(() => {
      if (!spaceship.hasExploded) {
        const projectile = shooter(spaceship, mainContainer);
        projectiles.push(projectile);
      } else {
        clearInterval(shootingIntervalId);
      }
    }, 1000);
  }

  function showTransitionScreen(message) {
    const transitionScreen = new Container();
    const style = new TextStyle({
      fontSize: 48,
      fill: "#ffffff",
      align: "center",
    });

    const text = new Text(message, style);
    text.anchor.set(0.5);
    text.x = app.screen.width / 2;
    text.y = app.screen.height / 2;
    transitionScreen.addChild(text);
    app.stage.addChild(transitionScreen);

    setTimeout(() => {
      app.stage.removeChild(transitionScreen);
      nextPhase();
    }, 3000);
  }

  function nextPhase() {
    difficultyLevel++;
    asteroidSpeed += 10;
    maxAsteroids += 2;
    spawnComets();
  }

  autoShoot();
}

await init();
app.canvas.style.position = "absolute";
