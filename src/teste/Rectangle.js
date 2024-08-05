import { Graphics } from "pixi.js";

export class MyRectangle {
  constructor(
    x,
    y,
    width,
    height,
    color,
    alpha,
    widthStroke = 8,
    colorStroke = 0x00ff00
  ) {
    this.rectangle = new Graphics();

    // Desenhar o retângulo
    this.rectangle
      .rect(x, y, width, height)

      // Preencher o retângulo
      .fill({ color, alpha })

      .stroke({
        width: widthStroke,
        color: colorStroke,
      });
  }

  addStage(stage) {
    stage.addChild(this.rectangle);
  }
}
