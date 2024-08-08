import {
  Application,
  Assets,
  Color,
  Container,
  Texture,
  Sprite,
  Graphics,
  Text,
  TextStyle,
  BlurFilter,
  FillGradient,
} from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Load the textures
  await Assets.load([
    "https://pixijs.com/assets/eggHead.png",
    "https://pixijs.com/assets/flowerTop.png",
    "https://pixijs.com/assets/helmlok.png",
    "https://pixijs.com/assets/skully.png",
  ]);

  const REEL_WIDTH = 160;
  const SYMBOL_SIZE = 150;

  // Create different slot symbols
  const slotTextures = [
    Texture.from("https://pixijs.com/assets/eggHead.png"),
    Texture.from("https://pixijs.com/assets/flowerTop.png"),
    Texture.from("https://pixijs.com/assets/helmlok.png"),
    Texture.from("https://pixijs.com/assets/skully.png"),
  ];

  // Build the reels
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
      blur: new BlurFilter(),
    };

    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];

    // Build the symbols
    for (let j = 0; j < 4; j++) {
      const symbol = new Sprite(
        slotTextures[Math.floor(Math.random() * slotTextures.length)]
      );
      symbol.y = j * SYMBOL_SIZE;
      symbol.scale.x = symbol.scale.y = Math.min(
        SYMBOL_SIZE / symbol.width,
        SYMBOL_SIZE / symbol.height
      );
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }
    reels.push(reel);
  }
  app.stage.addChild(reelContainer);

  // Build top & bottom covers and position reelContainer
  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

  reelContainer.y = margin;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
  const top = new Graphics()
    .rect(0, 0, app.screen.width, margin)
    .fill({ color: 0x0 });
  const bottom = new Graphics()
    .rect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin)
    .fill({ color: 0x0 });

  // Create gradient fill
  const fill = new FillGradient(0, 0, 0, 36 * 1.7);

  const colors = [0xffffff, 0x00ff99].map((color) =>
    Color.shared.setValue(color).toNumber()
  );

  colors.forEach((number, index) => {
    const ratio = index / colors.length;

    fill.addColorStop(ratio, number);
  });

  // Add play text
  const style = new TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fontStyle: "italic",
    fontWeight: "bold",
    fill: { fill },
    stroke: { color: 0x4a1850, width: 5 },
    dropShadow: {
      color: 0x000000,
      angle: Math.PI / 6,
      blur: 4,
      distance: 6,
    },
    wordWrap: true,
    wordWrapWidth: 440,
  });

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
  bottom.eventMode = "static";
  bottom.cursor = "pointer";
  bottom.addListener("pointerdown", () => {
    startPlay();
  });

  let running = false;

  // Capture the initial state
  let initialState;

  function captureInitialState() {
    return reels.map((reel) => ({
      textures: reel.symbols.map((symbol) => symbol.texture),
      positions: reel.symbols.map((symbol) => ({ x: symbol.x, y: symbol.y })),
    }));
  }

  function captureFinalState() {
    return reels.map((reel) => ({
      textures: reel.symbols.map((symbol) => symbol.texture),
      positions: reel.symbols.map((symbol) => ({ x: symbol.x, y: symbol.y })),
    }));
  }

  function compareStates(initialState, finalState) {
    initialState.forEach((initialReel, reelIndex) => {
      const finalReel = finalState[reelIndex];

      console.log(`Reel ${reelIndex}:`);

      initialReel.textures.forEach((initialTexture, symbolIndex) => {
        const finalTexture = finalReel.textures[symbolIndex];
        const initialPosition = initialReel.positions[symbolIndex];
        const finalPosition = finalReel.positions[symbolIndex];

        console.log(`  Symbol ${symbolIndex}:`);
        console.log(
          `    Initial Texture: ${initialTexture.baseTexture.resource.url}`
        );
        console.log(
          `    Final Texture: ${finalTexture.baseTexture.resource.url}`
        );
        console.log(
          `    Initial Position: x=${initialPosition.x}, y=${initialPosition.y}`
        );
        console.log(
          `    Final Position: x=${finalPosition.x}, y=${finalPosition.y}`
        );
      });
    });
  }

  // Function to start playing.
  function startPlay() {
    if (running) return;
    running = true;

    // Capture the initial state
    initialState = captureInitialState();

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2500 + i * 600 + extra * 600;

      tweenTo(r, "position", target, time, backout(0.5), null, () => {
        // Capture the final state after animation completes
        const finalState = captureFinalState();
        compareStates(initialState, finalState);
        reelsComplete();
      });
    }
  }

  // Reels done handler.
  function reelsComplete() {
    running = false;
  }

  // Listen for animate update.
  app.ticker.add(() => {
    // Update the slots.
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      // Update blur filter y amount based on speed.
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;

      // Update symbol positions on reel.
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevy = s.y;

        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          // Detect going over and swap a texture.
          s.texture =
            slotTextures[Math.floor(Math.random() * slotTextures.length)];
          s.scale.x = s.scale.y = Math.min(
            SYMBOL_SIZE / s.texture.width,
            SYMBOL_SIZE / s.texture.height
          );
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
        }
      }
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
      const elapsed = now - t.start;
      const ratio = Math.min(elapsed / t.time, 1);
      const easedRatio = t.easing ? t.easing(ratio) : ratio;

      t.object[t.property] =
        t.propertyBeginValue + (t.target - t.propertyBeginValue) * easedRatio;

      if (ratio >= 1) {
        if (t.change) t.change();
        if (t.complete) t.complete();
        remove.push(i);
      }
    }

    // Remove completed tweens
    for (let i = remove.length - 1; i >= 0; i--) {
      tweening.splice(remove[i], 1);
    }
  });

  // Backout easing function
  function backout(s) {
    return (x) => {
      const s1 = s || 1.70158;
      return x * x * ((s1 + 1) * x - s1);
    };
  }
})();
