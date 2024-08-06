export function checkCollision(hero, topTube, bottomTube) {
  const birdBounds = hero.getBounds();
  const topTubeBounds = topTube.getBounds();
  const bottomTubeBounds = bottomTube.getBounds();

  const margemSeguranca = -195; //lembre de ajustar a hitbox da imagem ta ridicula de grande
  const marginTopSecurity = -135;

  const expandedTopTubeBounds = {
    x: topTubeBounds.x - margemSeguranca,
    y: topTubeBounds.y - marginTopSecurity,
    width: topTubeBounds.width + 2 * margemSeguranca,
    height: topTubeBounds.height + 2 * marginTopSecurity,
  };

  const expandedBottomTubeBounds = {
    x: bottomTubeBounds.x - margemSeguranca,
    y: bottomTubeBounds.y - marginTopSecurity,
    width: bottomTubeBounds.width + 2 * margemSeguranca,
    height: bottomTubeBounds.height + 2 * marginTopSecurity,
  };

  const collisionTop =
    birdBounds.x < expandedTopTubeBounds.x + expandedTopTubeBounds.width &&
    birdBounds.x + birdBounds.width > expandedTopTubeBounds.x &&
    birdBounds.y < expandedTopTubeBounds.y + expandedTopTubeBounds.height &&
    birdBounds.y + birdBounds.height > expandedTopTubeBounds.y;

  const collisionBottom =
    birdBounds.x <
      expandedBottomTubeBounds.x + expandedBottomTubeBounds.width &&
    birdBounds.x + birdBounds.width > expandedBottomTubeBounds.x &&
    birdBounds.y <
      expandedBottomTubeBounds.y + expandedBottomTubeBounds.height &&
    birdBounds.y + birdBounds.height > expandedBottomTubeBounds.y;

  return collisionTop || collisionBottom;
}
