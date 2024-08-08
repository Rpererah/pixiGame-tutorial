import { Application, Sprite, AnimatedSprite, Spritesheet, Assets } from 'pixi.js';
import snakeImage from './snake.png'; // Ensure this path is correct
import tilesetData from './tilesetData.json'; // Ensure this path is correct

export class Snake {
    constructor(app) {
        this.app = app;
        this.spritesheetPath = snakeImage;
        this.tilesetData = tilesetData;
        this.textures = {};

        this.createSprites();
    }

    async createSprites() {
        try {
            console.log('Carregando texturas...');

            // Load the texture using Assets
            const texture = await Assets.load(this.spritesheetPath);

            if (!texture) {
                throw new Error('A textura não foi carregada corretamente.');
            }

            // Create the Spritesheet
            const spritesheet = new Spritesheet(texture, this.tilesetData);
            await spritesheet.parse();

            // Define layout for different parts of the snake
            const snakeParts = {
                head: ['frame1', 'frame2', 'frame3'], // Example frame names for the head animation
                body: ['frame4'], // Example frame for the body
                tail: ['frame5'] // Example frame for the tail
            };

            // Create head animation
            const headTextures = snakeParts.head.map(frameKey => spritesheet.textures[frameKey]);
            if (!headTextures.length) {
                throw new Error('Texturas da cabeça não foram carregadas.');
            }

            this.headSprite = new AnimatedSprite(headTextures); // Use AnimatedSprite for animation
            this.headSprite.x = this.app.canvas.width / 2;
            this.headSprite.y = this.app.canvas.height / 2;
            this.headSprite.anchor.set(0.5);
            this.headSprite.animationSpeed = 0.1; // Adjust speed as needed
            this.headSprite.play(); // Start animation
            this.app.stage.addChild(this.headSprite);

            // Create body sprite
            const bodyTexture = spritesheet.textures[snakeParts.body[0]];
            if (!bodyTexture) {
                throw new Error('Textura do corpo não foi carregada.');
            }

            this.bodySprite = new Sprite(bodyTexture);
            this.bodySprite.x = this.app.canvas.width / 2 + 50; // Adjust position as needed
            this.bodySprite.y = this.app.canvas.height / 2;
            this.bodySprite.anchor.set(0.5);
            this.app.stage.addChild(this.bodySprite);

            // Create tail sprite
            const tailTexture = spritesheet.textures[snakeParts.tail[0]];
            if (!tailTexture) {
                throw new Error('Textura da cauda não foi carregada.');
            }

            this.tailSprite = new Sprite(tailTexture);
            this.tailSprite.x = this.app.canvas.width / 2 + 100; // Adjust position as needed
            this.tailSprite.y = this.app.canvas.height / 2;
            this.tailSprite.anchor.set(0.5);
            this.app.stage.addChild(this.tailSprite);

            console.log('Sprites criados e adicionados ao stage');
        } catch (error) {
            console.error('Erro ao criar sprites:', error);
        }
    }
}

// Usage
const app = new Application({ width: 800, height: 600 });
document.body.appendChild(app.canvas); // Use app.canvas instead of app.view
new Snake(app);
