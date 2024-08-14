import {
  Application,
  Assets,
  Container,
  Texture,
  Sprite,
  BlurFilter,
} from "pixi.js";

(async () => {
  const app = new Application();
  globalThis.__PIXI_APP__ = app;

  await app.init({ background: "#1099bb" });

  document.body.appendChild(app.canvas);

  await Assets.load([
    "src/Slot/assets/cherry.png",
    "src/Slot/assets/galaxy.png",
    "src/Slot/assets/pikachu.png",
    "src/Slot/assets/seven.png",
    "src/Slot/assets/background.png",
    "src/Slot/assets/background/background-1.png",
    "src/Slot/assets/background/background-2.png",
    "src/Slot/assets/background/background-3.png",
    "src/Slot/assets/background/background-4.png",
    "src/Slot/assets/background/background-5.png",
    "src/Slot/assets/background/background-6.png",
  ]);

  const textures = [
    "src/Slot/assets/background/background-1.png",
    "src/Slot/assets/background/background-2.png",
    "src/Slot/assets/background/background-3.png",
    "src/Slot/assets/background/background-4.png",
    "src/Slot/assets/background/background-5.png",
    "src/Slot/assets/background/background-6.png",
  ];

  await Assets.load(textures);

  const backgroundContainer = new Container();
  app.stage.addChild(backgroundContainer);

  for (let i = 1; i < 4; i++) {
    const bgTexture = Texture.from(textures[i]);
    const bgSprite = new Sprite(bgTexture);
    bgSprite.width = app.screen.width;
    bgSprite.height = app.screen.height / 6;
    bgSprite.x = 0;
    bgSprite.y = i * bgSprite.height;
    backgroundContainer.addChild(bgSprite);
  }

  const REEL_WIDTH = 100;
  const SYMBOL_SIZE = 90;

  const slotTextures = [
    { texture: Texture.from("src/Slot/assets/cherry.png"), label: "cherry" },
    { texture: Texture.from("src/Slot/assets/galaxy.png"), label: "galaxy" },
    { texture: Texture.from("src/Slot/assets/pikachu.png"), label: "pikachu" },
    { texture: Texture.from("src/Slot/assets/seven.png"), label: "seven" },
  ];

  // Build the reels
  const reels = [];
  const reelContainer = new Container();

  for (let i = 0; i < 3; i++) {
    const rc = new Container();
    rc.x = i * (REEL_WIDTH + 90); // Entre os rolos
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
    for (let j = 0; j < 3; j++) {
      const symbolInfo =
        slotTextures[Math.floor(Math.random() * slotTextures.length)];
      const symbolTexture = symbolInfo.texture;
      const symbolLabel = symbolInfo.label;

      const symbol = new Sprite(symbolTexture);
      symbol.scale.set(
        SYMBOL_SIZE / symbol.texture.width,
        SYMBOL_SIZE / symbol.texture.height
      );

      // Organize vertical positions
      symbol.y = j * SYMBOL_SIZE;
      symbol.x = Math.round(REEL_WIDTH - symbol.width) / 2; // Centraliza horizontalmente
      symbol.label = symbolLabel; //nome
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }

    reels.push(reel);
  }

  app.stage.addChild(reelContainer);

  function checkWinningCondition() {
    const reelResults = [];

    reels.forEach((reel, reelIndex) => {
      reel.symbols.forEach((sprite) => {
        reelResults.push({
          reelIndex,
          spriteLabel: sprite.label,
          x: sprite.x,
          y: sprite.y,
        });
      });
    });

    // Ordena os resultados pela coordenada y
    reelResults.sort((a, b) => a.y - b.y);

    console.log("Slot Positions:", reelResults);

    const targetX = 5;
    const tolerance = 2;

    function getLinesForCount(count) {
      switch (count) {
        case 0:
          return [15]; // Linha única
        case 1:
          return [-90, 15, 120]; // verifica as 3 linhas
        case 2:
          return [-90, 15, 120];
        default:
          return [15];
      }
    }

    const lines = getLinesForCount(count);

    let winningLine = null;
    let winningLabel = null;

    for (const line of lines) {
      const filteredResults = reelResults.filter(
        (result) =>
          Math.abs(result.x - targetX) < tolerance &&
          Math.abs(result.y - line) < tolerance
      );

      const labelCount = filteredResults.reduce((acc, result) => {
        acc[result.spriteLabel] = (acc[result.spriteLabel] || 0) + 1;
        return acc;
      }, {});

      for (const [label, count] of Object.entries(labelCount)) {
        if (count >= 3) {
          winningLine = line;
          winningLabel = label;
          console.log(
            `Ganhou na linha y=${line} com o rótulo do sprite: ${label}`
          );
          break;
        }
      }

      if (winningLine) break;
    }

    if (!winningLine) {
      console.log("Não ganhou");
    }
  }

  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

  reelContainer.y = margin + 20;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5) - 130;

  const topOverlayTexture = Texture.from(
    "src/Slot/assets/background/background-1.png"
  );
  const topOverlaySprite = new Sprite(topOverlayTexture);

  topOverlaySprite.width = app.screen.width;
  topOverlaySprite.height = app.screen.height / 6;

  topOverlaySprite.x = 0;
  topOverlaySprite.y = 0;
  app.stage.addChild(topOverlaySprite);

  const overlayImages = [4, 5];
  for (const index of overlayImages) {
    const overlayTexture = Texture.from(textures[index]);
    const overlaySprite = new Sprite(overlayTexture);

    overlaySprite.width = app.screen.width;
    overlaySprite.height = app.screen.height / 6;

    overlaySprite.x = 0;
    overlaySprite.y = overlaySprite.height * index;
    app.stage.addChild(overlaySprite);
  }

  app.stage.interactive = true;
  app.stage.cursor = "pointer";

  app.stage.on("pointerdown", () => {
    startPlay();
  });

  let running = false;

  function startPlay() {
    if (running) return;
    running = true;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2500 + i * 600 + extra;

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

  function reelsComplete() {
    running = false;

    checkWinningCondition();
  }

  app.ticker.add(() => {
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;

      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        s.y =
          ((r.position + j) % r.symbols.length) * (SYMBOL_SIZE + 15) -
          SYMBOL_SIZE;

        if (s.y > app.screen.height + SYMBOL_SIZE) {
          r.container.removeChild(s);

          s.y = -SYMBOL_SIZE;
          r.container.addChild(s);
        }
      }
    }
  });

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

  function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
  }

  function backout(amount) {
    return (t) => --t * t * ((amount + 1) * t + amount) + 1;
  }

  let count = 0;

  function updateCount(increment) {
    count += increment;
    console.log("Atualizando count para:", count);

    if (count > 2) {
      count = 0;
    } else if (count < 0) {
      count = 2;
    }
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case "ArrowUp":
        updateCount(1);
        break;
      case "ArrowDown":
        updateCount(-1);
        break;
    }
  }

  document.addEventListener("keydown", handleKeyDown);
})();
