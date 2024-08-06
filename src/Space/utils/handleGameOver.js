import { createExplode } from "../sprites/createExplode";

export async function handleGameOver(app, spaceship, autoShooting, onComplete) {
  spaceship.hasExploded = true;
  await createExplode(app, spaceship.height, spaceship.width).then(
    (explode) => {
      explode.x = spaceship.x;
      explode.y = spaceship.y;
      explode.play();
      app.stage.removeChild(spaceship);
      autoShooting.stop();

      setTimeout(() => onComplete(), 3000);
    }
  );
}
