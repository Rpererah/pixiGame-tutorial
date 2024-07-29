import { Text, TextStyle } from 'pixi.js';

export const createScoreText = () => {
  const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fill: '#ffffff', 
    stroke: '#000000',
    strokeThickness: 5, 
    dropShadow: true, 
    dropShadowColor: '#000000', 
    dropShadowBlur: 4, 
    dropShadowAngle: Math.PI / 6, 
    dropShadowDistance: 6, 
    align: 'center', 
  })
  const scoreText = new Text({text:'Score: 0',style });

  scoreText.x = 10;
  scoreText.y = 10;

  return scoreText;
};

