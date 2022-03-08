import Game from "./game";
import Path from "./path";

export default class Enemy {
    public position: { x: number, y: number }
    private startPosition: { x: number; y: number };
    private speed: { x: number, y: number };
    private speedRatio: number;
    private game: Game;
    public width: number;
    public height: number;
    public isOver: boolean;
    private startTime: number;
    private timePast: number;
    public path: Path;

    constructor(game: Game, x: number, y: number, speedX: number, speedY: number) {
        this.game = game;
        this.startPosition = {x: 0, y: 0};
        this.position = {x, y};
        this.speed = {x: speedX, y: speedY};
        this.speedRatio = 3;
        this.width = 30;
        this.height = 30;
        this.isOver = false;
        this.startTime = this.game.timePast;
        this.timePast = 0;
        this.path = new Path(this.game);
    }

    update(delta: number) {
        this.path.update(delta);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.position = this.path.position;

        this.path.draw(ctx);

        ctx.fillStyle = "#a4f";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
