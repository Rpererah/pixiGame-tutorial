import { Assets, Rectangle, Sprite, Texture } from "pixi.js";

export async function createObstacles(x, gapY, gapSize) {
  const texture = await Assets.load("src/Flappy/assets/images/pipe.png");

  const frame = new Rectangle(0, 0, texture.width - 200, texture.height);

  const croppedTexture = new Texture(texture.baseTexture, frame);

  const topTube = new Sprite(croppedTexture);
  topTube.x = x;
  topTube.width = 500;
  topTube.height = 500;
  topTube.y = gapY - gapSize * 4;
  topTube.rotation = Math.PI;
  topTube.anchor.set(0.5, 1);

  const bottomTube = new Sprite(croppedTexture);
  bottomTube.x = x - 100;
  bottomTube.width = 500;
  bottomTube.height = 400;
  bottomTube.y = gapY + gapSize;
  bottomTube.anchor.set(0.5, 0);

  return { topTube, bottomTube };
}
