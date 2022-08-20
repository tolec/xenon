import Game from './game';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

const ctx = canvas.getContext('2d', { alpha: false })!;
ctx.imageSmoothingEnabled = false;

const game = new Game(GAME_WIDTH, GAME_HEIGHT, canvas);

let deltaTime = 0;
let oldTimeStamp = 0;

const startTime = Date.now();

function requestLoop(loopCallback) {
    requestAnimationFrame(loopCallback);
    return;

    setTimeout(() => {
        loopCallback(Date.now() - startTime);
    }, 70);
}

function gameLoop(timeStamp) {
    deltaTime = Math.min((timeStamp - oldTimeStamp) / 1000, 0.1);
    oldTimeStamp = timeStamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    game.update(deltaTime);
    game.draw(ctx);

    requestLoop(gameLoop);
}

requestLoop(gameLoop);
