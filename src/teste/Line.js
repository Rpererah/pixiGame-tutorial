import { Graphics } from "pixi.js";

export class Line{
    constructor(xMoveTo,yMoveTo,xLineTo,yLineTo,stokeColor){
        this.line= new Graphics()
        this.line.moveTo(xMoveTo,yMoveTo)
        .lineTo(xLineTo,yLineTo)
        .stroke({
            color:stokeColor
        })
    }

    addStage(stage){
        stage.addChild(this.line)
    }

}