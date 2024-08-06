import { Application, Container } from "pixi.js";
import { createSpaceship } from "./createSpaceship";
import { shooter } from "./shooter";
import { createStartScreen } from "./startScreen";
import { createStar } from "./star";
import { checkCollision } from "./utils/checkCollision";
import { createExplode } from "./createExplode";
import { createAsteroid } from "./createAsteroid";
import { createBackground } from "./createBackground";
import { autoShoot } from "./utils/autoShooting";
import { showTransitionScreen } from "./utils/showTransitionScreen";
import { generateStars } from "./utils/generateStars";
import { generateAsteroids } from "./utils/generateAsteroids";

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
              showTransitionScreen(
                app,
                `Fase ${difficultyLevel + 1}`,
                nextPhase
              );
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
        autoShooting.stop();
        asteroidSpeed = 5;
        setTimeout(() => showStartScreen(), 3000);
      }
    );
  }

  let shootingIntervalId;

  const autoShooting = autoShoot(
    spaceship,
    mainContainer,
    shooter,
    projectiles
  );
  autoShooting.start();

  function nextPhase() {
    difficultyLevel++;
    asteroidSpeed += 10;
    maxAsteroids += 2;
    generateAsteroids(app, mainContainer, comets, asteroidSpeed, maxAsteroids);
  }

  autoShoot();
}

await init();
app.canvas.style.position = "absolute";
