import Game from "./game";
import Ship from './ship';
import Walls from './walls';

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

    detectCollisions(ship: Ship, walls: Walls, enemies: Rect[], bullets: Rect[]) {
        for (const enemy of enemies) {
            if (this.isCollision(enemy, ship)) {
                console.log('ship into enemy');
                enemy.isOver = true;
            }

            for (const bullet of bullets) {
                if (this.isCollision(enemy, bullet)) {
                    console.log('bullet into enemy');
                    bullet.isOver = true;
                    enemy.isOver = true;
                }
            }
        }
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
