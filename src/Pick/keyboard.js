export const createKeyboardControls = () => {
    const keyboard = {
      left: false,
      right: false,
    };
  
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') keyboard.left = true;
      if (e.key === 'ArrowRight') keyboard.right = true;
    });
  
    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') keyboard.left = false;
      if (e.key === 'ArrowRight') keyboard.right = false;
    });
  
    return keyboard;
  };
  