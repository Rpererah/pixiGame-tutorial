export function autoShoot(spaceship, mainContainer, shooter, projectiles) {
  let shootingIntervalId;

  function start() {
    shootingIntervalId = setInterval(() => {
      if (!spaceship.hasExploded) {
        const projectile = shooter(spaceship, mainContainer);
        projectiles.push(projectile);
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
