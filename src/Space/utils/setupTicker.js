import { Howl } from "howler";
import explosioWav from "./../assets/explosion.wav";
import winWav from "./../assets/win.wav";
import loseWav from "./../assets/lose.wav";
import { checkCollision } from "./checkCollision";
import { createExplode } from "../sprites/createExplode";
export function setupTicker(
  app,
  spaceship,
  comets,
  projectiles,
  mainContainer,
  showTransitionScreen,
  difficultyLevel,
  nextPhase,
  handleSpaceshipCollision,
  mousePosition
) {
  const explosionSound = new Howl({
    src: [explosioWav],
  });
  const winSound = new Howl({ src: [winWav] });
  const loseSound = new Howl({ src: [loseWav] });

  app.ticker.add(() => {
    // Suaviza o movimento da navinha
    const speed = 0.1;

    spaceship.x += (mousePosition.x - spaceship.x) * speed;
    spaceship.y += (mousePosition.y - spaceship.y) * speed;

    projectiles.forEach((projectile) => {
      projectile.x += projectile.vx;
      projectile.y += projectile.vy;

      comets.forEach((comet) => {
        if (checkCollision(projectile, comet)) {
          createExplode(app, comet.height, comet.width).then((explode) => {
            explode.x = comet.x;
            explode.y = comet.y;
            explode.play();
            explosionSound.play();
            mainContainer.removeChild(comet);
            comets.splice(comets.indexOf(comet), 1);
            mainContainer.removeChild(projectile);
            projectiles.splice(projectiles.indexOf(projectile), 1);
            if (comets.length < 1) {
              winSound.play();
              showTransitionScreen(
                app,
                `Fase ${difficultyLevel + 1}`,
                nextPhase
              );
            }
          });
        }
      });

      comets.forEach((comet) => {
        if (checkCollision(spaceship, comet) && !spaceship.hasExploded) {
          spaceship.hasExploded = true;
          createExplode(app, spaceship.height, spaceship.width).then(
            (explode) => {
              explode.x = spaceship.x;
              explode.y = spaceship.y;
              explode.play();
              loseSound.play();
              mainContainer.removeChild(spaceship);
              handleSpaceshipCollision();
            }
          );
        }
      });
    });
  });
}
