import { Assets, TilingSprite } from "pixi.js";
//tiling funciona melhor que fazer gambis com 2 backgrounds rodando, nao preciso me preocupar se a imagem combina pra rodar ele mesmo ajusta o corte
export async function createOpeningBackground(app) {
  const texture = await Assets.load("/src/Space/assets/opening.png");

  const tilingSprite = new TilingSprite({
    texture,
    width: app.screen.width,
    height: app.screen.height,
  });

  tilingSprite.scale.set(2);

  function updateBackground() {
    tilingSprite.tilePosition.x -= 1;
  }

  app.ticker.add(updateBackground);

  return { tilingSprite };
}
