import {Text} from 'pixi.js';
export class MyText{
    constructor(text,
        fill = 'black',
        fontFamily = 'Arial',
        fontSize = 24,
        fontStyle = 'normal',
        fontWeight = 'normal',
        strokeColor = 'black',
        strokeWidth = 0,
        dropShadowColor = 'black',
        dropShadowBlur = 0,
        dropShadowAngle = 0,
        dropShadowDistance = 0,
        wordWrap = false,
        wordWrapWidth = 100){
        this.myText=new Text({
            text: text,
            style: {
                // `fill` is the same as the `color` property
                // in CSS.
                fill,
                // Make sure you have the font is installed
                // before you use it.
                fontFamily,
                fontSize,
                fontStyle,
                fontWeight,
                stroke: { color: strokeColor, width: strokeWidth },
                dropShadow: {
                    color: dropShadowColor,
                    blur: dropShadowBlur,
                    angle: dropShadowAngle,
                    distance: dropShadowDistance,
                },
                wordWrap: wordWrap,
                wordWrapWidth: wordWrapWidth
              }
        })


    }
    addStage(stage){
        stage.addChild(this.myText)
    }
}