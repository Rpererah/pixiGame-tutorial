import { AnimatedSprite, Application, Assets, Spritesheet } from 'pixi.js';
import json from './coin.json';
import image from './coin.png';

const app = new Application();

async function init() {
    await app.init({
        resizeTo: window,
        backgroundAlpha: 0.5,
        backgroundColor: 0x00008b,
    });

    document.body.appendChild(app.view);
    app.view.style.position = 'absolute';
}

async function createCoin() {
    
    const texture = await Assets.load('/src/Pick/coin.png');
    const spritesheet = new Spritesheet(
        texture,
        json
      );
      await spritesheet.parse();
      const animatedSprite = new AnimatedSprite(spritesheet.animations.spin);
    app.stage.addChild(animatedSprite);
    animatedSprite.play();
    animatedSprite.animationSpeed = 0.05;
}

init().then(createCoin);
