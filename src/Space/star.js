import { Assets, Sprite } from "pixi.js";

export async function createStar(app) {
  const texture = await Assets.load("/src/Space/assets/star.png");
  const star = new Sprite(texture);

  const minSize = 20;
  const maxSize = 60;
  const size = Math.random() * (maxSize - minSize) + minSize;
  star.width = size;
  star.height = size;
  star.anchor = 0.5;

  const x = Math.random() * (app.screen.width - star.width);
  const y = -star.height;
  star.x = x;
  star.y = y;

  const rotationSpeed = Math.random() * 0.05 + 0.01;
  const fallSpeed = Math.random() * 2 + 1;

  app.ticker.add(() => {
    star.rotation += rotationSpeed;

    star.y += fallSpeed;

    if (star.y > app.screen.height) {
      star.y = -star.height;
      star.x = Math.random() * (app.screen.width - star.width);
    }
  });

  return star;
}
