import { Application, Container, Text, TextStyle, Graphics } from "pixi.js";

export function createStartScreen(app, onStartGame) {
  const startContainer = new Container();
  app.stage.addChild(startContainer);

  const titleStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: 64,
    fill: 0xffffff,
    align: "center",
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
  button.fill({ color: 0xff0000 });
  button.roundRect(0, 0, buttonText.width + 20, buttonText.height + 10, 8);
  button.addChild(buttonText);
  buttonText.x = 10;
  buttonText.y = 5;

  button.interactive = true;
  button.buttonMode = true;
  button.x = app.screen.width / 2 - button.width / 2;
  button.y = app.screen.height / 2 + 50;

  button.on("pointerdown", onStartGame);
  startContainer.addChild(button);

  return startContainer;
}
