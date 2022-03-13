import Game from "./game";
import PathGenerator from "./pathGenerator";
import RectGenerator from "./rectGenerator";

const canvas = document.getElementById('game') as HTMLCanvasElement;
const gameWrap = document.getElementById('game-wrap') as HTMLElement;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 640;

const ctx = canvas.getContext('2d', {alpha: false})!;
ctx.imageSmoothingEnabled = false;

const game = new Game(GAME_WIDTH, GAME_HEIGHT);
let deltaTime = 0;
let oldTimeStamp = 0;

const startTime = Date.now();

const pathGenerator = new PathGenerator(gameWrap);
const rectGenerator = new RectGenerator(gameWrap);

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

    // ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    game.update(deltaTime);
    game.draw(ctx);

    // pathGenerator.draw(ctx);
    rectGenerator.draw(ctx);

    requestLoop(gameLoop);
}

requestLoop(gameLoop);
