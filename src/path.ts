import Game from "./game";
import {data} from "./enemies/bee";
import {Vector} from "./vector";
import {Position} from "./position";

export default class Path {
    private game: Game;
    public points: Position[];
    public position: Position;
    private targetPoint: number;
    private velocity: Vector;

    private prevPosition: Position;
    private prevSeek: Vector;
    private prevVelocity: Vector;
    private newVelocity: Vector;
    private starTime: number;
    private endTime: number;

    constructor(game: Game) {
        this.game = game;
        // this.points = [
        //     new Position(0, 0),
        //     new Position(50, 50),
        //     new Position(100, 100),
        //     new Position(125, 150),
        //     new Position(125, 200),
        //     new Position(150, 250),
        //     new Position(150, 250),
        //     new Position(175, 275),
        //     new Position(225, 300),
        //     new Position(250, 300),
        //     new Position(300, 275),
        //     new Position(325, 250),
        //     new Position(350, 200),
        // ];
        this.points = data.map(item => new Position(item.x, item.y));
        this.position = this.points[0].clone();
        this.targetPoint = 1;
        this.velocity = new Vector(0, 0);
        this.starTime = this.game.timePast;
        this.endTime = this.game.timePast;
    }

    seek(targetPosition: Position) {
        const dx = targetPosition.x - this.position.x;
        const dy = targetPosition.y - this.position.y;

        return new Vector(dx, dy);
    }

    update(delta: number) {
        if (this.targetPoint >= this.points.length) {
            return;
        }

        this.endTime = this.game.timePast;

        this.prevPosition = this.position.clone();
        this.prevVelocity = this.velocity.clone();

        const steeringForce = 30;
        const maxSpeed = 100;

        const targetPosition = this.points[this.targetPoint];

        const seekVector = this.seek(targetPosition);
        seekVector.normalize();
        seekVector.multiply(steeringForce);

        this.velocity.add(seekVector);
        this.velocity.truncate(maxSpeed);
        // this.velocity.multiply(maxSpeed);
        // this.velocity.multiply(delta);

        this.prevSeek = seekVector.clone();
        this.newVelocity = this.velocity.clone();

        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;

        const distance = this.distance(this.position, targetPosition);

        if (distance < 20) {
            this.targetPoint += 1;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        return;

        if (!this.prevSeek) {
            return;
        }

        ctx.fillStyle = "#fff";
        ctx.fillText(`Time: ${(this.endTime - this.starTime).toFixed(1)}`, this.position.x, this.position.y - 10);

        this.points.forEach((point, index) => {
            ctx.fillStyle = index === this.targetPoint ? 'red' : 'white';
            ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
            ctx.fillText(index.toString(), point.x + 10, point.y);
        });

        let position;

        ctx.strokeStyle = "red";
        ctx.beginPath();
        position = this.prevPosition.clone();
        ctx.moveTo(position.x, position.y);
        position.add(this.prevSeek);
        ctx.lineTo(position.x, position.y);
        ctx.stroke();

        ctx.strokeStyle = "white";
        ctx.beginPath();
        position = this.prevPosition.clone();
        ctx.moveTo(position.x, position.y);
        position.add(this.prevVelocity);
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
        //
        ctx.strokeStyle = "green";
        ctx.beginPath();
        position = this.prevPosition.clone();
        ctx.moveTo(position.x, position.y);
        position.add(this.newVelocity);
        ctx.lineTo(position.x, position.y);
        ctx.stroke();

    }

    distance(a: Position, b: Position) {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    }
}

