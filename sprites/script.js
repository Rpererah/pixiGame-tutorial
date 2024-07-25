document.getElementById('fileInput').addEventListener('change', handleImageUpload);
document.getElementById('generateButton').addEventListener('click', generateCoordinates);

let image = new Image();
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let spriteWidth, spriteHeight;

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        image.src = URL.createObjectURL(file);
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
        };
    }
}

function generateCoordinates() {
    spriteWidth = parseInt(document.getElementById('spriteWidth').value);
    spriteHeight = parseInt(document.getElementById('spriteHeight').value);

    if (isNaN(spriteWidth) || isNaN(spriteHeight) || spriteWidth <= 0 || spriteHeight <= 0) {
        alert('Please enter valid sprite dimensions.');
        return;
    }

    const atlasData = {
        frames: {},
        meta: {
            image: image.src,
            size: { w: canvas.width, h: canvas.height }
        }
    };

    const numRows = Math.floor(canvas.height / spriteHeight);
    const numCols = Math.floor(canvas.width / spriteWidth);

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const name = `sprite_${row}_${col}`;
            const frame = {
                x: col * spriteWidth,
                y: row * spriteHeight,
                w: spriteWidth,
                h: spriteHeight
            };
            atlasData.frames[name] = { frame };
        }
    }

    document.getElementById('jsonOutput').textContent = JSON.stringify(atlasData, null, 2);
}
