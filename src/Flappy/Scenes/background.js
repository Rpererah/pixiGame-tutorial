import { Assets, Sprite } from "pixi.js";

export async function background(app) {
  const texture = await Assets.load("src/Flappy/assets/images/bg.png");
  const background = new Sprite(texture);
  const scrollBackground = new Sprite(texture);

  background.width = app.screen.width;
  background.height = app.screen.height;
  scrollBackground.width = app.screen.width;
  scrollBackground.height = app.screen.height;

  background.x = 0;
  background.y = 0;
  scrollBackground.x = app.screen.width;
  scrollBackground.y = 0;

  function scroll() {
    background.x -= 2;
    scrollBackground.x -= 2;

    if (background.x <= -app.screen.width) {
      background.x = scrollBackground.x + app.screen.width;
    }

    if (scrollBackground.x <= -app.screen.width) {
      scrollBackground.x = background.x + app.screen.width;
    }
  }
  app.ticker.add(scroll);

  return { background, scrollBackground };
}
