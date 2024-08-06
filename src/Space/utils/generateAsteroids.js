import { createAsteroid } from "../sprites/createAsteroid";

export async function generateAsteroids(
  app,
  container,
  comets = [],
  asteroidSpeed,
  maxAsteroids
) {
  comets.forEach((comet) => container.removeChild(comet));
  comets.length = 0;

  for (let i = 0; i < maxAsteroids; i++) {
    const comet = await createAsteroid(app, asteroidSpeed);
    container.addChild(comet);
    comets.push(comet);
  }
}
