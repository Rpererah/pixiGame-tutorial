import { Container, Sprite, Text, TextStyle } from 'pixi.js';

export function showGameOver(app) {
    //remove all that
    app.stage.removeChildren();

    const gameOverContainer = new Container();

    const background = new Sprite();
    background.width = app.screen.width;
    background.height = app.screen.height;
    background.tint = 0x000000; 
    gameOverContainer.addChild(background);

    
    const style = new TextStyle({
        fontSize: 72,
        fill: '#ffffff', // Cor do texto
        align: 'center',
    });
    const text = new Text({text:'Game Over', style});
    text.anchor.set(0.5);
    text.x = app.screen.width / 2;
    text.y = app.screen.height / 2;
    gameOverContainer.addChild(text);

    app.stage.addChild(gameOverContainer);

}
