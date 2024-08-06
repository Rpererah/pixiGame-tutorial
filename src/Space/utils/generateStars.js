import { createStar } from "../star";

export async function generateStars(app, container) {
  const numStars = Math.random() * 20;
  for (let i = 0; i < numStars; i++) {
    const star = await createStar(app);
    container.addChild(star);
  }
}
