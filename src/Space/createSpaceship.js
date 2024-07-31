import { Assets, Graphics, Sprite } from "pixi.js";

export async function createSpaceship(app) {
  const texture = await Assets.load("/src/Space/assets/spaceship.png");
  const sprite = new Sprite(texture);

  sprite.height = 100;
  sprite.width = 100;

  sprite.x = (app.screen.width - sprite.width) / 2;
  sprite.y = app.screen.height - sprite.height;

  return sprite;
}
