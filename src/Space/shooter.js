import { Graphics } from "pixi.js";

export function shooter(spaceship, container) {
  const projectile = new Graphics();
  projectile.circle(0, 0, 5);
  projectile.fill({ color: 0xfff });

  projectile.x = spaceship.x + 50;
  projectile.y = spaceship.y;

  const speed = 5;
  projectile.vx = 0;
  projectile.vy = -speed;

  container.addChild(projectile);

  return projectile;
}
