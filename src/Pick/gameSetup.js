export function setupGame({
  app,
  balls,
  mainContainer,
  createCoin,
  bag,
  getWindowDimensions,
  background,
}) {
  const intervalId = setInterval(async () => {
    const newBall = await createCoin(app);
    balls.push(newBall);
    mainContainer.addChild(newBall);
  }, 1000);

  // Ajustar para mobile depois
  window.addEventListener("resize", () => {
    const { width, height } = getWindowDimensions();
    app.renderer.resize(width, height);
    app.view.style.width = `${width}px`;
    app.view.style.height = `${height}px`;

    bag.x = width / 2 - 50;
    bag.y = height - 50;

    if (background) {
      background.width = width;
      background.height = height;
    }
  });

  // Limpeza
  window.addEventListener("beforeunload", () => {
    clearInterval(intervalId);
    balls.forEach((ball) => mainContainer.removeChild(ball));
  });
}
