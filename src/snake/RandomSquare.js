import { Graphics } from "pixi.js"

export class RandomSquare{
    constructor(size=50){
        this.size=size
        this.square=new Graphics()
        this.setRandomPosition();
    }

        draw(x,y){
            const color =0x000000;
            this.square.rect(x, y, this.size, this.size)
            .fill({color,alpha:0.5})

        }
        setRandomPosition(){
        const x = Math.random() * (window.innerWidth - this.size);
        const y = Math.random() * (window.innerHeight - this.size);
        this.draw(x,y)

    }

    addStage(stage){
        stage.addChild(this.square)

    }
    
    removeStage(stage) {
        stage.removeChild(this.square);
    }

    getBounds() {
        return this.square.getBounds();
    }

}