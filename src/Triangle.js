import { Graphics } from "pixi.js";

export class Triangle{
    constructor(array=[],colorFill,colorStroke){
        this.triangle=new Graphics()
        this.triangle.poly(array)
        .fill({colorFill})
        .stroke({colorStroke})


}

    addStage(stage){
        stage.addChild(this.triangle)
    }

}