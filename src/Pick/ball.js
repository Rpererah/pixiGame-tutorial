import { Graphics } from 'pixi.js';


export function createBall(app){
    const ball = new Graphics();
    ball.circle(0,0,15)
    .fill({
        color: 0xffffff
      });
    ball.x = Math.random() * (app.screen.width - ball.width);
    ball.y = -ball.height; 
    app.stage.addChild(ball);
    return ball;

}

