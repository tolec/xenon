import Game from './game';
import Enemy from './enemy';
import { EnemyPath } from './path/EnemyPath';

export default class EnemyGenerator {
    private game: Game;
    private nextEnemyTime: number;
    public enemies: Enemy[];

    constructor(game: Game) {
        this.game = game;
        this.nextEnemyTime = 0;
        this.enemies = [];
    }

    update(delta: number) {
        this.enemies.forEach(enemy => enemy.update(delta));
        this.enemies = this.enemies.filter(enemy => !enemy.isOver);

        if (!this.nextEnemyTime) {
            this.nextEnemyTime = this.game.timePast + 1 + Math.random() * 2;
        }

        if (this.game.timePast >= this.nextEnemyTime && this.enemies.length === 0) {
            this.nextEnemyTime = 0;

            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    this.enemies.push(new Enemy(new EnemyPath()));
                }, i * 1000);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
    }
}
