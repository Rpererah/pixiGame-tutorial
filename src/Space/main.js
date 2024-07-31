import { Application, Assets, Container, Sprite } from "pixi.js";
import { createSpaceship } from "./createSpaceship";
import { shooter } from "./shooter";
import { createStartScreen } from "./startScreen";
import { createStar } from "./star";
import { createComet } from "./createMeteor";

//a hieraquia dos container funciona na ordem de criacao e eles vao se sobrepondo

const app = new Application();

async function init() {
  await app.init({
    backgroundColor: 0x000000,
    resizeTo: window,
  });
  document.body.appendChild(app.canvas);

  const startScreen = createStartScreen(app, startGame);

  async function startGame() {
    app.stage.removeChild(startScreen); // Remove a tela inicial
    await startGameLoop();
  }
}

async function startGameLoop() {
  const projectiles = [];

  const containerBackground = new Container();
  app.stage.addChild(containerBackground);

  Assets.load("/src/Space/assets/background.jpg").then((texture) => {
    const background = new Sprite(texture);
    background.width = app.screen.width;
    background.height = app.screen.height;
    containerBackground.addChild(background);
  });

  const mainContainer = new Container();
  app.stage.addChild(mainContainer);

  const numStars = 20;
  for (let i = 0; i < numStars; i++) {
    const star = await createStar(app);
    mainContainer.addChild(star);
  }

  const spaceship = await createSpaceship(app);
  mainContainer.addChild(spaceship);

  const numComets = 10; // Número inicial de cometas
  for (let i = 0; i < numComets; i++) {
    const comet = createComet(app);
    mainContainer.addChild(comet);
  }

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
    });
  });

  function autoShoot() {
    setInterval(() => {
      const projectile = shooter(spaceship, mainContainer);
      projectiles.push(projectile);
    }, 2000);
  }

  autoShoot();
}
await init();
app.canvas.style.position = "absolute";
