import { Assets, Sprite } from "pixi.js";

export async function createBackground(app) {
  const background = Assets.load("/src/Space/assets/background.jpg").then(
    (texture) => {
      const backgroundSprite = new Sprite(texture);
      backgroundSprite.width = app.screen.width;
      backgroundSprite.height = app.screen.height;
      return backgroundSprite;
    }
  );

  return background;
}
