import { Sprite, Assets } from 'pixi.js';

export async function createBag(app) {
    const texture = await Assets.load('/src/Pick/bag.png');
    const sprite = new Sprite(texture);

    sprite.height = 50;
    sprite.width = 100;

    sprite.x = (app.screen.width - sprite.width) / 2;
    sprite.y = app.screen.height - sprite.height;

    return sprite;
}
