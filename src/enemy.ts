import Game from './game';
import Path from './path';
import { Position } from './position';

export default class Enemy {
    public position: Position;
    private speed: { x: number; y: number };
    private speedRatio: number;
    private game: Game;
    public width: number;
    public height: number;
    public isOver: boolean;
    private startTime: number;
    private timePast: number;
    public path: Path;
    private image?: HTMLImageElement;

    constructor(game: Game, x: number, y: number, speedX: number, speedY: number) {
        this.game = game;
        this.position = new Position(x, y);
        this.speed = { x: speedX, y: speedY };
        this.speedRatio = 3;
        this.width = 40;
        this.height = 40;
        this.isOver = false;
        this.startTime = this.game.timePast;
        this.timePast = 0;
        this.path = new Path(this.game);
    }

    update(delta: number) {
        this.path.update(delta);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.position = this.path.position.clone();
        this.position.toInteger();

        this.path.draw(ctx);

        ctx.drawImage(this.getImage(), this.position.x, this.position.y, this.width, this.height);
    }

    getImage() {
        if (!this.image) {
            // 0,910958904
            this.image = document.getElementById('enemy') as HTMLImageElement;
        }

        return this.image;
    }
}
