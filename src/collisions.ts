import Game from "./game";
import Enemy from "./enemy";
import Bullet from "./bullet";

interface Rect {
    position: { x: number, y: number },
    width: number;
    height: number;
    isOver: boolean;
}

export default class Collisions {
    private game: Game;

    constructor(game: Game) {
        this.game = game;

    }

    detectCollisions(enemies: Rect[], bullets: Rect[]) {
        bullets.forEach(bullet => {
            enemies.forEach(enemy => {
                if (this.isCollision(bullet, enemy)) {
                    bullet.isOver = true;
                    enemy.isOver = true;
                }
            });
        })
    }

    isCollision(bullet: Rect, enemy: Rect) {
        return (
            bullet.position.x + bullet.width >= enemy.position.x &&
            bullet.position.x <= enemy.position.x + enemy.width &&
            bullet.position.y + bullet.height >= enemy.position.y &&
            bullet.position.y <= enemy.position.y + enemy.height
        );
    }
}
