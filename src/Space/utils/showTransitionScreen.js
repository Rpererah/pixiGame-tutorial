import { Container, Text, TextStyle } from "pixi.js";

export function showTransitionScreen(app, message, onTransitionComplete) {
  const transitionScreen = new Container();
  const style = new TextStyle({
    fontSize: 48,
    fill: "#ffffff",
    align: "center",
  });

  const text = new Text({ text: message, style });
  text.anchor.set(0.5);
  text.x = app.screen.width / 2;
  text.y = app.screen.height / 2;
  transitionScreen.addChild(text);
  app.stage.addChild(transitionScreen);

  setTimeout(() => {
    app.stage.removeChild(transitionScreen);
    onTransitionComplete();
  }, 3000);
}
