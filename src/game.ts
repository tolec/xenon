import Ship from "./ship";
import Collisions from "./collisions";
import EnemyGenerator from "./enemyGenerator";
import StarrySky from "./starrySky";
import Walls from "./walls";

export default class Game {
    public width: number;
    public height: number;
    public timePast: number;
    private ship: Ship;
    private collisions: Collisions;
    private lastEnemyTime: number;
    private enemyInterval: number;
    private enemyGenerator: EnemyGenerator;
    private starrySky: StarrySky;
    private walls: Walls;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.lastEnemyTime = 0;
        this.enemyInterval = 2000;
        this.timePast = 0;
        this.ship = new Ship(this);
        this.collisions = new Collisions(this);
        this.enemyGenerator = new EnemyGenerator(this);
        this.starrySky = new StarrySky(this);
        this.walls = new Walls(this);
    }

    update(delta: number) {
        this.timePast += delta;

        this.ship.update(delta);
        this.collisions.detectCollisions(this.enemyGenerator.enemies, [...this.ship.bullets, this.ship]);
        this.enemyGenerator.update(delta);
        this.starrySky.update(delta);
        this.walls.update(delta);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.starrySky.draw(ctx);
        this.walls.draw(ctx);
        this.enemyGenerator.draw(ctx);
        this.ship.draw(ctx);

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
