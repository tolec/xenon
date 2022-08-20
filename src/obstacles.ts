import Game from './game';
import Wall from './wall';
import RectStorage from './rectStorage';
import { Rect } from './rect';

export default class Obstacles {
    private game: Game;
    private wall: Wall;
    private rectStorage: RectStorage;
    public rectList: Rect[] = [];
    public shownRectList: Rect[] = [];

    constructor(game: Game) {
        this.game = game;
        this.wall = new Wall(game);
        this.rectStorage = new RectStorage();
        this.initRectList();
        this.initPosition();
    }

    initRectList() {
        this.rectList = this.mapRectList(this.rectStorage.getRectList());
    }

    initPosition() {
        const image = this.wall.getImage();
        const scale = this.game.width / image.width;

        this.wall.position = image.height - this.game.height / scale;
    }

    mapRectList(storageRectList: Array<{ x: number; y: number; w: number; h: number }>) {
        const image = this.wall.getImage();
        const scale = this.game.width / image.width;

        return storageRectList.map(rect => {
            const x = Math.round(rect.x * scale);
            const y = Math.round(rect.y * scale);
            const w = Math.round(rect.w * scale);
            const h = Math.round(rect.h * scale);

            return new Rect({ x, y, w, h });
        });
    }

    update(delta: number) {
        const speed = 10;

        this.wall.position -= speed * delta;

        if (this.wall.position < 0) {
            this.wall.position = 0;
        }

        const image = this.wall.getImage();
        const scale = this.game.width / image.width;

        this.shownRectList = this.rectList.map(({ x, y, w, h }) => {
            return new Rect({ x, y: Math.round(y - this.wall.position * scale), w, h });
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        const image = this.wall.getImage();
        const scale = this.game.width / image.width;
        const imageCropHeight = Math.round(this.game.height / scale);

        ctx.drawImage(
            image,
            0,
            this.wall.position,
            image.width,
            imageCropHeight,
            0,
            0,
            this.game.width,
            this.game.height,
        );

        ctx.fillStyle = 'rgba(255, 200, 100, 0.5)';

        this.shownRectList.forEach(({ x, y, w, h }) => {
            ctx.fillRect(x, y, w, h);
        });
    }
}
