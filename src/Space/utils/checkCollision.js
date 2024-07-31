// utils.js
export function checkCollision(obj1, obj2) {
  const obj1Bounds = obj1.getBounds();
  const obj2Bounds = obj2.getBounds();

  return (
    obj1Bounds.x < obj2Bounds.x + obj2Bounds.width &&
    obj1Bounds.x + obj1Bounds.width > obj2Bounds.x &&
    obj1Bounds.y < obj2Bounds.y + obj2Bounds.height &&
    obj1Bounds.y + obj1Bounds.height > obj2Bounds.y
  );
}
