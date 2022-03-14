import Game from "./game";

export default class Wall {
    public position: number;
    private game: Game;
    private image?: HTMLImageElement;

    constructor(game: Game) {
        this.game = game;
        this.initPosition();
    }

    initPosition() {
        const image = this.getImage();
        const scale = this.game.width / image.width;

        this.position = image.height - this.game.height / scale;
    }

    update(delta: number) {
        const speed = 10;

        this.position -= speed * delta;

        if (this.position < 0) {
            this.position = 0;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const image = this.getImage();
        const scale = this.game.width / image.width;
        const imageCropHeight = Math.round(this.game.height / scale);

        ctx.drawImage(
            image,
            0,
            this.position,
            image.width,
            imageCropHeight,
            0,
            0,
            this.game.width,
            this.game.height,
        );
    }

    getImage() {
        if (!this.image) {
            this.image = document.getElementById('level1') as HTMLImageElement;
            this.image.width = 320;
            this.image.height = 3342;
        }

        return this.image;
    }
}
