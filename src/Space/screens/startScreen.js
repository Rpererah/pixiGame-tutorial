import { Container, Text, TextStyle, Graphics } from "pixi.js";
import { Howl } from "howler";
import openingSound from "./../assets/opening.ogg";
import { createOpeningBackground } from "../sprites/openingBackground";
const sound = new Howl({
  src: [openingSound],
});

sound.play(); //por limitacoes do navegador o som so ira tocar quando houver algum click na tela ou acao
export async function createStartScreen(app, onStartGame) {
  const openingContainer = new Container();
  app.stage.addChild(openingContainer);
  const background = await createOpeningBackground(app);
  openingContainer.addChild(background.backgroundSprite1);
  openingContainer.addChild(background.backgroundSprite2);

  const startContainer = new Container();
  app.stage.addChild(startContainer);

  const titleStyle = new TextStyle({
    fontFamily: "Times",
    fontSize: 64,
    fill: 0xffffff,
    align: "center",
    stroke: 0x000000,
    strokeThickness: 12,
  });

  const title = new Text({ text: "Spacezin Rpererah", style: titleStyle });
  title.x = app.screen.width / 2 - title.width / 2;
  title.y = app.screen.height / 2 - title.height / 2 - 50;
  startContainer.addChild(title);

  const buttonStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: 32,
    fill: 0xffffff,
    align: "center",
  });

  const buttonText = new Text({ text: "Start Game", style: buttonStyle });
  const button = new Graphics();
  button.roundRect(0, 0, buttonText.width + 20, buttonText.height + 10, 8);
  button.fill({ color: 0xff0000 });
  button.addChild(buttonText);
  buttonText.x = 10;
  buttonText.y = 5;

  button.interactive = true;
  button.cursor = "pointer";
  button.x = app.screen.width / 2 - button.width / 2;
  button.y = app.screen.height / 2 + 50;

  button.on("pointerdown", () => {
    sound.pause();
    onStartGame();
  });
  startContainer.addChild(button);

  return startContainer;
}
