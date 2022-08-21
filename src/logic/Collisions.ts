import Game from '../Game';
import Ship from '../units/Ship';
import { Rect } from '../primitive/Rect';
import Enemy from '../units/Enemy';
import Bullet from '../units/Bullet';

export default class Collisions {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    detectCollisions(ship: Ship, wallRectList: Rect[], enemies: Enemy[], bullets: Bullet[]) {
        // TODO Probably this work very slow, need to optimize it
        const shipRect = new Rect({ x: ship.position.x, y: ship.position.y, w: ship.width, h: ship.height });

        for (const wallRect of wallRectList) {
            if (this.isCollision(shipRect, wallRect)) {
                console.log('ship into wall');
                ship.restorePosition();
            }
        }

        for (const enemy of enemies) {
            // TODO Probably this work very slow, need to optimize it
            const enemyRect = new Rect({ x: enemy.position.x, y: enemy.position.y, w: enemy.width, h: enemy.height });

            if (this.isCollision(enemyRect, shipRect)) {
                console.log('ship into enemy');
                enemy.isOver = true;
            }

            for (const bullet of bullets) {
                // TODO Probably this work very slow, need to optimize it
                const bulletRect = new Rect({
                    x: bullet.position.x,
                    y: bullet.position.y,
                    w: bullet.width,
                    h: bullet.height,
                });

                if (this.isCollision(enemyRect, bulletRect)) {
                    console.log('bullet into enemy');
                    bullet.isOver = true;
                    enemy.isOver = true;
                }
            }
        }
    }

    isCollision(one: Rect, two: Rect) {
        return one.x + one.w >= two.x && one.x <= two.x + two.w && one.y + one.h >= two.y && one.y <= two.y + two.h;
    }
}
