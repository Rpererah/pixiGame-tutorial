import { Sprite } from 'pixi.js';

export class MySprite {
    constructor(mytexture, height, width, scaleX, scaleY, rotation, pivotX, pivotY) {  
            this.sprite = new Sprite(mytexture);
            this.sprite.height = height;
            this.sprite.width = width;
            this.sprite.scale.x = scaleX;
            this.sprite.scale.y = scaleY;
            this.sprite.rotation = rotation;
            this.sprite.pivot.x = pivotX;
            this.sprite.pivot.y = pivotY;
        } 

    addStage(stage) {

        stage.addChild(this.sprite);
    }
}
