import Game from './Game';

export default class Bullet {
    public position: { x: number; y: number };
    private speed: { x: number; y: number };
    private speedRatio: number;
    private game: Game;
    public width: number;
    public height: number;
    public isOver: boolean;
    private image: HTMLImageElement;

    constructor(game: Game, x: number, y: number, speedX: number, speedY: number) {
        this.width = 12;
        this.height = 20;
        this.game = game;
        this.position = { x: x - this.width / 2, y };
        this.speed = { x: speedX, y: speedY };
        this.speedRatio = 300;
        this.isOver = false;
    }

    update(delta: number) {
        this.position.x += this.speed.x * this.speedRatio * delta;
        this.position.y += this.speed.y * this.speedRatio * delta;

        if (
            this.position.x + this.width < 0 ||
            this.position.x > this.game.width ||
            this.position.y + this.height < 0 ||
            this.position.y > this.game.height
        ) {
            this.isOver = true;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        // ctx.fillStyle = "#fea";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        ctx.drawImage(this.getImage(), 368, 1464, 32, 64, this.position.x, this.position.y, this.width, this.height);
    }

    getImage() {
        if (!this.image) {
            this.image = document.getElementById('ships') as HTMLImageElement;
        }

        return this.image;
    }
}
