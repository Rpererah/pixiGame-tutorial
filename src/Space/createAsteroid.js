import { AnimatedSprite, Assets, Spritesheet } from "pixi.js";
import asteroidJson from "./assets/asteroid.json";
export async function createAsteroid(app, velocity) {
  const texture = await Assets.load("/src/Space/assets/asteroid.png");
  const spritesheet = new Spritesheet(texture, asteroidJson);
  await spritesheet.parse();
  const animatedSprite = new AnimatedSprite(spritesheet.animations.asteroid);
  const size = Math.random() * 50 + 100;
  app.stage.addChild(animatedSprite);
  animatedSprite.play();
  animatedSprite.animationSpeed = 0.24;
  animatedSprite.anchor = 0.5;
  animatedSprite.height = size;
  animatedSprite.width = size;

  const edge = Math.floor(Math.random() * 4);
  const radius = 5;

  switch (edge) {
    case 0:
      animatedSprite.x = Math.random() * app.screen.width;
      animatedSprite.y = -radius;
      animatedSprite.vx = Math.random() * 2 - 1;
      animatedSprite.vy = Math.random() * 2 + 1 * velocity;
      break;
    case 1:
      animatedSprite.x = Math.random() * app.screen.width;
      animatedSprite.y = app.screen.height + radius;
      animatedSprite.vx = Math.random() * 2 - 1;
      animatedSprite.vy = -Math.random() * 2 - 1 * velocity;
      break;
    case 2:
      animatedSprite.x = -radius;
      animatedSprite.y = Math.random() * app.screen.height;
      animatedSprite.vx = Math.random() * 2 + 1;
      animatedSprite.vy = Math.random() * 2 - 1 * velocity;
      break;
    case 3:
      animatedSprite.x = app.screen.width + radius;
      animatedSprite.y = Math.random() * app.screen.height;
      animatedSprite.vx = -Math.random() * 2 - 1;
      animatedSprite.vy = Math.random() * 2 - 1 * velocity;
      break;
  }

  app.ticker.add(() => {
    animatedSprite.x += animatedSprite.vx;
    animatedSprite.y += animatedSprite.vy;

    if (
      animatedSprite.x < -radius ||
      animatedSprite.x > app.screen.width + radius ||
      animatedSprite.y < -radius ||
      animatedSprite.y > app.screen.height + radius
    ) {
      switch (Math.floor(Math.random() * 4)) {
        case 0:
          animatedSprite.x = Math.random() * app.screen.width;
          animatedSprite.y = -radius;
          animatedSprite.vx = Math.random() * 2 - 1;
          animatedSprite.vy = Math.random() * 2 + 1 * velocity;
          break;
        case 1:
          animatedSprite.x = Math.random() * app.screen.width;
          animatedSprite.y = app.screen.height + radius;
          animatedSprite.vx = Math.random() * 2 - 1;
          animatedSprite.vy = -Math.random() * 2 - 1 * velocity;
          break;
        case 2:
          animatedSprite.x = -radius;
          animatedSprite.y = Math.random() * app.screen.height;
          animatedSprite.vx = Math.random() * 2 + 1;
          animatedSprite.vy = Math.random() * 2 - 1 * velocity;
          break;
        case 3:
          animatedSprite.x = app.screen.width + radius;
          animatedSprite.y = Math.random() * app.screen.height;
          animatedSprite.vx = -Math.random() * 2 - 1;
          animatedSprite.vy = Math.random() * 2 - 1 * velocity;
          break;
      }
    }
  });

  return animatedSprite;
}
