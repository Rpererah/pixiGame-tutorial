import { Graphics } from "pixi.js";
const colors = [0x87ceeb, 0x98ff98, 0xff4500];
export async function createSquare(color = 0, size) {
  const rectangle = new Graphics();
  rectangle
    .rect(0, 0, size, size)
    .fill({ color: colors[color] })
    .stroke({ width: 3, color: 0x000 });
  rectangle.interactive = true;
  rectangle.cursor = "pointer";
  rectangle.color = color;
  return rectangle;
}
