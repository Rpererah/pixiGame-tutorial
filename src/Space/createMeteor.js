import { Graphics } from "pixi.js";

export function createComet(app) {
  const comet = new Graphics();

  const radius = Math.random() * 20 + 30;
  comet.circle(0, 0, radius).fill({ color: 0xfff });
  // 0: top, 1: bottom, 2: left, 3: right
  const edge = Math.floor(Math.random() * 4);

  switch (edge) {
    case 0:
      comet.x = Math.random() * app.screen.width;
      comet.y = -radius;
      comet.vx = Math.random() * 2 - 1;
      comet.vy = Math.random() * 2 + 1;
      break;
    case 1:
      comet.x = Math.random() * app.screen.width;
      comet.y = app.screen.height + radius;
      comet.vx = Math.random() * 2 - 1;
      comet.vy = -Math.random() * 2 - 1;
      break;
    case 2:
      comet.x = -radius;
      comet.y = Math.random() * app.screen.height;
      comet.vx = Math.random() * 2 + 1;
      comet.vy = Math.random() * 2 - 1;
      break;
    case 3:
      comet.x = app.screen.width + radius;
      comet.y = Math.random() * app.screen.height;
      comet.vx = -Math.random() * 2 - 1;
      comet.vy = Math.random() * 2 - 1;
      break;
  }

  const rotationSpeed = Math.random() * 0.05 + 0.01;

  app.ticker.add(() => {
    comet.rotation += rotationSpeed;

    comet.x += comet.vx;
    comet.y += comet.vy;

    if (
      comet.x < -radius ||
      comet.x > app.screen.width + radius ||
      comet.y < -radius ||
      comet.y > app.screen.height + radius
    ) {
      switch (Math.floor(Math.random() * 4)) {
        case 0:
          comet.x = Math.random() * app.screen.width;
          comet.y = -radius;
          comet.vx = Math.random() * 2 - 1;
          comet.vy = Math.random() * 2 + 1;
          break;
        case 1:
          comet.x = Math.random() * app.screen.width;
          comet.y = app.screen.height + radius;
          comet.vx = Math.random() * 2 - 1;
          comet.vy = -Math.random() * 2 - 1;
          break;
        case 2:
          comet.x = -radius;
          comet.y = Math.random() * app.screen.height;
          comet.vx = Math.random() * 2 + 1;
          comet.vy = Math.random() * 2 - 1;
          break;
        case 3:
          comet.x = app.screen.width + radius;
          comet.y = Math.random() * app.screen.height;
          comet.vx = -Math.random() * 2 - 1;
          comet.vy = Math.random() * 2 - 1;
          break;
      }
    }
  });

  return comet;
}
