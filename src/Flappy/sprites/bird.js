import { AnimatedSprite, Assets, Graphics, Spritesheet } from "pixi.js";
import birdJson from "./../assets/json/passarinho.json";

export async function bird() {
  const texture = await Assets.load("/src/Flappy/assets/images/passarinho.png");
  const spritesheet = new Spritesheet(texture, birdJson);
  await spritesheet.parse();
  const animatedSprite = new AnimatedSprite(spritesheet.animations.frame);
  animatedSprite.play();
  animatedSprite.x = 200;
  animatedSprite.animationSpeed = 0.24;
  animatedSprite.height = 60;
  animatedSprite.width = 60;
  animatedSprite.vy = 0;
  animatedSprite.gravity = 0.5;
  animatedSprite.jumpStrength = -16;

  return animatedSprite;
}
