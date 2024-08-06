import { Assets, Sprite } from "pixi.js";

export async function createSpaceship(app) {
  const texture = await Assets.load("/src/Space/assets/spaceship.png");
  const sprite = new Sprite(texture);

  sprite.height = 100;
  sprite.width = 100;

  sprite.x = (app.screen.width - sprite.width) / 2;
  sprite.y = app.screen.height - sprite.height;

  sprite.interactive = true;
  sprite.cursor = "pointer";

  return sprite;
}
