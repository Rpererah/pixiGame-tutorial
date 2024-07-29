import { Sprite, AnimatedSprite, Spritesheet, Assets } from 'pixi.js';
import snakeImage from './snake.png'; 
import tilesetData from './snake.json'; 

export default class Snake {
    constructor(app) {
        this.app = app;
        this.spritesheetPath = snakeImage;
        this.tilesetData = tilesetData;
        this.textures = {};
        this.bodySprites = [];

        this.createSprites().then(() => {
            console.log('Sprites criados com sucesso.');
        }).catch((error) => {
            console.error('Erro ao criar sprites:', error);
        });
    }

    async createSprites() {
        try {
            console.log('Carregando texturas...');

            const texture = await Assets.load(this.spritesheetPath);
            if (!texture) {
                throw new Error('A textura não foi carregada corretamente.');
            }

            const spritesheet = new Spritesheet(texture, this.tilesetData);
            await spritesheet.parse();

            console.log('Texturas disponíveis:', spritesheet.textures);

            const snakeParts = {
                head: ['head1', 'head2', 'head3'],
                body: ['body'],
                tail: ['tail']
            };

            const headTextures = snakeParts.head.map(frameKey => {
                const texture = spritesheet.textures[frameKey];
                if (!texture) {
                    console.error(`Textura não encontrada: ${frameKey}`);
                }
                return texture;
            }).filter(texture => texture !== undefined);

            if (!headTextures.length) {
                throw new Error('Texturas da cabeça não foram carregadas.');
            }

            this.headSprite = new AnimatedSprite(headTextures);
            this.setupSprite(this.headSprite, this.app.screen.width - 100, this.app.screen.height / 2, 0.2);
            this.headSprite.play();
            this.app.stage.addChild(this.headSprite);

            const bodyTexture = spritesheet.textures[snakeParts.body[0]];
            if (!bodyTexture) {
                throw new Error('Textura do corpo não foi carregada.');
            }

            // Cria o segmento inicial do corpo
            this.bodyTexture = bodyTexture;
            this.createBodySegment(this.headSprite.x - 5, this.headSprite.y - 40);

            const tailTexture = spritesheet.textures[snakeParts.tail[0]];
            if (!tailTexture) {
                throw new Error('Textura da cauda não foi carregada.');
            }

            this.tailSprite = new Sprite(tailTexture);
            this.setupSprite(this.tailSprite, this.headSprite.x - 4, this.headSprite.y - 50);
            this.app.stage.addChild(this.tailSprite);
            this.flipSpriteVertically(this.tailSprite);

            console.log('Sprites criados e adicionados ao stage');

        } catch (error) {
            console.error('Erro ao criar sprites:', error);
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

            return headBounds.x < rectBounds.x + rectBounds.width &&
                   headBounds.x + headBounds.width > rectBounds.x &&
                   headBounds.y < rectBounds.y + rectBounds.height &&
                   headBounds.y + headBounds.height > rectBounds.y;
        } else {
            console.error('HeadSprite está ausente.');
            return false;
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
            this.headSprite.x += x;
            this.headSprite.y += y;

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

            this.wrapSprite(this.headSprite);
            this.bodySprites.forEach(sprite => this.wrapSprite(sprite));
            this.wrapSprite(this.tailSprite);
        } else {
            console.error('Sprites ausentes, espere mais.');
        }
    }

    wrapSprite(sprite) {
        const buffer = 50; // Adicione um pequeno buffer para uma transição mais suave

        if (sprite.x < -buffer) {
            sprite.x = this.app.screen.width + buffer;
        } else if (sprite.x > this.app.screen.width + buffer) {
            sprite.x = -buffer;
        }

        if (sprite.y < -buffer) {
            sprite.y = this.app.screen.height + buffer;
        } else if (sprite.y > this.app.screen.height + buffer) {
            sprite.y = -buffer;
        }
    }

    handleCollision() {
        const lastBodySprite = this.bodySprites[this.bodySprites.length - 1];
        this.createBodySegment(lastBodySprite.x - 5, lastBodySprite.y - 40);
    }
}
