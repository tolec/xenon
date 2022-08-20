import { Position } from './position';
import { EnemyPath } from './path/EnemyPath';

export default class Enemy {
    public position: Position;
    public width: number;
    public height: number;
    public isOver: boolean;
    public path: EnemyPath;
    private image?: HTMLImageElement;

    constructor(path: EnemyPath) {
        this.position = path.getPosition();
        this.width = 40;
        this.height = 40;
        this.isOver = false;
        this.path = path;
    }

    update(delta: number) {
        this.path.update(delta);
        this.position = this.path.getPosition();

        if (this.path.isFinish()) {
            this.isOver = true;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
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
