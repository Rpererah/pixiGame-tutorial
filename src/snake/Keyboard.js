// Keyboard.js
class Keyboard {
    constructor(snake, options) {
      this.snake = snake;
      this.speed = options.speed || 5;
      this.keys = {};
      this.leftKey = options.leftKey;
      this.rightKey = options.rightKey;
      this.upKey = options.upKey;
      this.downKey = options.downKey;
  
      window.addEventListener('keydown', (e) => this.onKeyDown(e));
      window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }
  
    onKeyDown(event) {
      console.log(`Tecla pressionada: ${event.code}`);
      this.keys[event.code] = true;
    }
  
    onKeyUp(event) {
      console.log(`Tecla liberada: ${event.code}`);
      this.keys[event.code] = false;
    }
  
    update() {
  
      let dx = 0;
      let dy = 0;
  
      if (this.keys[this.leftKey]) {
        dx = -this.speed;
      }
      if (this.keys[this.rightKey]) {
        dx = this.speed;
      }
      if (this.keys[this.upKey]) {
        dy = -this.speed;
      }
      if (this.keys[this.downKey]) {
        dy = this.speed;
      }
  
      // Move todos os segmentos da cobra
      this.snake.moveAll(dx, dy);
  
    }
  }
  
  export default Keyboard;
  