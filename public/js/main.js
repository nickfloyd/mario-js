import { loadLevel } from './loaders.js';
import { loadBackgroundSprites } from './sprites.js';
import Timer from './timer.js';
import Compositor from './compositor.js';
import { createSpriteLayer, createBackgroundLayer } from './layers.js';
import { createMario } from './entities.js';
import Keyboard from './keyboardState.js'

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
  createMario(),
  loadBackgroundSprites(),
  loadLevel('1-1'),
])
.then(([ mario, backgroundSprites, level ]) => {
  const comp = new Compositor();

  const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
  comp.layers.push(backgroundLayer);

  const gravity = 700;
  mario.pos.set(32, 220);

  const SPACE = 32;
  const input = new Keyboard();
  input.addMapping(SPACE, keyState => {
    if(keyState) {
      mario.jump.start();
    } else {
      mario.jump.cancel();
    }
  });
  input.listenTo(window);
  

  const spriteLayer = createSpriteLayer(mario);
  comp.layers.push(spriteLayer);

  const timer = new Timer(1/60);

  timer.update = function update(deltaTime) {
    mario.update(deltaTime);

    comp.draw(context);

    mario.vel.y += gravity * deltaTime;
  }
  timer.start();
});


