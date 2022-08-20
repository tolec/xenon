import Ship from './ship';
import Collisions from './collisions';
import EnemyGenerator from './enemyGenerator';
import StarrySky from './starrySky';
import Wall from './wall';
import PathDrawer from './pathDrawer';
import RectDrawer from './rectDrawer';
import Obstacles from './obstacles';

type Mode = 'play' | 'rect-editor' | 'path-editor';

export default class Game {
    public mode: Mode = 'play';
    public width: number;
    public height: number;
    public timePast: number;
    private ship: Ship;
    private collisions: Collisions;
    private lastEnemyTime: number;
    private enemyInterval: number;
    private enemyGenerator: EnemyGenerator;
    private starrySky: StarrySky;
    private wall: Wall;
    private obstacles: Obstacles;
    private canvas: HTMLCanvasElement;
    private pathDrawer?: PathDrawer;
    private rectDrawer?: RectDrawer;

    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
        this.width = width;
        this.height = height;
        this.lastEnemyTime = 0;
        this.enemyInterval = 2000;
        this.timePast = 0;
        this.ship = new Ship(this);
        this.collisions = new Collisions(this);
        this.enemyGenerator = new EnemyGenerator(this);
        this.starrySky = new StarrySky(this);
        this.wall = new Wall(this);
        this.obstacles = new Obstacles(this);
        this.canvas = canvas;

        this.listen();
    }

    listen() {
        document.addEventListener('keydown', this.onKeydown.bind(this));
    }

    onKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'KeyE':
                return this.switchMode();
        }
    }

    switchMode() {
        switch (this.mode) {
            case 'path-editor':
                this.pathDrawer?.destroy();
                delete this.pathDrawer;
                break;
            case 'rect-editor':
                this.rectDrawer?.destroy();
                delete this.rectDrawer;
                break;
        }

        const modes: Mode[] = ['play', 'rect-editor', 'path-editor'];
        const curIndex = modes.indexOf(this.mode);
        const newIndex = (curIndex + 1) % modes.length;

        this.mode = modes[newIndex];

        switch (this.mode) {
            case 'path-editor':
                this.pathDrawer = new PathDrawer(this.canvas);
                break;
            case 'rect-editor':
                this.rectDrawer = new RectDrawer(this, this.canvas);
                break;
        }
    }

    update(delta: number) {
        this.timePast += delta;

        switch (this.mode) {
            case 'play':
                this.starrySky.update(delta);
                this.obstacles.update(delta);
                this.ship.update(delta);
                this.collisions.detectCollisions(
                    this.ship,
                    this.obstacles.shownRectList,
                    this.enemyGenerator.enemies,
                    this.ship.bullets,
                );
                this.enemyGenerator.update(delta);
                break;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        switch (this.mode) {
            case 'play':
                this.starrySky.draw(ctx);
                this.obstacles.draw(ctx);
                this.enemyGenerator.draw(ctx);
                this.ship.draw(ctx);
                break;
            case 'rect-editor':
                this.rectDrawer?.draw(ctx);
                break;
            case 'path-editor':
                this.pathDrawer?.draw(ctx);
                break;
        }

        // ctx.fillStyle = "red";
        // const enemies = this.enemyGenerator.enemies.map(item => {
        //     return `[${item.position.x.toFixed(0)}, ${item.position.y.toFixed(0)}]`;
        // });
        // ctx.fillText(`Enemies: ${this.enemyGenerator.enemies.length}, ${enemies}`, 20, 20);
        //
        // ctx.fillStyle = "orange";
        // ctx.fillText(`Bullets: ${this.ship.bullets.length}`, 20, 30);
        //
        // ctx.fillStyle = "white";
        // ctx.fillText(`Stars: ${this.starrySky.stars.length}`, 20, 40);

        // ctx.fillStyle = "red";
        // ctx.fillText(`Position: ${this.ship.position.x}, ${this.ship.position.y}`, 20, 40);
    }
}
