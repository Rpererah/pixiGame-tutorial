import {
  Application,
  Container,
  Graphics,
  Text,
  TextStyle,
  Ticker,
} from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.view);

  const REEL_WIDTH = 160;
  const SYMBOL_SIZE = 150;
  const SYMBOLS = ["1", "2", "3", "4"];

  // Create styles for the numbers
  const style = new TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fill: "#ffffff",
    align: "center",
  });

  // Create reel containers
  const reels = [];
  const reelContainer = new Container();

  for (let i = 0; i < 5; i++) {
    const rc = new Container();
    rc.x = i * REEL_WIDTH;
    reelContainer.addChild(rc);

    const reel = {
      container: rc,
      symbols: [],
      position: 0,
      previousPosition: 0,
    };

    // Create symbols with numbers
    for (let j = 0; j < 3; j++) {
      const text = new Text(
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        style
      );
      text.y = j * SYMBOL_SIZE;
      text.anchor.set(0.5);
      text.x = REEL_WIDTH / 2;
      reel.symbols.push(text);
      rc.addChild(text);
    }
    reels.push(reel);
  }
  app.stage.addChild(reelContainer);

  // Build top & bottom covers and position reelContainer
  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

  reelContainer.y = margin;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
  const top = new Graphics()
    .beginFill(0x0)
    .drawRect(0, 0, app.screen.width, margin);
  const bottom = new Graphics()
    .beginFill(0x0)
    .drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);

  // Add play text
  const playText = new Text("Spin the wheels!", style);
  playText.x = Math.round((bottom.width - playText.width) / 2);
  playText.y =
    app.screen.height - margin + Math.round((margin - playText.height) / 2);
  bottom.addChild(playText);

  // Add header text
  const headerText = new Text("PIXI MONSTER SLOTS!", style);
  headerText.x = Math.round((top.width - headerText.width) / 2);
  headerText.y = Math.round((margin - headerText.height) / 2);
  top.addChild(headerText);

  app.stage.addChild(top);
  app.stage.addChild(bottom);

  // Set the interactivity.
  bottom.interactive = true;
  bottom.buttonMode = true;
  bottom.on("pointerdown", () => {
    startPlay();
  });

  let running = false;

  // Function to start playing.
  function startPlay() {
    if (running) return;
    running = true;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2500 + i * 600 + extra * 600;

      tweenTo(
        r,
        "position",
        target,
        time,
        backout(0.5),
        null,
        i === reels.length - 1 ? reelsComplete : null
      );
    }
  }

  // Reels done handler.
  function reelsComplete() {
    running = false;
  }

  // Listen for animate update.
  app.ticker.add(() => {
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      // Update the position of the symbols
      r.symbols.forEach((text, index) => {
        text.y =
          ((r.position + index) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
        if (text.y < 0) {
          text.text = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        }
      });
    }
  });

  // Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
  const tweening = [];

  function tweenTo(
    object,
    property,
    target,
    time,
    easing,
    onchange,
    oncomplete
  ) {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    };

    tweening.push(tween);

    return tween;
  }

  // Listen for animate update.
  app.ticker.add(() => {
    const now = Date.now();
    const remove = [];

    for (let i = 0; i < tweening.length; i++) {
      const t = tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] = lerp(
        t.propertyBeginValue,
        t.target,
        t.easing(phase)
      );
      if (t.change) t.change(t);
      if (phase === 1) {
        t.object[t.property] = t.target;
        if (t.complete) t.complete(t);
        remove.push(t);
      }
    }
    for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1);
    }
  });

  // Basic lerp function.
  function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
  }

  // Backout function from tweenjs.
  function backout(amount) {
    return (t) => --t * t * ((amount + 1) * t + amount) + 1;
  }
})();
