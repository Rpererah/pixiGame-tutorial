export function updateGame({
  balls,
  bag,
  app,
  keyboard,
  mainContainer,
  updateScore,
}) {
  balls.forEach((ball, index) => {
    ball.y += 5;

    // Check if ball has moved off-screen glitch take coin for back dont forget
    if (ball.y > app.screen.height) {
      mainContainer.removeChild(ball);
      balls.splice(index, 1);
      return;
    }
    let tolerance = 0;

    // Check for collision with basket tolerance for just tests!!!!!!
    if (
      ball.x < bag.x + bag.width + tolerance &&
      ball.x + ball.width > bag.x - tolerance &&
      ball.y < bag.y + bag.height + tolerance &&
      ball.y + ball.height > bag.y - tolerance
    ) {
      mainContainer.removeChild(ball);
      balls.splice(index, 1);
      updateScore();
    }
  });

  if (keyboard.left && bag.x > 0) {
    bag.x -= 5;
  }
  if (keyboard.right && bag.x < app.screen.width - bag.width) {
    bag.x += 5;
  }
}
