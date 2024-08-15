import {
  Application,
  Assets,
  Container,
  Texture,
  Sprite,
  BlurFilter,
  Graphics,
  Text,
  TextStyle,
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

  const spriteValues = {
    cherry: 10,
    galaxy: 20,
    pikachu: 30,
    seven: 40,
  };

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

  let score = 0;

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

    reelResults.sort((a, b) => a.y - b.y);

    console.log("Slot Positions:", reelResults);

    const targetX = 5;
    const tolerance = 2;

    function getLinesForCount(count) {
      switch (count) {
        case 1:
          return [15];
        case 2:
          return [-90, 15, 120];
        case 3:
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
          winningLine = `Linha y=${line}`;
          winningLabel = label;
          console.log(
            `Ganhou na ${winningLine} com o rótulo do sprite: ${label}`
          );

          // Atualiza a pontuação com base no símbolo vencedor
          const symbolScore = spriteValues[label] || 0;
          score += symbolScore;
          ScoreText.text = score.toString(); // Atualiza o texto da pontuação
          break;
        }
      }

      if (winningLine) break;
    }

    function checkDiagonals() {
      const diagonals = [
        { positions: [0, 4, 8], name: "Diagonal 1" },
        { positions: [2, 4, 6], name: "Diagonal 2" },
      ];

      for (const diagonal of diagonals) {
        const resultsOnDiagonal = diagonal.positions.map(
          (index) => reelResults[index]
        );

        const allSameLabel = resultsOnDiagonal.every(
          (result) =>
            result && result.spriteLabel === resultsOnDiagonal[0].spriteLabel
        );

        if (allSameLabel) {
          winningLine = diagonal.name;
          winningLabel = resultsOnDiagonal[0].spriteLabel;
          console.log(
            `Ganhou na ${winningLine} com o rótulo do sprite: ${winningLabel}`
          );

          // Atualiza a pontuação com base no símbolo vencedor
          const symbolScore = spriteValues[winningLabel] || 0;
          score += symbolScore;
          ScoreText.text = score.toString(); // Atualiza o texto da pontuação
          return;
        }
      }
    }

    if (count === 3) {
      checkDiagonals();
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

  //teste de ligar
  // Função para adicionar gráficos amarelos
  function addGraphicsYellow() {
    if (!globalThis.yellowGraphics) {
      globalThis.yellowGraphics = [];

      const yellowGraphicsData = [
        { x: 35, y: 70 },
        { x: 35, y: 415 },
        { x: 715, y: 415 },
        { x: 715, y: 70 },
      ];

      yellowGraphicsData.forEach((data) => {
        const roundedRectangle = new Graphics();
        roundedRectangle
          .roundRect(data.x, data.y, 50, 15, 15)
          .fill({ color: 0xf8f000, alpha: 0.7 });
        app.stage.addChild(roundedRectangle);
        globalThis.yellowGraphics.push(roundedRectangle);
      });
    }
  }
  function addLittleYellowGraphics() {
    if (!globalThis.littleYellowGraphics) {
      globalThis.littleYellowGraphics = [];

      const graphicsData = [
        { x: 130, y: 21, width: 25, rotation: Math.PI / 6 },
        { x: 536, y: 421, width: 25, rotation: -Math.PI / 6 },
        { x: -118, y: 407, width: 25, rotation: -Math.PI / 6 },
        { x: 787, y: 7, width: 25, rotation: Math.PI / 6 },
        { x: 570, y: 12, width: 15, rotation: Math.PI / 6 },
        { x: 356, y: 16, width: 15, rotation: Math.PI / 6 },
        { x: 108, y: 412, width: 15, rotation: -Math.PI / 6 },
        { x: 322, y: 416, width: 15, rotation: -Math.PI / 6 },
      ];

      graphicsData.forEach((data) => {
        const graphics = new Graphics();
        graphics
          .roundRect(data.x, data.y, data.width, 5, 15)
          .fill({ color: 0xf8f000, alpha: 0.8 });
        graphics.rotation = data.rotation;
        app.stage.addChild(graphics);
        globalThis.littleYellowGraphics.push(graphics);
      });
    }
  }

  // Função para adicionar gráficos verdes
  function addGraphicsGreen() {
    if (!globalThis.greenGraphics) {
      globalThis.greenGraphics = [];

      const greenGraphicsData = [
        { x: 35, y: 142 },
        { x: 35, y: 342 },
        { x: 717, y: 342 },
        { x: 717, y: 142 },
      ];

      greenGraphicsData.forEach((data) => {
        const roundedRectangle = new Graphics();
        roundedRectangle
          .roundRect(data.x, data.y, 48, 15, 15)
          .fill({ color: 0x66e5a4, alpha: 0.7 });
        app.stage.addChild(roundedRectangle);
        globalThis.greenGraphics.push(roundedRectangle);
      });
    }
  }

  function addGraphicsBlue() {
    if (!globalThis.blueGraphics) {
      globalThis.blueGraphics = [];

      const blueGraphicsData = [
        { x: 35, y: 242 },
        { x: 717, y: 242 },
      ];

      blueGraphicsData.forEach((data) => {
        const roundedRectangleBlue = new Graphics();
        roundedRectangleBlue
          .roundRect(data.x, data.y, 48, 15, 15)
          .fill({ color: 0x7a7aff, alpha: 0.4 });
        app.stage.addChild(roundedRectangleBlue);
        globalThis.blueGraphics.push(roundedRectangleBlue);
      });
    }
  }

  function addLittleBlueGraphics() {
    if (!globalThis.littleBlueGraphics) {
      globalThis.littleBlueGraphics = [];

      const blueGraphicsData = [
        { x: 103, y: 247, width: 25 },
        { x: 299, y: 247, width: 15 },
        { x: 486, y: 247, width: 15 },
        { x: 672, y: 247, width: 25 },
      ];

      blueGraphicsData.forEach((data) => {
        const graphics = new Graphics();
        graphics
          .roundRect(data.x, data.y, data.width, 5, 15)
          .fill({ color: 0x7a7aff, alpha: 0.8 });
        app.stage.addChild(graphics);
        globalThis.littleBlueGraphics.push(graphics);
      });
    }
  }

  function addLittleGreenGraphics() {
    if (!globalThis.littleGreenGraphics) {
      globalThis.littleGreenGraphics = [];

      const greenGraphicsData = [
        { x: 104, y: 147, width: 25 },
        { x: 672, y: 147, width: 25 },
        { x: 299, y: 147, width: 15 },
        { x: 486, y: 147, width: 15 },
        { x: 104, y: 347, width: 25 },
        { x: 672, y: 347, width: 25 },
        { x: 299, y: 347, width: 15 },
        { x: 486, y: 347, width: 15 },
      ];

      greenGraphicsData.forEach((data) => {
        const graphics = new Graphics();
        graphics
          .roundRect(data.x, data.y, data.width, 5, 15)
          .fill({ color: 0x66e5a4, alpha: 0.7 });
        app.stage.addChild(graphics);
        globalThis.littleGreenGraphics.push(graphics);
      });
    }
  }

  function removeAllYellowGraphics() {
    if (globalThis.yellowGraphics) {
      removeGraphics(globalThis.yellowGraphics);
      globalThis.yellowGraphics = null;
    }
    if (globalThis.littleYellowGraphics) {
      removeGraphics(globalThis.littleYellowGraphics);
      globalThis.littleYellowGraphics = null;
    }
  }

  function removeAllBlueGraphics() {
    if (globalThis.blueGraphics) {
      removeGraphics(globalThis.blueGraphics);
      globalThis.blueGraphics = null;
    }

    if (globalThis.littleBlueGraphics) {
      removeGraphics(globalThis.littleBlueGraphics);
      globalThis.littleBlueGraphics = null;
    }
  }

  function removeAllGreenGraphics() {
    if (globalThis.greenGraphics) {
      removeGraphics(globalThis.greenGraphics);
      globalThis.greenGraphics = null;
    }
    if (globalThis.littleGreenGraphics) {
      removeGraphics(globalThis.littleGreenGraphics);
      globalThis.littleGreenGraphics = null;
    }
  }

  // Função para remover gráficos
  function removeGraphics(graphics) {
    if (graphics) {
      graphics.forEach((graphic) => {
        app.stage.removeChild(graphic);
      });
    }
  }

  // Atualiza os gráficos com base no valor de count
  function updateCount(increment) {
    if (running) return;

    count += increment;
    console.log("Atualizando count para:", count);

    if (count > 3) {
      count = 0;
    } else if (count < 0) {
      count = 3;
    }

    // Remove gráficos existentes antes de adicionar novos
    removeAllYellowGraphics();
    removeAllBlueGraphics();
    removeAllGreenGraphics();

    if (count === 3) {
      addGraphicsYellow();
      addLittleYellowGraphics();
    }

    if (count >= 2) {
      addGraphicsGreen();
      addLittleGreenGraphics();
    }
    if (count >= 1) {
      addGraphicsBlue();
      addLittleBlueGraphics();
    }
  }
  const TextScoreStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: 28,
    fontWeight: "bold",
    fill: "#ff0000",
    align: "center",
    stroke: "#000000",
    strokeThickness: 4,
  });
  const ScoreText = new Text({ text: "0", style: TextScoreStyle });
  ScoreText.x = 280;
  ScoreText.y = 550;
  app.stage.addChild(ScoreText);

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
