import Game from './Game';
import Bullet from './Bullet';
import { Vector } from './Vector';

type MoveArray = number[];

export default class Ship {
    public position: Vector;
    public prevPosition: Vector;
    public width: number;
    public height: number;
    private game: Game;
    private speedX: number;
    private speedY: number;
    private isShooting: boolean;
    private shootingSpeed: number;
    public bullets: Bullet[];
    public isOver: boolean;
    private timeFromLastShoot: number;
    private image?: HTMLImageElement;

    public moveX: MoveArray;
    public moveY: MoveArray;

    constructor(game: Game) {
        this.game = game;
        this.speedX = 250;
        this.speedY = 200;
        this.position = new Vector(400, 300);
        this.width = 75;
        this.height = 60;
        this.isShooting = false;
        this.shootingSpeed = 1 / 3; // delay between shoots
        this.timeFromLastShoot = 0;
        this.bullets = [];

        this.moveX = [];
        this.moveY = [];
        this.addEventListeners();
    }

    addEventListeners() {
        document.addEventListener('keydown', event => {
            switch (event.code) {
                case 'ArrowLeft':
                    this.addMove(this.moveX, -1);
                    break;
                case 'ArrowRight':
                    this.addMove(this.moveX, 1);
                    break;
                case 'ArrowUp':
                    this.addMove(this.moveY, -1);
                    break;
                case 'ArrowDown':
                    this.addMove(this.moveY, 1);
                    break;
                case 'Space':
                    this.isShooting = true;
                    break;
            }
        });

        document.addEventListener('keyup', event => {
            switch (event.code) {
                case 'ArrowLeft':
                    this.deleteMove(this.moveX, -1);
                    break;
                case 'ArrowRight':
                    this.deleteMove(this.moveX, 1);
                    break;
                case 'ArrowUp':
                    this.deleteMove(this.moveY, -1);
                    break;
                case 'ArrowDown':
                    this.deleteMove(this.moveY, 1);
                    break;
                case 'Space':
                    this.isShooting = false;
                    break;
            }
        });
    }

    addMove(moveArray: MoveArray, direction: number) {
        if (!moveArray.includes(direction)) {
            moveArray.push(direction);
        }
    }

    deleteMove(moveArray: MoveArray, direction: number) {
        const index = moveArray.indexOf(direction);

        if (index !== -1) {
            moveArray.splice(index, 1);
        }
    }

    update(delta: number) {
        this.updatePosition(delta);
        this.updateBullets(delta);
        this.updateShooting(delta);
    }

    updatePosition(delta: number) {
        const xDirection = this.moveX[this.moveX.length - 1] || 0;
        const yDirection = this.moveY[this.moveY.length - 1] || 0;

        this.speedX = 5;
        this.speedY = 3;

        const speed = xDirection ? 300 : 200;
        const vector = new Vector(xDirection * this.speedX, yDirection * this.speedY);
        vector.normalize();
        vector.multiplySelf(delta * speed);

        this.prevPosition = this.position.clone();
        this.position.addSelf(vector);

        if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > this.game.width) {
            this.position.x = this.game.width - this.width;
        }

        if (this.position.y < 0) {
            this.position.y = 0;
        } else if (this.position.y + this.height > this.game.height) {
            this.position.y = this.game.height - this.height;
        }
    }

    updateBullets(delta: number) {
        this.bullets.forEach(bullet => bullet.update(delta));
        this.bullets = this.bullets.filter(bullet => !bullet.isOver);
    }

    updateShooting(delta: number) {
        this.timeFromLastShoot += delta;

        if (!this.isShooting) {
            return;
        }

        if (this.timeFromLastShoot >= this.shootingSpeed) {
            this.timeFromLastShoot = 0;
            this.fire();
        }
    }

    restorePosition() {
        this.position = this.prevPosition;
    }

    fire() {
        const bullet = new Bullet(this.game, this.position.x + this.width / 2, this.position.y, 0, -1);

        this.bullets.push(bullet);
    }

    draw(ctx: CanvasRenderingContext2D) {
        // ctx.fillStyle = this.isOver ? '#833' : "#bcf";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        ctx.drawImage(this.getImage(), this.position.x, this.position.y, this.width, this.height);

        this.bullets.forEach(bullet => bullet.draw(ctx));
    }

    getImage() {
        if (!this.image) {
            // 1,265359477
            this.image = document.getElementById('spaceship') as HTMLImageElement;
        }

        return this.image;
    }
}
