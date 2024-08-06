import { Application, Container } from "pixi.js";
import { background } from "./Scenes/background";
import { bird } from "./sprites/bird";
import { createObstacles } from "./sprites/obstacle";
import { desenharHitbox, atualizarHitbox } from "./utils/test";
import { checkCollision } from "./utils/checkCollision";

const app = new Application();
let isJumping = false;
let targetRotation = 0;
let rotationSpeed = 0.2;
let gameRunning = true;

async function init() {
  await app.init({
    backgroundColor: 0xfff,
    resizeTo: window,
  });
  document.body.appendChild(app.canvas);

  const container = new Container();
  app.stage.addChild(container);

  const backgroundImage = await background(app);
  container.addChild(backgroundImage.background);
  container.addChild(backgroundImage.scrollBackground);

  const main = new Container();
  container.addChild(main);

  const hero = await bird();
  main.addChild(hero);

  const gapY = app.canvas.height / 2;
  const gapSize = 150;

  const { topTube, bottomTube } = await createObstacles(
    app.canvas.width - 200,
    gapY,
    gapSize
  );
  main.addChild(topTube);
  main.addChild(bottomTube);

  const hitboxHero = desenharHitbox(main, hero, 0x00ff00); // Verde
  const hitboxTopTube = desenharHitbox(main, topTube, 0xff0000); // Vermelho
  const hitboxBottomTube = desenharHitbox(main, bottomTube, 0x0000ff); // Azul

  main.addChild(hitboxHero);
  main.addChild(hitboxTopTube);
  main.addChild(hitboxBottomTube);

  app.ticker.add(() => {
    if (!gameRunning) {
      return;
    }

    hero.vy += hero.gravity;
    hero.y += hero.vy;
    topTube.x -= 5;
    bottomTube.x -= 5;

    if (hero.vy < 0) {
      targetRotation = -Math.PI / 4;
    } else {
      targetRotation = Math.PI / 4;
    }

    if (hero.rotation !== targetRotation) {
      const rotationDiff = targetRotation - hero.rotation;
      if (Math.abs(rotationDiff) > rotationSpeed) {
        hero.rotation += rotationSpeed * Math.sign(rotationDiff);
      } else {
        hero.rotation = targetRotation;
      }
    }

    if (checkCollision(hero, topTube, bottomTube)) {
      console.log("Colidiu!");
      gameRunning = false;
    }

    if (topTube.x + topTube.width < 0) {
      console.log("chegamos ao fim");
      main.removeChild(topTube);
      main.removeChild(bottomTube);
    }

    if (hero.y > app.canvas.height - hero.height / 2) {
      hero.y = app.canvas.height - hero.height / 2;
      hero.vy = 0;
      hero.rotation = 0;
      isJumping = false;
    } else if (hero.vy === 0 && !isJumping) {
      hero.rotation = 0;
    }

    atualizarHitbox(hitboxHero, hero, 0x00ff00);
    atualizarHitbox(hitboxTopTube, topTube, 0xff0000);
    atualizarHitbox(hitboxBottomTube, bottomTube, 0x0000ff);
  });

  app.canvas.addEventListener("click", () => {
    hero.vy = hero.jumpStrength;
    hero.rotation = -Math.PI / 4;
    isJumping = true;
  });
}

await init();
app.canvas.style.position = "absolute";
