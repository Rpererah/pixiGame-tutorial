import { Howl } from "howler";
import shootSound from "./../assets/shoot.wav";
export function autoShoot(spaceship, mainContainer, shooter, projectiles) {
  let shootingIntervalId;

  const sound = new Howl({
    src: [shootSound],
  });

  function start() {
    shootingIntervalId = setInterval(() => {
      if (!spaceship.hasExploded) {
        const projectile = shooter(spaceship, mainContainer);
        projectiles.push(projectile);
        sound.play();
      } else {
        clearInterval(shootingIntervalId);
      }
    }, 500);
  }

  function stop() {
    clearInterval(shootingIntervalId);
  }

  return { start, stop };
}
