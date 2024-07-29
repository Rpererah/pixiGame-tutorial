import { Graphics } from 'pixi.js';
import { getWindowDimensions } from './utils/getWindowDimensions';

export function createBasket(app){
    const {height,width} = getWindowDimensions()
    const basket = new Graphics();
    basket.rect(0, 0, 100, 30) 
        .fill({ color: 0xff0000 }) 
        .stroke({
        width: 1,
    color: 0x000000 
  });
  basket.x = (app.screen.width - basket.width) / 2;

  basket.y = app.screen.height - basket.height
  

  app.stage.addChild(basket);
  return basket

}
