import { Graphics } from "pixi.js";

export function desenharHitbox(container, objeto, cor = 0xff0000, alpha = 0.5) {
  const hitbox = new Graphics();

  atualizarHitbox(hitbox, objeto, cor, alpha);
  container.addChild(hitbox);
  return hitbox;
}

export function atualizarHitbox(hitbox, objeto, cor = 0xff0000, alpha = 0.5) {
  hitbox.clear();
  const bounds = objeto.getBounds();
  hitbox.rect(bounds.x, bounds.y, bounds.width, bounds.height);
  hitbox.fill({ color: cor, alpha });
}
