import { AnimatedSprite, Assets, Spritesheet } from 'pixi.js';
import coinJson from './coin.json'

export async function createCoin(app) {
   
    const texture = await Assets.load('/src/Pick/coin.png');
    const spritesheet = new Spritesheet(
        texture,
        coinJson
      );
      await spritesheet.parse();
      const animatedSprite = new AnimatedSprite(spritesheet.animations.spin);
    app.stage.addChild(animatedSprite);
    animatedSprite.play();
    animatedSprite.height=50
    animatedSprite.width=50
    animatedSprite.animationSpeed = 0.18;
    animatedSprite.x=Math.random() * (app.screen.width - animatedSprite.width);
    animatedSprite.y = -animatedSprite.height; 


    return animatedSprite;
}
