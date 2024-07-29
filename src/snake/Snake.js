import {
  Sprite,
  AnimatedSprite,
  Spritesheet,
  Assets,
  TextStyle,
  Text,
} from "pixi.js";
import snakeImage from "./snake.png";
import tilesetData from "./snake.json";

export default class Snake {
  constructor(app) {
    this.app = app;
    this.spritesheetPath = snakeImage;
    this.tilesetData = tilesetData;
    this.textures = {};
    this.bodySprites = [];
    this.direction = "right"; // Direção inicial
    this.nextDirection = "right"; // Próxima direção
    this.moveSpeed = 10; // Velocidade de movimentação
    this.isGameOver = false;

    this.createSprites()
      .then(() => {
        console.log("Sprites criados com sucesso.");
        this.startAutoMove();
      })
      .catch((error) => {
        console.error("Erro ao criar sprites:", error);
      });
  }

  async createSprites() {
    try {
      console.log("Carregando texturas...");

      const texture = await Assets.load(this.spritesheetPath);
      if (!texture) {
        throw new Error("A textura não foi carregada corretamente.");
      }

      const spritesheet = new Spritesheet(texture, this.tilesetData);
      await spritesheet.parse();

      console.log("Texturas disponíveis:", spritesheet.textures);

      const snakeParts = {
        head: ["head1", "head2", "head3"],
        body: ["body"],
        tail: ["tail"],
      };

      const headTextures = snakeParts.head
        .map((frameKey) => {
          const texture = spritesheet.textures[frameKey];
          if (!texture) {
            console.error(`Textura não encontrada: ${frameKey}`);
          }
          return texture;
        })
        .filter((texture) => texture !== undefined);

      if (!headTextures.length) {
        throw new Error("Texturas da cabeça não foram carregadas.");
      }

      this.headSprite = new AnimatedSprite(headTextures);
      this.setupSprite(
        this.headSprite,
        this.app.screen.width - 100,
        this.app.screen.height / 2,
        0.2
      );
      this.headSprite.play();
      this.app.stage.addChild(this.headSprite);

      const bodyTexture = spritesheet.textures[snakeParts.body[0]];
      if (!bodyTexture) {
        throw new Error("Textura do corpo não foi carregada.");
      }

      this.bodyTexture = bodyTexture;
      this.createBodySegment(this.headSprite.x - 5, this.headSprite.y - 40);

      const tailTexture = spritesheet.textures[snakeParts.tail[0]];
      if (!tailTexture) {
        throw new Error("Textura da cauda não foi carregada.");
      }

      this.tailSprite = new Sprite(tailTexture);
      this.setupSprite(
        this.tailSprite,
        this.headSprite.x - 4,
        this.headSprite.y - 50
      );
      this.app.stage.addChild(this.tailSprite);
      this.flipSpriteVertically(this.tailSprite);

      console.log("Sprites criados e adicionados ao stage");
    } catch (error) {
      console.error("Erro ao criar sprites:", error);
    }
  }

  setupSprite(sprite, x, y, animationSpeed = 1) {
    sprite.x = x;
    sprite.y = y;
    sprite.anchor.set(0.5);
    sprite.animationSpeed = animationSpeed;
  }

  flipSpriteHorizontally(sprite) {
    sprite.scale.x = -1; // Espelhar horizontalmente
  }

  flipSpriteVertically(sprite) {
    sprite.scale.y = -1; // Espelhar verticalmente
  }

  rotateSprite(sprite, angle) {
    sprite.rotation = angle; // Rotacionar
  }

  checkCollision(rectangle) {
    if (this.headSprite) {
      const headBounds = this.headSprite.getBounds();
      const rectBounds = rectangle.getBounds();

      return (
        headBounds.x < rectBounds.x + rectBounds.width &&
        headBounds.x + headBounds.width > rectBounds.x &&
        headBounds.y < rectBounds.y + rectBounds.height &&
        headBounds.y + headBounds.height > rectBounds.y
      );
    } else {
      console.error("HeadSprite está ausente.");
      return false;
    }
  }

  handleCollision() {
    // Verifica se a cabeça da cobra colidiu com o próprio corpo
    for (let i = 0; i < this.bodySprites.length; i++) {
      const bodySprite = this.bodySprites[i];
      if (this.checkCollision(bodySprite)) {
        this.endGame();
        return;
      }
    }

    // Verifica se a cabeça da cobra colidiu com as bordas da tela
    if (
      this.headSprite.x < 0 ||
      this.headSprite.x > this.app.screen.width ||
      this.headSprite.y < 0 ||
      this.headSprite.y > this.app.screen.height
    ) {
      this.endGame();
    }
  }

  createBodySegment(x, y) {
    const bodyTexture = this.bodyTexture;
    const bodySprite = new Sprite(bodyTexture);
    this.setupSprite(bodySprite, x, y);
    this.app.stage.addChild(bodySprite);
    this.bodySprites.push(bodySprite);
  }

  moveAll(x, y) {
    if (this.headSprite && this.bodySprites.length > 0 && this.tailSprite) {
      const newHeadX = this.headSprite.x + x;
      const newHeadY = this.headSprite.y + y;

      // Atualiza a posição da cabeça
      this.headSprite.x = newHeadX;
      this.headSprite.y = newHeadY;

      // Atualiza a posição dos segmentos do corpo
      let previousSegment = this.headSprite;
      this.bodySprites.forEach((bodySprite, index) => {
        if (index === 0) {
          bodySprite.x = previousSegment.x - 5;
          bodySprite.y = previousSegment.y - 40;
        } else {
          const prevBodySprite = this.bodySprites[index - 1];
          bodySprite.x = prevBodySprite.x;
          bodySprite.y = prevBodySprite.y - 30;
        }
        previousSegment = bodySprite;
      });

      // Atualiza a posição da cauda
      const lastBodySprite = this.bodySprites[this.bodySprites.length - 1];
      this.tailSprite.x = lastBodySprite.x;
      this.tailSprite.y = lastBodySprite.y - 20;

      // Verifica colisões
      this.handleCollision();
    } else {
      console.error("Sprites ausentes, espere mais.");
    }
  }

  moveSnake() {
    if (this.direction !== this.nextDirection) {
      // Atualiza a direção apenas se for diferente
      this.direction = this.nextDirection;
    }

    let x = 0;
    let y = 0;

    switch (this.direction) {
      case "left":
        x = -this.moveSpeed;
        break;
      case "right":
        x = this.moveSpeed;
        break;
      case "up":
        y = -this.moveSpeed;
        break;
      case "down":
        y = this.moveSpeed;
        break;
    }

    this.moveAll(x, y);
  }

  startAutoMove() {
    this.autoMoveInterval = setInterval(() => {
      if (!this.isGameOver) {
        this.moveSnake();
      }
    }, 100); // Ajuste a taxa de movimento conforme necessário
  }

  setNextDirection(direction) {
    this.nextDirection = direction;
  }

  endGame() {
    this.isGameOver = true;
    clearInterval(this.autoMoveInterval);
    const style = new TextStyle({
      fontSize: 64,
      fill: "#ffffff",
      align: "center",
    });
    const gameOverText = new Text("Game Over", style);
    gameOverText.x = this.app.screen.width / 2;
    gameOverText.y = this.app.screen.height / 2;
    gameOverText.anchor.set(0.5);
    this.app.stage.addChild(gameOverText);

    this.app.renderer.background.color = 0x000000; // Torna o fundo preto
  }
}
