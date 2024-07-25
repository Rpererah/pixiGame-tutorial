import {AnimatedSprite, Application, Assets, Graphics, Rectangle, Sprite, Spritesheet} from 'pixi.js';
import { MyRectangle } from './Rectangle';
import { Line } from './Line';
import { Triangle } from './Triangle';
import { MyText } from './Text';
import logo from './assets/icon.svg';
import { MySprite } from './Sprite';
export const app = new Application();
import bulba from './assets/bulba.png'
import tileset from './assets/Tileset.png'

async function init(){

    //can set size, color, opacity

    await app.init({


        //alternative -->
        // height:window.innerHeight / 1.5,
        // width:window.innerWidth / 1.5
        // <--

        //set windowsize height and width
        resizeTo:window,
        backgroundAlpha: 0.5,
        backgroundColor: 0x00008b,

    });

    document.body.appendChild(app.canvas);
    app.canvas.style.position = 'absolute';



}

async function load() {
    
        const texture = await Assets.load(logo);
        return texture
       
}


 init()


// Create object to store sprite sheet data
const atlasData = {
    frames: {
      idle1: {
        frame: {x: 0, y: 0, w: 40, h: 40},
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      },
      idle2: {
        frame: {x: 45, y: 0, w: 40, h: 40}, // Corrigido
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      },
      idle3: {
        frame: {x: 90, y: 0, w: 40, h: 40},
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      },
      idle4: {
        frame: {x: 135, y: 0, w: 40, h: 40},
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      },
      idle5: {
        frame: {x: 180, y: 0, w: 40, h: 40}, // Corrigido
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      },
      idle6: {
        frame: {x: 220, y: 0, w: 40, h: 40},
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      },
      idle7: {
        frame: {x: 260, y: 0, w: 40, h: 40},
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      },
      idle8: {
        frame: {x: 295, y: 0, w: 40, h: 40},
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      },
      idle9: {
        frame: {x:330, y: 0, w: 40, h: 40},
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      },
      idle10: {
        frame: {x: 370, y: 0, w: 40, h: 40},
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      },
      walk1: {
        frame: {x: 0, y: 50, w: 35, h: 35}, // Corrigido
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      },
      walk2: {
        frame: {x: 35, y: 50, w: 35, h: 35},
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      },
      walk3: {
        frame: {x: 70, y: 50, w: 35, h: 35}, // Corrigido
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      },
      walk4: {
        frame: {x: 105, y: 50, w: 35, h: 35}, // Corrigido
        sourceSize: {w: 35, h: 35},
        spriteSourceSize: {x: 0, y: 0, w: 35, h: 35}
      }
    },
    meta: {
      image: bulba,
      size: {w: 450, h: 90} // Corrigido para refletir as dimensões reais
    },
    animations: {
      idle: ['idle1', 'idle2', 'idle3', 'idle4', 'idle5','idle6','idle7', 'idle8','idle9',  'idle10' ],
      walk: ['walk1', 'walk2', 'walk3', 'walk4']
    }
  };
  

  const texture = await Assets.load(atlasData.meta.image);

  const spritesheet = new Spritesheet(
    texture,
    atlasData
  );

  await spritesheet.parse();



  const tilesetData = {
    frames: {
        tile1: { frame: { x: 0, y: 0, w: 16, h: 32 } },
        tile2: { frame: { x: 16, y: 0, w: 16, h: 32 } },
        tile3: { frame: { x: 32, y: 0, w: 16, h: 32 } },
        tile4: { frame: { x: 0, y: 16, w: 16, h: 32 } },
        tile5: { frame: { x: 16, y: 16, w: 16, h: 32 } },
        tile6: { frame: { x: 32, y: 16, w: 16, h: 32 } },
    },
    meta: {
        image: tileset, 
        size: { w: 96, h: 32 }
    }
};

async function createTiles() {
    // Carrega a textura do tileset
    const texture = await Assets.load(tilesetData.meta.image);
    
    // Cria o Spritesheet
    const spritesheet = new Spritesheet(texture, tilesetData);
    await spritesheet.parse();

    // Define o layout da grade
    const gridLayout = [
        ['tile1', 'tile2', 'tile3'],
        ['tile4', 'tile5', 'tile6'],
    ];

    // Define o tamanho dos tiles e o espaçamento entre eles
    const tileWidth = 16;
    const tileHeight = 32;
    const tileSpacing = 0;

    // Adiciona blocos ao palco com base no layout da grade
    gridLayout.forEach((row, rowIndex) => {
        row.forEach((tileKey, colIndex) => {
            const texture = spritesheet.textures[tileKey];
            const sprite = new Sprite(texture);
            
            // Calcula a posição do tile com base no índice da linha e coluna
            sprite.x = colIndex * (tileWidth + tileSpacing);
            sprite.y = rowIndex * (tileHeight + tileSpacing);
            
            app.stage.addChild(sprite);
        });
    });
}

// Inicializa a criação dos blocos
createTiles();





  const animatedSprite = 
new AnimatedSprite(spritesheet.animations.idle);
app.stage.addChild(animatedSprite);
animatedSprite.height=100
animatedSprite.width=100
animatedSprite.play();
animatedSprite.animationSpeed = 0.15;




function moveSprite(direction){
    switch (direction) {
        case 'left':
            animatedSprite.x -= 20;
            animatedSprite.scale.x=3
          break;
        case 'right':
            animatedSprite.x += 20;
            animatedSprite.scale.x=-3
          break;
        case 'up':
            animatedSprite.y -= 10;
          break;
        case 'down':
            animatedSprite.y += 10;
          break;
}
}

function onKeyDown(event) {
    switch (event.code) {
      case 'ArrowLeft':
        moveSprite('left');
        break;
      case 'ArrowRight':
        moveSprite('right');
        break;
      case 'ArrowUp':
        moveSprite('up');
        break;
      case 'ArrowDown':
        moveSprite('down');
        break;
    }
  }
  
  // Adiciona o listener de eventos de teclado
  window.addEventListener('keydown', onKeyDown);

// console.log(load())
// const texture=await load()

// const myRectangle=new MyRectangle(200,200,100,150,0xffea00,0.5)
// const myLine=new Line(100,900,900,400,0x55faff)
// const myTriangle=new Triangle([
//     600, 50,
//     720, 400,
//     420, 400
//   ],0x8f5ff2,0xf5fa2f)

// const myText=new MyText('Hello Pixi',0xffffff,'Montserrat Medium',72,'italic','bold',0x4a1850,5,0x4a1850,4,Math.PI/6,6,true,440)
// const sprite=new Sprite(texture)
// sprite.height=200
// sprite.width=200
// sprite.scale.set(0.5, 0.5);
// sprite.rotation=Math.PI/4
// myRectangle.addStage(app.stage)
// myLine.addStage(app.stage)
// myTriangle.addStage(app.stage)
// myText.addStage(app.stage)
// app.stage.addChild(sprite)



// const otherRetangle=new Graphics()
// otherRetangle.rect(300,300,300,300)
// otherRetangle.fill({
//     color:0xffbb33,
//     alpha:0.8
// })

// app.stage.addChild(otherRetangle)

// otherRetangle.on('pointerdown', moveBox)

// function moveBox(){
//     otherRetangle.position.x-=10
//     otherRetangle.position.y+=10

// }

// otherRetangle.eventMode='static'


// const circle = new Graphics();
// app.ticker.add(()=>{
//     circle.circle(
//         Math.random() * app.screen.width,
//         Math.random() * app.screen.height,
//     5
//     )
//     .fill({
//         color: 0xffffff
//       });

//       app.stage.addChild(circle)
// })
