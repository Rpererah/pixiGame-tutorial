class Keyboard {
  constructor(snake, options) {
    this.snake = snake;
    this.keys = {};
    this.leftKey = options.leftKey;
    this.rightKey = options.rightKey;
    this.upKey = options.upKey;
    this.downKey = options.downKey;

    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
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
    if (this.keys[this.leftKey] && this.snake.direction !== "right") {
      this.snake.setNextDirection("left");
    }
    if (this.keys[this.rightKey] && this.snake.direction !== "left") {
      this.snake.setNextDirection("right");
    }
    if (this.keys[this.upKey] && this.snake.direction !== "down") {
      this.snake.setNextDirection("up");
    }
    if (this.keys[this.downKey] && this.snake.direction !== "up") {
      this.snake.setNextDirection("down");
    }
  }
}

export default Keyboard;
