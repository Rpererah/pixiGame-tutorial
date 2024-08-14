import { AnimatedSprite, Assets, Spritesheet } from "pixi.js";
import explodeJson from "./assets/explode.json";

export async function createExplode(app, height, width, repeat = 2) {
  const texture = await Assets.load("/src/Space/assets/explode.png");
  const spritesheet = new Spritesheet(texture, explodeJson);
  await spritesheet.parse();
  const animatedSprite = new AnimatedSprite(spritesheet.animations.explode);
  app.stage.addChild(animatedSprite);
  animatedSprite.play();
  animatedSprite.animationSpeed = 0.24;
  animatedSprite.height = height;
  animatedSprite.width = width;
  animatedSprite.loop = false;

  animatedSprite.onComplete = () => {
    if (repeat > 1) {
      repeat -= 1;
      animatedSprite.gotoAndPlay(0);
    } else {
      animatedSprite.parent.removeChild(animatedSprite);
    }
  };

  return animatedSprite;
}
