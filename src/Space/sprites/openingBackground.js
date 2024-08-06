import { Assets, Sprite } from "pixi.js";

export async function createOpeningBackground(app) {
  const texture = await Assets.load("/src/Space/assets/opening.png");

  const backgroundSprite1 = new Sprite(texture);
  const backgroundSprite2 = new Sprite(texture);

  backgroundSprite1.width = app.screen.width;
  backgroundSprite1.height = app.screen.height;
  backgroundSprite2.width = app.screen.width;
  backgroundSprite2.height = app.screen.height;

  backgroundSprite1.x = 0;
  backgroundSprite1.y = 0;
  backgroundSprite2.x = app.screen.width;
  backgroundSprite2.y = 0;
  backgroundSprite1.scale = 3;
  backgroundSprite2.scale = 3;
  function updateBackground() {
    backgroundSprite1.x -= 2;
    backgroundSprite2.x -= 2;

    if (backgroundSprite1.x <= -app.screen.width) {
      backgroundSprite1.x = backgroundSprite2.x + app.screen.width;
    }

    if (backgroundSprite2.x <= -app.screen.width) {
      backgroundSprite2.x = backgroundSprite1.x + app.screen.width;
    }
  }

  app.ticker.add(updateBackground);

  return { backgroundSprite1, backgroundSprite2 };
}
