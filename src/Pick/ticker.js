import { Ticker } from 'pixi.js';

export const createTicker = (updateGame) => {
  const ticker = Ticker.shared;
  ticker.autoStart = false;
  ticker.add(() => {
    updateGame();
  });
  ticker.start();

  return ticker;
};
